// Solicitations — the calls a workspace takes new projects under.
// Spec: .scratch/project-intake/spec.md (2026-11-24, Solicitations).
//
// A SOLICITATION IS A NAME AND ONE SWITCH. A project entered through the
// intake form says which solicitation it is for; several can be active at
// once, so the answer is what tells them apart. An administrator turns one
// off when it closes, and it stops being offered.
//
// NOT MONEY. A solicitation carries no amount and no requested / secured
// status (user, 2026-11-24): what a project is funded by is its funding rows
// (src/data/firma2-funding-sources.ts). Scoring and the committee's selection
// are not modelled.
//
// INVENTED CONTENT throughout.

export interface Solicitation {
  id: string;
  name: string;
  /** Offered on the intake form. Off, no project can be submitted under it. */
  active: boolean;
}

/** Two active at once, and one that has closed. */
export const SEED_SOLICITATIONS: Solicitation[] = [
  { id: 'sol-2026-watershed', name: '2026 Watershed Restoration Grants', active: true },
  { id: 'sol-2026-fish-passage', name: '2026 Fish Passage Small Grants', active: true },
  { id: 'sol-2025-watershed', name: '2025 Watershed Restoration Grants', active: false },
];
