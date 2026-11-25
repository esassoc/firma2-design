#!/usr/bin/env python3
"""Baseline bookkeeping for prototype-to-stories.

Run from the repo root. Standard library only.

  drift.py baseline <requirements-dir>     record hashes of the feature's scope
  drift.py reopen   <requirements-dir>     back to exploring (hashes are kept)
  drift.py status   <dir> [--quiet|--json] report drift for every manifest under <dir>

A manifest is <requirements-dir>/manifest.json:
  {"feature": "...", "state": "exploring|baselined", "revision": 0,
   "scope": ["glob", ...], "baseline": null | {"date", "commit", "files": {path: sha}}}
Scope globs are relative to the repo root and may use **.
"""
import glob
import hashlib
import json
import os
import subprocess
import sys
from datetime import date


def load(req_dir):
    path = os.path.join(req_dir, "manifest.json")
    with open(path, encoding="utf-8") as f:
        return path, json.load(f)


def save(path, manifest):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, sort_keys=False)
        f.write("\n")


def scoped_files(manifest):
    found = set()
    for pattern in manifest.get("scope", []):
        for match in glob.glob(pattern, recursive=True):
            if os.path.isfile(match):
                found.add(os.path.normpath(match).replace(os.sep, "/"))
    return sorted(found)


def sha(path):
    digest = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def head_commit():
    try:
        out = subprocess.run(
            ["git", "rev-parse", "HEAD"], capture_output=True, text=True, check=True
        )
        return out.stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        return None


def diff(manifest):
    base = (manifest.get("baseline") or {}).get("files", {})
    now = {p: sha(p) for p in scoped_files(manifest)}
    return {
        "changed": sorted(p for p in now if p in base and now[p] != base[p]),
        "added": sorted(p for p in now if p not in base),
        "removed": sorted(p for p in base if p not in now),
    }


def cmd_baseline(req_dir):
    path, manifest = load(req_dir)
    files = scoped_files(manifest)
    if not files:
        sys.exit(f"{path}: scope matches no files; nothing to baseline")
    manifest["state"] = "baselined"
    manifest["revision"] = int(manifest.get("revision", 0)) + 1
    manifest["baseline"] = {
        "date": date.today().isoformat(),
        "commit": head_commit(),
        "files": {p: sha(p) for p in files},
    }
    save(path, manifest)
    print(f"{manifest['feature']}: baselined r{manifest['revision']}, {len(files)} files")


def cmd_reopen(req_dir):
    path, manifest = load(req_dir)
    manifest["state"] = "exploring"
    save(path, manifest)
    print(f"{manifest['feature']}: exploring")


def cmd_status(root, flags):
    quiet, as_json = "--quiet" in flags, "--json" in flags
    report = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ("node_modules", ".git", "dist")]
        if "manifest.json" not in filenames:
            continue
        try:
            _, manifest = load(dirpath)
        except (OSError, ValueError):
            continue
        if "scope" not in manifest or "feature" not in manifest:
            continue
        entry = {"feature": manifest["feature"], "dir": dirpath, "state": manifest.get("state")}
        # A reopened feature keeps its baseline, so sync can still diff against it.
        if manifest.get("baseline"):
            entry.update(diff(manifest))
            entry["revision"] = manifest.get("revision")
        report.append(entry)

    if as_json:
        print(json.dumps(report, indent=2))
        return
    for entry in report:
        if entry["state"] != "baselined":
            if not quiet:
                print(f"{entry['feature']}: exploring (not checked)")
            continue
        total = len(entry["changed"]) + len(entry["added"]) + len(entry["removed"])
        if total == 0:
            if not quiet:
                print(f"{entry['feature']}: in step with baseline r{entry['revision']}")
            continue
        if quiet:
            print(
                f"Requirements may be stale — {entry['feature']}: {total} prototype "
                f"file(s) changed since baseline r{entry['revision']}. "
                f"Run /prototype-to-stories {entry['feature']} sync"
            )
            continue
        print(f"{entry['feature']}: {total} file(s) differ from baseline r{entry['revision']}")
        for kind in ("changed", "added", "removed"):
            for p in entry[kind]:
                print(f"  {kind}: {p}")


def main(argv):
    if len(argv) < 3 or argv[1] not in ("baseline", "reopen", "status"):
        sys.exit(__doc__)
    if argv[1] == "baseline":
        cmd_baseline(argv[2])
    elif argv[1] == "reopen":
        cmd_reopen(argv[2])
    else:
        cmd_status(argv[2], argv[3:])


if __name__ == "__main__":
    main(sys.argv)
