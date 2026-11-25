// Record mode — view or edit, for a record page that has the two (the project
// detail page; custom pages run their own, see firma2-custom-page).
//
// The mode lives on <html data-record-mode>, so any component on the page can
// read it and any stylesheet can key on it, without being handed it. A page
// that never sets it has NO modes — the rest of the site, where every field
// edits where it sits — and every helper here answers "not view mode" there,
// so components that honour the mode change nothing on those pages.
//
//   html[data-record-mode='view'] [data-edit-only]  hidden (firma2-record-mode)
//   `firma2:record-mode` on document, {mode}         fired on every change

export type RecordMode = 'view' | 'edit';

export const RECORD_MODE_EVENT = 'firma2:record-mode';

/** True only on a page that has modes and is reading. */
export const isViewMode = (): boolean => document.documentElement.dataset.recordMode === 'view';

export const setRecordMode = (mode: RecordMode): void => {
  document.documentElement.dataset.recordMode = mode;
  document.dispatchEvent(new CustomEvent(RECORD_MODE_EVENT, { detail: { mode } }));
};

export const onRecordMode = (fn: (mode: RecordMode) => void): void => {
  document.addEventListener(RECORD_MODE_EVENT, (event) => fn((event as CustomEvent<{ mode: RecordMode }>).detail.mode));
};
