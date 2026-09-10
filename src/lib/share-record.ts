// share-record — the one Share gesture in this spoke: hand a record's URL to
// the OS share sheet where the platform has one, fall back to the clipboard
// with a toast where it does not.
//
// Extracted from firma2-project-actions when the project peek sheet grew its
// own Share action: two surfaces sharing the same record must share the same
// gesture, and two copies of a share-or-clipboard branch is how the two
// surfaces drift (one grows a toast the other lacks, one treats a dismissed
// share sheet as a failure). The behaviour is documented where it was decided —
// see the comment on the call site in firma2-project-actions for the original
// reasoning — and restated here only enough to keep this file honest:
//
// SHARE SHEET FIRST, CLIPBOARD SECOND. Where navigator.share exists the OS
// takes over and no toast shows (it would be noise on top of the OS's own UI).
// Everywhere else the URL lands on the clipboard and the toast is the only
// evidence anything happened, which is what makes it required. A dismissed
// share sheet (AbortError) is the user changing their mind, not a failure to
// fall back from.

interface ShareToasts {
  show: (config: { message: string; variant?: string }) => void;
}

export async function shareRecord(
  { title, url }: { title: string; url: string },
  toasts?: ShareToasts | null,
): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (error) {
      if ((error as DOMException).name === 'AbortError') return;
      // Anything else (NotAllowedError, unsupported data) falls through to
      // the clipboard path below.
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toasts?.show({ message: 'Link copied', variant: 'success' });
  } catch {
    toasts?.show({ message: 'Copy failed — use the address bar link', variant: 'danger' });
  }
}
