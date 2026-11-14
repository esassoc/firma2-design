// The one-time receipt for a new-organization request answered on its review
// page (/organizations/requests/<id>), read by the Organizations list it
// returns to.
//
// WHY NOT added-organizations' note: an approval adds an organization and
// rides that note ("<name> added."), but a decline or an "add them to an
// existing organization instead" adds nothing, so it needs a receipt of its
// own. Same shape as takeJustAdded: sessionStorage, read once and cleared, so
// a reload never repeats it. Every access is wrapped — blocked storage just
// means no toast.

const KEY = 'firma2:access-request-answered:v1';

export const noteAnswer = (message: string): void => {
  try {
    sessionStorage.setItem(KEY, message);
  } catch {
    /* storage unavailable — the answer still stands, only the receipt is lost */
  }
};

/** Reads the receipt and clears it, so it shows once. */
export const takeAnswerNote = (): string | null => {
  try {
    const message = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return message;
  } catch {
    return null;
  }
};
