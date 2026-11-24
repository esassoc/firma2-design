#!/usr/bin/env python3
"""check stage of prototype-to-stories: coverage matrix and mechanical lint.

usage: coverage.py <out> <spec.md> <open-questions.md> [--template FILE] [--write] [--json FILE]

Reads only the feature's own files and holds no feature-specific IDs:
  <out>/inventory.md        every `| ID | … |` row (ACT, OBJ, SCR, STA, ACN, RUL)
  <out>/stories/NN-*.md     header lines, `Rn.` requirement lines, `**Sn — …** (proves …)`,
                            the Trace table `| Rn | tag | inventory IDs |` in the collapsed notes
  <out>/story-map.md        the Stories table, "Open questions by story",
                            "Covered by standing requirements", "Dependencies on other features",
                            "Out of scope", and whether a Goals table exists
  <out>/epics/*.md          the story tables
  spec.md                   rows `| n | decision |`
  open-questions.md         `**Q-n …` blocks and their `Answer:` lines

Exclusions are read from the map, never from this file:
  - an ID in a bullet under "Covered by standing requirements"      -> standing requirement
  - an ID in the Needs cell of "Dependencies on other features"      -> owned by that feature
  - an ID or `spec #n` in the Item cell of "Out of scope"            -> that row's Why
    (`part of <ID>` in that cell is a partial exclusion: the item must still be covered)
  - an inventory row whose statement starts with "struck"            -> struck
  - ACT items                                                       -> the map's Goals table
A covering requirement always wins over an exclusion.

With --write, fills the template's {{PLACEHOLDERS}} and writes <out>/coverage.md.
"""
import re, sys, json, pathlib, collections, datetime

args = sys.argv[1:]
def opt(name, has_value=True):
    if name in args:
        k = args.index(name)
        v = args[k + 1] if has_value else True
        del args[k:k + (2 if has_value else 1)]
        return v
    return None
TEMPLATE = opt("--template"); JSON_OUT = opt("--json"); WRITE = opt("--write", False)
OUT = pathlib.Path(args[0]); SPEC = pathlib.Path(args[1]).read_text(); OQ = pathlib.Path(args[2]).read_text()

ID = r"(?:ACT|OBJ|SCR|STA|ACN|RUL)-\d+"
KINDS = ("SCR", "STA", "ACN", "RUL", "OBJ", "ACT")
NAMES = {"SCR": "Screens", "STA": "States", "ACN": "Actions", "RUL": "Rules", "OBJ": "Objects", "ACT": "Actors"}
inv = (OUT / "inventory.md").read_text()
mp = (OUT / "story-map.md").read_text()
qn = lambda q: int(q[2:])

def short(s, n=120):
    s = re.sub(r"\s+", " ", s).strip().split(" Gap pass:")[0].split(" Split 2026")[0].replace("|", "/")
    return s if len(s) <= n else s[:n].rsplit(" ", 1)[0] + " …"

def section(text, title):
    m = re.search(rf"^## {re.escape(title)}[^\n]*\n(.*?)(?=^## |\Z)", text, re.M | re.S)
    return m.group(1) if m else ""

def table(text):
    """rows of the first markdown table in text, as dicts keyed by header"""
    rows, head = [], None
    for line in text.splitlines():
        if not line.startswith("|"):
            if head and rows: break
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if head is None: head = cells; continue
        if set("".join(cells)) <= set("-: "): continue
        rows.append(dict(zip(head, cells + [""] * (len(head) - len(cells)))))
    return rows

def col(row, *starts):
    for k, v in row.items():
        if k.lower().startswith(tuple(s.lower() for s in starts)): return v
    return ""

findings = collections.OrderedDict()
def flag(kind, msg): findings.setdefault(kind, []).append(msg)

# ── inventory ──
items = collections.OrderedDict()
for line in inv.splitlines():
    m = re.match(rf"\| ({ID}) \|", line)
    if not m: continue
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    i = cells[0]; stmt = cells[2] if i[:3] in ("STA", "ACN") else cells[1]
    if i in items: flag("inventory ID used twice", i)
    items[i] = {"statement": stmt, "row": line, "struck": stmt.startswith("struck")}

# ── open questions ──
q_blocks = {m.group(1): m.group(0) for m in re.finditer(r"^\*\*(Q-\d+)[ .\[].*?(?=^\*\*Q-|^#|\Z)", OQ, re.M | re.S)}
q_answered = {q for q, b in q_blocks.items() if re.search(r"^Answer: \S", b, re.M)}

# ── stories ──
stories = collections.OrderedDict()
for p in sorted((OUT / "stories").glob("*.md")):
    t = p.read_text(); n = p.name[:2]
    head = t.split("\n## ", 1)[0]
    f = lambda k: (re.search(rf"^{k}: (.*)$", head, re.M) or [None, ""])[1].strip()
    reqs = collections.OrderedDict((m.group(1), m.group(2)) for m in re.finditer(r"^(R\d+)\. (.*)$", t, re.M))
    scen_part = section(t, "Scenarios")
    scens = collections.OrderedDict()
    for m in re.finditer(r"^\*\*(S\d+) — [^*]*\*\*(.*)$", scen_part, re.M):
        pr = re.search(r"\(proves ([^)]*)\)", m.group(2))
        rs = []
        if pr:
            for a, b in re.findall(r"R(\d+) to R(\d+)", pr.group(1)): rs += [f"R{k}" for k in range(int(a), int(b) + 1)]
            rs += [r for r in re.findall(r"R\d+", pr.group(1)) if r not in rs]
        scens[m.group(1)] = rs
    oq_part = section(t, "Open questions").split("<details", 1)[0]
    qs, q_lines = [], []
    for l in oq_part.splitlines():
        if l.startswith("- "):
            lead, _, rest = l.partition(" — ")
            for q in re.findall(r"Q-\d+", lead):
                qs.append(q); q_lines.append((q, rest))
    trace = collections.OrderedDict()
    notes = t.split("<details", 1)[1] if "<details" in t else ""
    for m in re.finditer(r"^\| (R\d+) \| ([^|]*) \| ([^|]*) \|\s*$", notes, re.M):
        own, relied = [], []      # relied: (story, id)
        for seg in m.group(3).split(";"):
            rm = re.search(r"relies on (?:story|enabler) (\d\d)", seg)
            if rm: relied += [(rm.group(1), i) for i in re.findall(ID, seg)]
            else: own += re.findall(ID, seg)
        trace[m.group(1)] = {"tag": m.group(2).strip(), "own": own, "relied": relied}
    uat = section(t, "UAT script") or section(t, "Verification")
    pre = (re.search(r"^Preconditions: (.*)$", t, re.M) or [None, ""])[1]
    covers_raw = f("Covers")
    stories[n] = {
        "file": p.name, "text": t, "title": t.splitlines()[0].split(" — ", 1)[-1], "lines": t.count("\n") + (not t.endswith("\n")),
        "type": f("Type"), "epic": f("Epic"), "release": f("Release"), "status": f("Status"),
        "blocked_raw": f("Blocked by"), "blocked": re.findall(r"\b\d\d\b", f("Blocked by")),
        "covers_raw": covers_raw, "covers": re.findall(ID, covers_raw.split("(")[0]),
        "reqs": reqs, "scens": scens, "trace": trace, "qs": sorted(set(qs), key=qn), "q_lines": q_lines,
        "gaps": re.findall(r"^- inventory gap.*$", oq_part, re.M), "sections": re.findall(r"^## (.*)$", t, re.M),
        "pre": pre, "scen_part": scen_part, "stub": "This story is a stub" in t, "has_uat": bool(uat),
    }

# ── Blocked by: graph, closure, cycles, waves ──
def closure(n, seen=None):
    seen = set() if seen is None else seen
    for b in stories[n]["blocked"]:
        if b in stories and b not in seen:
            seen.add(b); closure(b, seen)
    return seen
clos = {n: closure(n) for n in stories}
cycles = sorted(n for n in stories if n in clos[n])
for n in cycles: flag("Blocked by cycle", f"{n} is blocked, in the end, by itself")
def waves(pred):
    todo = [n for n in stories if pred(stories[n])]; done, out = set(), []
    outside = lambda b: b not in todo
    while todo:
        w = [n for n in todo if all(b in done or outside(b) for b in stories[n]["blocked"])]
        if not w: out.append(["(cycle) " + ", ".join(todo)]); break
        out.append(w); done |= set(w); todo = [n for n in todo if n not in w]
    return out

# ── who covers what ──
cover = collections.defaultdict(list)       # id -> [(story, R)]
owner = collections.defaultdict(list)       # id -> [story] by Covers line
for n, s in stories.items():
    for i in s["covers"]: owner[i].append(n)
for n, s in stories.items():
    if not s["covers"]: flag("story that covers nothing", f"{n}: Covers: {s['covers_raw']}")
    for r in s["reqs"]:
        if r not in s["trace"]: flag("requirement with no row in the Trace table", f"{n} {r}")
    for r, tr in s["trace"].items():
        if r not in s["reqs"]: flag("Trace row for a requirement the story does not have", f"{n} {r}")
        if not tr["own"] and not tr["relied"]: flag("Trace row that names no inventory item", f"{n} {r}")
        for i in tr["own"]:
            if i in s["covers"]: cover[i].append((n, r))
            else: flag("Trace cites an item the story does not cover, without 'relies on'", f"{n} {r} cites {i} (covered by: {', '.join(owner.get(i, [])) or 'no story'})")
        for st, i in tr["relied"]:
            if i in s["covers"]: flag("'relies on' names an item the story itself covers", f"{n} {r}: {i}")
            if st not in stories: flag("'relies on' names a story that does not exist", f"{n} {r}: {st}")
            else:
                if i not in stories[st]["covers"]: flag("'relies on' names a story that does not cover that item", f"{n} {r}: story {st}, {i} (covered by: {', '.join(owner.get(i, [])) or 'no story'})")
                if st not in clos[n]: flag("'relies on' a story that is not in Blocked by (directly or through its blockers)", f"{n} {r}: story {st}, {i}")
        if "inferred" in tr["tag"]:
            text = s["reqs"].get(r, "")
            beside = re.findall(r"Q-\d+", text) or [q for q, rest in s["q_lines"] if re.search(rf"\b{r}\b", rest)]
            if not beside: flag("requirement tagged inferred with no open question beside it", f"{n} {r}")
    for i in s["covers"]:
        if not any(st == n for st, _ in cover[i]): flag("ID in Covers that none of the story's requirements cites", f"{n}: {i}")
for i, ns in owner.items():
    if len(ns) > 1: flag("item under more than one story", f"{i}: {', '.join(ns)}")
    if i not in items: flag("Covers names an ID the inventory does not have", f"{i} in {', '.join(ns)}")

# ── exclusions, read from the map ──
excl, partial, dec_excl = collections.OrderedDict(), collections.defaultdict(list), collections.OrderedDict()
def spec_nums(text):
    nums = []
    for a, b in re.findall(r"#(\d+) to #(\d+)", text): nums += range(int(a), int(b) + 1)
    if re.search(r"spec #|decisions? #", text): nums += [int(x) for x in re.findall(r"#(\d+)", text)]
    return sorted(set(nums))
for l in section(mp, "Covered by standing requirements").splitlines():
    if l.startswith("- "):
        for i in re.findall(ID, l): excl.setdefault(i, "standing requirement" + (": " + ", ".join(re.findall(r"SR-\d+", l)) if "SR-" in l else "") + " (`standing-requirements.md`)")
for row in table(section(mp, "Out of scope")):
    item, why = col(row, "Item"), col(row, "Why")
    part = re.findall(rf"part of ({ID})", item)
    for i in part: partial[i].append(why)
    for i in re.findall(ID, item):
        if i not in part: excl.setdefault(i, "out of scope: " + why)
    for x in spec_nums(item): dec_excl.setdefault(x, "out of scope: " + why)
dep_named = set()
for row in table(section(mp, "Dependencies on other features")):
    needs, own = col(row, "Needs"), col(row, "Owned by")
    for i in re.findall(ID, needs):
        dep_named.add(i); excl.setdefault(i, f"owned by {own} (map, Dependencies)")
has_goals = bool(table(section(mp, "Goals")))
for i, d in items.items():
    if d["struck"]: excl[i] = "struck in the inventory" + (": " + re.sub(r"^struck\s*\(?|\)$", "", d["statement"]) if "(" in d["statement"] else "")
    elif i.startswith("ACT") and has_goals and i not in cover: excl.setdefault(i, "actor: covered by the map's Goals table, not by a requirement")
for i in list(excl):
    if i in cover:
        if i not in dep_named and not items.get(i, {}).get("struck"): flag("item both covered by a requirement and listed as excluded in the map", i)
        del excl[i]
    elif i not in items: flag("the map excludes an ID the inventory does not have", i)
for i in partial:
    if i not in cover: flag("item the map excludes in part has no covering requirement for the rest", i)
unmapped = [i for i in items if i not in cover and i not in excl]
for i in unmapped: flag("inventory item with neither a covering requirement nor an exclusion", i)

# ── per-story lint ──
ref_pat = re.compile(r"(?:story|stories|enabler|enablers)\s+(\d\d(?:(?:, | and |, and | to )\d\d)*)", re.I)
def refs(text):
    out = []
    for m in ref_pat.finditer(text): out += re.findall(r"\d\d", m.group(1))
    return out
for n, s in stories.items():
    t = s["text"]
    if len(s["scens"]) > 12: flag("story with more than 12 scenarios", f"{n}: {len(s['scens'])}")
    if s["lines"] > 220: flag("story longer than 220 lines", f"{n}: {s['lines']}")
    proved = {r for rs in s["scens"].values() for r in rs}
    for r in s["reqs"]:
        if r not in proved: flag("requirement with no scenario", f"{n} {r}")
    for sc, rs in s["scens"].items():
        if not rs: flag("scenario that cites no requirement", f"{n} {sc}")
        for r in rs:
            if r not in s["reqs"]: flag("scenario cites a requirement the story does not have", f"{n} {sc} → {r}")
    for b in s["blocked"]:
        if b not in stories: flag("Blocked by names something that is not a story", f"{n}: {b}")
    if not s["blocked"] and s["blocked_raw"] != "none": flag("Blocked by is neither story numbers nor 'none'", f"{n}: {s['blocked_raw']}")
    if (s["qs"] or s["gaps"]) and s["status"] != "needs-info": flag("story with open questions whose status is not needs-info", f"{n}: {s['status']}")
    if not s["qs"] and not s["gaps"] and s["status"] == "needs-info": flag("story marked needs-info that cites no open question", n)
    for g in s["gaps"]: flag("unresolved inventory gap", f"{n}: {short(g[2:], 170)}")
    if re.search(r"NEW-Q|new question", t): flag("unnumbered question left in a story", n)
    need = ["Description", "Requirements", "Out of scope", "Scenarios", "Open questions"]
    for sec in need:
        if not any(x.startswith(sec) for x in s["sections"]): flag("missing section", f"{n}: {sec}")
    if not s["has_uat"] and not s["stub"]: flag("missing section", f"{n}: UAT script or Verification")
    for ref in sorted(set(refs(t))):
        if ref not in stories: flag("pointer to a story that does not exist", f"{n} → {ref}")
    for m in re.finditer(r"(?:story|stories|enabler|and|,)\s+(\d\d)(?:,| \(|'s)? ?\(?((?:R\d+)(?:(?:, | and | to |, and )R\d+)*)", t):
        if m.group(1) in stories:
            for r in re.findall(r"R\d+", m.group(2)):
                if r not in stories[m.group(1)]["reqs"]: flag("pointer to a requirement the target story does not have", f"{n} → story {m.group(1)}, {r}")
    for r, text in s["reqs"].items():
        if re.search(r"localStorage|IndexedDB|browser-local|scripted|mock data|object URL", text, re.I): flag("requirement that mentions a prototype artifact", f"{n} {r}")
        elif re.search(r"\bprototype\b|developer-machine", text, re.I): flag("requirement line that says what the prototype does (judgement: context for an undecided part, or a requirement?)", f"{n} {r}")
        for q in re.findall(r"Q-\d+", text):
            if q not in s["qs"] and q not in q_answered: flag("requirement names an open question the story's Open questions does not list", f"{n} {r}: {q}")
    for q in s["qs"]:
        if q not in q_blocks: flag("story cites a question that is not in the open-questions file", f"{n}: {q}")
        elif q in q_answered: flag("story cites a question that is already answered", f"{n}: {q}")
    actors = set(re.findall(r"^As an? ([A-Z][a-z]+)", t, re.M))
    if len(actors) > 1: flag("story with more than one actor", f"{n}: {', '.join(sorted(actors))}")
    if s["type"] == "story" and not actors: flag("story with no 'As a …' line", n)
    outside = sorted(set(r for r in refs(s["pre"]) if r in stories and r != n and r not in clos[n]))
    if outside: flag("UAT Preconditions need a story outside Blocked by (directly or through its blockers)", f"{n}: needs {', '.join(outside)}; Blocked by {s['blocked_raw']}")
    outside = sorted(set(r for r in refs(s["scen_part"]) if r in stories and r != n and r not in clos[n]))
    if outside: flag("Scenarios section names a story outside Blocked by (read: does a Given need it?)", f"{n}: names {', '.join(outside)}")
    if re.match(r"not known", s["pre"]) and not s["stub"]: flag("UAT script that cannot be run from its own Preconditions", n)
for n, s in stories.items():
    if s["type"] == "enabler" and not any(n in o["blocked"] for o in stories.values()): flag("enabler that no story is blocked by", f"{n} ({s['release']})")
    for b in s["blocked"]:
        if b in stories and s["release"] == "first" and stories[b]["release"] != "first": flag("first-release story blocked by a story of another release", f"{n} by {b} ({stories[b]['release']})")

# ── the map and the epics agree with the stories ──
map_rows = {}
for row in table(section(mp, "Stories")):
    k = col(row, "#")
    if re.fullmatch(r"\d\d", k): map_rows[k] = row
map_q = {}
for row in table(section(mp, "Open questions by story")):
    k = col(row, "#")
    if re.fullmatch(r"\d\d", k): map_q[k] = sorted(set(re.findall(r"Q-\d+", re.sub(r"\([^)]*\)", "", col(row, "Open")))), key=qn)
for n, s in stories.items():
    row = map_rows.get(n)
    if not row: flag("story with no row in the map", n); continue
    if sorted(re.findall(ID, col(row, "Covers"))) != sorted(s["covers"]): flag("map and story disagree on Covers", n)
    if sorted(re.findall(r"\d\d", col(row, "Blocked"))) != sorted(s["blocked"]): flag("map and story disagree on Blocked by", f"{n}: map {col(row, 'Blocked')} / story {s['blocked_raw']}")
    if col(row, "Release") != s["release"]: flag("map and story disagree on Release", n)
    if col(row, "Type") != s["type"]: flag("map and story disagree on Type", n)
    if col(row, "Epic") and not s["epic"].startswith(col(row, "Epic")): flag("map and story disagree on Epic", f"{n}: map {col(row, 'Epic')} / story {s['epic']}")
    if map_q and map_q.get(n, []) != s["qs"]: flag("map and story disagree on open questions", f"{n}: map {map_q.get(n)} / story {s['qs']}")
    if s["type"] == "enabler":
        unb = sorted(re.findall(r"\d\d", col(row, "Unblocks")))
        real = sorted(o for o, os_ in stories.items() if n in os_["blocked"])
        if unb != real: flag("map's Unblocks and the stories' Blocked by disagree", f"{n}: map {', '.join(unb) or 'none'} / stories {', '.join(real) or 'none'}")
for n in map_rows:
    if n not in stories: flag("map row with no story file", n)
epic_of = {}
for p in sorted((OUT / "epics").glob("*.md")):
    et = p.read_text(); eid = re.match(r"# E-?(\w+)", et).group(1)
    erel = (re.search(r"^Release: (.*)$", et, re.M) or [None, ""])[1]; est = (re.search(r"^Status: (.*)$", et, re.M) or [None, ""])[1]
    mine = []
    for row in table(section(et, "Stories")):
        k = col(row, "#")
        if not re.fullmatch(r"\d\d", k): continue
        epic_of.setdefault(k, []).append(eid); mine.append(k)
        if k not in stories: flag("epic lists a story that has no file", f"{eid}: {k}"); continue
        s = stories[k]
        if sorted(re.findall(r"\d\d", col(row, "Blocked"))) != sorted(s["blocked"]): flag("epic and story disagree on Blocked by", f"{k}: epic {col(row, 'Blocked')} / story {s['blocked_raw']}")
        if col(row, "Release") != s["release"] or col(row, "Type") != s["type"]: flag("epic and story disagree on Release or Type", k)
        if not s["epic"].startswith(eid): flag("epic and story disagree on Epic", f"{k}: listed in {eid}, story says {s['epic']}")
    rels = {stories[k]["release"] for k in mine if k in stories}
    want = rels.pop() if len(rels) == 1 else "mixed"
    if mine and erel != want: flag("epic's Release does not follow its stories", f"{eid}: {erel}, stories say {want}")
    if mine and any(stories[k]["status"] == "needs-info" for k in mine if k in stories) and est != "needs-info": flag("epic's Status does not follow its stories", eid)
    pos = {k: x for x, k in enumerate(mine)}
    for k in mine:
        for b in stories.get(k, {"blocked": []})["blocked"]:
            if b in pos and pos[b] > pos[k]: flag("epic lists a story before one that blocks it", f"{eid}: {k} before {b}")
for n in stories:
    if len(epic_of.get(n, [])) != 1: flag("story not listed exactly once in an epic", f"{n}: {len(epic_of.get(n, []))}")

# ── spec decisions ──
dec = collections.OrderedDict((int(m.group(1)), m.group(2)) for m in re.finditer(r"^\| (\d+) \| (.*) \|\s*$", SPEC, re.M))
dec_items = collections.defaultdict(list)
for i, d in items.items():
    for x in spec_nums(" ".join(re.findall(r"spec #\d+(?:(?:, | and | to )#\d+)*", d["row"]))):
        dec_items[x].append(i)
dec_rows, dec_unmapped, dec_cov, dec_exc = [], [], 0, 0
for x, text in dec.items():
    its = dec_items.get(x, [])
    cov = [(st, r, i) for i in its for st, r in cover.get(i, [])]
    standing = [i for i in its if i in excl and excl[i].startswith("standing")]
    if cov:
        by = collections.OrderedDict()
        for st, r, i in sorted(cov, key=lambda c: (c[0], int(c[1][1:]))): by.setdefault(st, [])
        for st, r, i in sorted(cov, key=lambda c: (c[0], int(c[1][1:]))):
            if r not in by[st]: by[st].append(r)
        via = ", ".join(i for i in its if i in cover)
        covered = "; ".join(f"{st} {', '.join(rs)}" for st, rs in by.items())
        sr = (" standing requirement (" + ", ".join(standing) + ");") if standing else ""
        dec_rows.append(f"| spec #{x} | {short(text, 110)} |{sr} {covered} (through {via}) | |"); dec_cov += 1
    elif standing:
        dec_rows.append(f"| spec #{x} | {short(text, 110)} | {excl[standing[0]]} (through {', '.join(standing)}) | |"); dec_cov += 1
    elif x in dec_excl:
        dec_rows.append(f"| spec #{x} | {short(text, 110)} | | {dec_excl[x]} |"); dec_exc += 1
    elif its and all(i in excl for i in its):
        why = "; ".join(dict.fromkeys(excl[i] for i in its))
        dec_rows.append(f"| spec #{x} | {short(text, 110)} | | through {', '.join(its)}: {why} |"); dec_exc += 1
    else:
        dec_rows.append(f"| spec #{x} | {short(text, 110)} | | **UNMAPPED** |"); dec_unmapped.append(x)
        flag("spec decision with no inventory item and no exclusion in the map" if not its else "spec decision whose inventory items are not all covered or excluded", f"#{x}")

# ── output ──
cnt = {k: [0, 0, 0] for k in KINDS}
for i in items: cnt[i[:3]][0 if i in cover else 1 if i in excl else 2] += 1
tot = [sum(cnt[k][j] for k in ("SCR", "STA", "ACN", "RUL")) for j in range(3)]
allq = sorted({q for s in stories.values() for q in s["qs"]}, key=qn)
over8 = [n for n, s in stories.items() if len(s["scens"]) > 12]; over170 = [n for n, s in stories.items() if s["lines"] > 220]
first_waves = waves(lambda s: s["release"] == "first"); other = [n for n, s in stories.items() if s["release"] != "first"]

numbers = ["| # | Story | Type | Release | Lines | Requirements | Scenarios | Status | Blocked by |", "|---|---|---|---|---|---|---|---|---|"]
for n, s in stories.items():
    numbers.append(f"| {n} | {s['title']} | {s['type']} | {s['release']} | {s['lines']}{' **(over 220)**' if s['lines'] > 220 else ''} | {len(s['reqs'])} | {len(s['scens'])}{' **(over 12)**' if len(s['scens']) > 12 else ''} | {s['status']} | {s['blocked_raw']} |")
numbers.append(f"| | **{len(stories)} stories** | | | {sum(s['lines'] for s in stories.values())} | {sum(len(s['reqs']) for s in stories.values())} | {sum(len(s['scens']) for s in stories.values())} | | |")
wave_lines = [f"{k}. {', '.join(w)}" for k, w in enumerate(first_waves, 1)]
lint_lines = []
for k, v in findings.items():
    lint_lines.append(f"- **{k}** ({len(v)})")
    lint_lines += [f"  - {x}" for x in v]

print("PER STORY (lines / requirements / scenarios / status / blocked by / questions)")
for n, s in stories.items():
    print(f"  {n}: {s['lines']} / {len(s['reqs'])} / {len(s['scens'])} / {s['status']} / {s['blocked_raw']} / {len(s['qs'])}")
print(f"TOTAL {len(stories)} stories, {sum(s['lines'] for s in stories.values())} lines, {sum(len(s['reqs']) for s in stories.values())} requirements, {sum(len(s['scens']) for s in stories.values())} scenarios; over 12 scenarios: {over8 or 'none'}; over 220 lines: {over170 or 'none'}; distinct open questions cited: {len(allq)}")
print("\nBLOCKED BY: " + ("no cycle" if not cycles else "CYCLE through " + ", ".join(cycles)))
print("WAVES, first release:"); [print("  " + w) for w in wave_lines]
print("  not first release: " + ", ".join(f"{n} ({stories[n]['release']}; after {stories[n]['blocked_raw']})" for n in other))
print("\nLINT"); print("\n".join(lint_lines) or "  nothing")
print("\nCOUNTS (covered, excluded, unmapped):", cnt, "| screens+states+actions+rules:", tot, "| decisions:", dec_cov, dec_exc, dec_unmapped)

if JSON_OUT:
    json.dump({"stories": {n: {k: s[k] for k in ("title", "type", "epic", "release", "status", "blocked", "blocked_raw", "covers", "qs", "lines")} | {"reqs": len(s["reqs"]), "scens": len(s["scens"])} for n, s in stories.items()},
               "waves": first_waves, "other": other, "questions": allq, "counts": cnt, "unmapped": unmapped}, open(JSON_OUT, "w"), indent=1)

if WRITE:
    def matrix(kind):
        rows = ["| Item | Statement | Covered by | Or excluded because |", "|---|---|---|---|"]
        for i, d in items.items():
            if not i.startswith(kind): continue
            if i in cover:
                by = collections.OrderedDict()
                for st, r in cover[i]: by.setdefault(st, []).append(r)
                note = ("part excluded: " + "; ".join(partial[i])) if i in partial else ""
                rows.append(f"| {i} | {short(d['statement'])} | {'; '.join(f'{st} {chr(44).join(rs).replace(chr(44), chr(44) + chr(32))}' for st, rs in by.items())} | {note} |")
            elif i in excl: rows.append(f"| {i} | {'(struck)' if d['struck'] else short(d['statement'])} | | {excl[i]} |")
            else: rows.append(f"| {i} | {short(d['statement'])} | | **UNMAPPED** |")
        return "\n".join(rows)
    summary = ["| Kind | Items | Covered by a requirement | Excluded with a reason | Unmapped |", "|---|---|---|---|---|"]
    for k in KINDS: summary.append(f"| {NAMES[k]} ({k}) | {sum(cnt[k])} | {cnt[k][0]} | {cnt[k][1]} | {cnt[k][2]} |")
    summary.append(f"| Spec decisions | {len(dec)} | {dec_cov} | {dec_exc} | {len(dec_unmapped)} |")
    default = "# Coverage\n\nChecked: {{DATE}}\n\n## Result\n\n{{SUMMARY}}\n\nScreens, states, actions and rules together: {{TOTAL}}.\n\n## Coverage matrix\n\n### Screens\n\n{{SCR}}\n\n### States\n\n{{STA}}\n\n### Actions\n\n{{ACN}}\n\n### Rules\n\n{{RUL}}\n\n### Objects\n\n{{OBJ}}\n\n### Actors\n\n{{ACT}}\n\n### Spec decisions\n\n{{DECISIONS}}\n\n## Numbers per story\n\n{{COUNTS}}\n\n## Build order, first release\n\n{{WAVES}}\n\n## Findings\n\n{{LINT}}\n"
    doc = pathlib.Path(TEMPLATE).read_text() if TEMPLATE else default
    fill = {"DATE": datetime.date.today().isoformat(), "SUMMARY": "\n".join(summary),
            "TOTAL": f"{tot[0]} covered, {tot[1]} excluded, {tot[2]} unmapped, of {sum(tot)}",
            "DECISIONS": "| Item | Statement | Covered by | Or excluded because |\n|---|---|---|---|\n" + "\n".join(dec_rows),
            "COUNTS": "\n".join(numbers), "WAVES": "\n".join(wave_lines), "LINT": "\n".join(lint_lines) or "Nothing.",
            "NSTORIES": str(len(stories)), "NQUESTIONS": str(len(allq)),
            "FEATURE": inv.splitlines()[0].lstrip("# ").split(" — ", 1)[-1].strip()}
    for k in KINDS: fill[k] = matrix(k)
    for k, v in fill.items(): doc = doc.replace("{{%s}}" % k, v)
    left = re.findall(r"\{\{[A-Z]+\}\}", doc)
    assert not left, left
    # A reviewer's own notes survive a re-run: everything from "## Added by hand" to the end is carried over.
    old = (OUT / "coverage.md").read_text() if (OUT / "coverage.md").exists() else ""
    if "## Added by hand" in old:
        doc = doc.rstrip("\n") + "\n\n" + old[old.index("## Added by hand"):]
    (OUT / "coverage.md").write_text(doc)
    print("\nwrote", OUT / "coverage.md")
