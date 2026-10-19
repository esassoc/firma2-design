// The review schedules an organization can keep — split out of
// firma2-publishing so a client script can read the labels without bundling
// every project record.

export type ReviewCadence = 'none' | 'monthly' | 'quarterly' | 'twice-yearly' | 'yearly';

export const REVIEW_CADENCES: { value: ReviewCadence; label: string; days: number | null }[] = [
  { value: 'none', label: 'No schedule', days: null },
  { value: 'monthly', label: 'Every month', days: 31 },
  { value: 'quarterly', label: 'Every quarter', days: 92 },
  { value: 'twice-yearly', label: 'Twice a year', days: 183 },
  { value: 'yearly', label: 'Every year', days: 365 },
];
