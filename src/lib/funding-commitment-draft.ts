// Browser-local FUNDING COMMITMENTS — the funding sources a project draws on,
// with the amount each one puts in. Same store, same honesty terms as every
// other draft in this prototype: localStorage, ONE browser, and the UI says so
// where the reader can see it.
//
// THE ATOM IS dbo.ProjectFundingSource: one project, one funding source, one
// amount. It used to live in the setup draft, on the Funding sources milestone,
// beside the list of sources it points at. It moved here on 2026-09-18 because
// setup configures the list and the product uses it: "individual data
// connections between a project and funding source feel like the ongoing
// maintenance and use of the platform" (Andy). So the store is keyed by project,
// like expenditures, and the control that writes it is the Add source on the
// project record's Funding sources card.
//
// THE SOURCE IS A REFERENCE, NOT A COPY. `fundingSourceId` points at a row in
// the setup draft (src/lib/setup-draft.ts, `confirmedFundingSources`), and the
// card resolves the name and administering organization at render. A source
// removed from the program after a commitment was made leaves the commitment
// pointing at nothing; the card drops that row rather than showing a name it
// cannot vouch for.

export interface FundingCommitmentDraft {
  id: string;
  /** The setup-draft funding source this project draws on. */
  fundingSourceId: string;
  /** Whole dollars committed to this project from that source. Always > 0. */
  amount: number;
}

const KEY_VERSION = 'v1';
const keyFor = (projectSlug: string): string =>
  `firma2:funding-commitments:${KEY_VERSION}:${projectSlug}`;

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    // Safari in private mode throws on access rather than returning null.
    return null;
  }
};

const isCommitment = (v: unknown): v is FundingCommitmentDraft => {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Partial<FundingCommitmentDraft>;
  return (
    typeof c.id === 'string' &&
    typeof c.fundingSourceId === 'string' &&
    typeof c.amount === 'number' &&
    Number.isFinite(c.amount)
  );
};

/** Every commitment recorded against this project in this browser, oldest first. */
export const readFundingCommitments = (projectSlug: string): FundingCommitmentDraft[] => {
  const store = storage();
  if (!store) return [];
  try {
    const parsed = JSON.parse(store.getItem(keyFor(projectSlug)) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isCommitment) : [];
  } catch {
    return [];
  }
};

/** Record one commitment. The id is minted here, deterministically per store. */
export const addFundingCommitment = (
  projectSlug: string,
  commitment: Omit<FundingCommitmentDraft, 'id'>,
): FundingCommitmentDraft | null => {
  const store = storage();
  if (!store) return null;
  try {
    const existing = readFundingCommitments(projectSlug);
    const taken = new Set(existing.map((c) => c.id));
    let n = 1;
    while (taken.has(`commitment-${n}`)) n += 1;
    const full: FundingCommitmentDraft = { ...commitment, id: `commitment-${n}` };
    store.setItem(keyFor(projectSlug), JSON.stringify([...existing, full]));
    return full;
  } catch {
    return null;
  }
};

export const removeFundingCommitment = (projectSlug: string, id: string): void => {
  const store = storage();
  if (!store) return;
  try {
    const rest = readFundingCommitments(projectSlug).filter((c) => c.id !== id);
    store.setItem(keyFor(projectSlug), JSON.stringify(rest));
  } catch {
    // A blocked store also had nothing to remove.
  }
};
