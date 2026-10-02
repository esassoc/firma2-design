// Reporting from a document — what Claude reads out of a reporter's own files.
//
// WHERE THIS CAME FROM. ProjectFirma2's hackathon team 6 built "Report from a
// document": a reporter uploads the spreadsheet their crew already keeps (or
// pastes the paragraph from the grant report they already wrote), Claude
// matches it against the measures the project reports on, and the reporter
// checks every proposed entry before anything is saved. The team's stage
// demo was a deliberately messy crew log; this fixture reproduces what made
// that demo land, against this spoke's Deer Creek project:
//
//   - two rows on the same bank ADDED into one entry, and saying so;
//   - units CONVERTED with the arithmetic shown (hectares, feet);
//   - the obvious number REFUSED when it is the wrong quantity (a crew note's
//     "~4 ac" for a measure that counts fence miles);
//   - a 2024 row FILED UNDER 2024 though the sheet is titled 2025;
//   - figures no measure asks about NOT INVENTED into data — listed instead,
//     because that list is feedback to the program lead;
//   - the TOTAL row SKIPPED.
//
// "Already on file" is NOT scripted: the sheet checks it against the entries
// this browser has actually recorded, in code, because whether a figure is a
// duplicate is a fact about the record and never the model's call.
//
// THERE IS NO MODEL HERE. This is a static prototype: any spreadsheet you
// choose reads as the sample crew log, and pasted text reads as the sample
// paragraph. Invented content, deterministic.

export type Confidence = 'High' | 'Medium' | 'Low';

export interface ImportProposal {
  id: string;
  /** The project's measure, by name — the key seed rows use. */
  measure: string;
  year: number;
  amount: number;
  /** Answers to the measure's reported lists, keyed by list name. */
  answers: Record<string, string>;
  /** Where in the document it came from, verbatim. */
  quote: string;
  /** Arithmetic Claude did, shown rather than hidden. */
  conversion?: string;
  /** A judgement worth a second look. */
  note?: string;
  confidence: Confidence;
}

export interface ImportReading {
  proposals: ImportProposal[];
  /** In the document, asked by no measure on this project. Not saved. */
  notAsked: string[];
  /** Rows deliberately passed over, and why. */
  skipped: string[];
}

export const SAMPLE_SHEET_NAME = 'deer-creek-crew-log-2025.xlsx';

export const SAMPLE_TEXT =
  'This spring we planted 6 acres of willow and cottonwood along the east bank, and fenced off another half mile of the upland pasture from the cattle. A volunteer day brought out 35 people for 4 hours each. Our logger showed a 7-day max of 65°F in late July.';

const DEER_CREEK_SHEET: ImportReading = {
  proposals: [
    {
      id: 'sheet-planting-2025',
      measure: 'Acres of riparian habitat restored',
      year: 2025,
      amount: 5.5,
      answers: { 'Riparian treatments': 'Planting' },
      quote: 'Rows 4 and 6 — “Willow stakes, east bank reach 2, 3.5 ac” and “Cottonwood poles, east bank reach 2, 2 ac”',
      note: 'Two rows on the same bank, added together.',
      confidence: 'High',
    },
    {
      id: 'sheet-plants-2025',
      measure: 'Native trees and shrubs planted',
      year: 2025,
      amount: 1850,
      answers: {},
      quote: 'Row 7 — “Plants in ground: 1,850 (willow 1,200 / cottonwood 400 / valley oak 250)”',
      confidence: 'High',
    },
    {
      id: 'sheet-invasives-2025',
      measure: 'Acres of invasive vegetation removed',
      year: 2025,
      amount: 3.7,
      answers: {},
      quote: 'Row 8 — “Blackberry pull below county bridge, 1.5 ha”',
      conversion: '1.5 ha = 3.7 acres',
      confidence: 'High',
    },
    {
      id: 'sheet-fence-2025',
      measure: 'Miles of livestock exclusion fencing',
      year: 2025,
      amount: 0.5,
      answers: {},
      quote: 'Row 10 — “Exclusion fence, upland pasture, 2,640 ft. Notes: ~4 ac fenced off”',
      conversion: '2,640 ft = 0.5 miles',
      note: 'Used the fence length, not the note’s “~4 ac”: this measure counts miles of fence, and acres enclosed are a different quantity.',
      confidence: 'High',
    },
    {
      id: 'sheet-volunteers-2025',
      measure: 'Volunteer hours contributed',
      year: 2025,
      amount: 140,
      answers: { 'Volunteer activities': 'Planting' },
      quote: 'Row 12 — “Saturday workday, sign-in sheet, 140 hrs”',
      note: 'The row has no date, so it was filed under 2025 from the sheet’s title. “Planting” is inferred from the rows around it.',
      confidence: 'Medium',
    },
    {
      id: 'sheet-planting-2024',
      measure: 'Acres of riparian habitat restored',
      year: 2024,
      amount: 2,
      answers: { 'Riparian treatments': 'Planting' },
      quote: 'Row 3 — “10/28/2024, late-season planting, west bank, 2 ac”',
      note: 'Dated October 2024, so filed under 2024 even though the sheet is titled 2025.',
      confidence: 'Medium',
    },
  ],
  notAsked: [
    'Stream temperature, 7-day maximum 64.9 °F at logger LC-2 — this project isn’t asked for temperature.',
    'Crew lunch, $180 — no measure counts costs.',
  ],
  skipped: ['Row 14, “TOTAL” — a sum of the rows above it.'],
};

const DEER_CREEK_TEXT: ImportReading = {
  proposals: [
    {
      id: 'text-planting-2025',
      measure: 'Acres of riparian habitat restored',
      year: 2025,
      amount: 6,
      answers: { 'Riparian treatments': 'Planting' },
      quote: '“This spring we planted 6 acres of willow and cottonwood along the east bank”',
      confidence: 'High',
    },
    {
      id: 'text-fence-2025',
      measure: 'Miles of livestock exclusion fencing',
      year: 2025,
      amount: 0.5,
      answers: {},
      quote: '“fenced off another half mile of the upland pasture from the cattle”',
      confidence: 'High',
    },
    {
      id: 'text-volunteers-2025',
      measure: 'Volunteer hours contributed',
      year: 2025,
      amount: 140,
      answers: { 'Volunteer activities': 'Planting' },
      quote: '“A volunteer day brought out 35 people for 4 hours each”',
      conversion: '35 people × 4 hours = 140 hours',
      note: '“Planting” is inferred from the sentence before it.',
      confidence: 'Medium',
    },
  ],
  notAsked: ['Stream temperature, 7-day maximum 65 °F — this project isn’t asked for temperature.'],
  skipped: [],
};

/** Readings by project slug. A project without one offers no import. */
export const IMPORT_FIXTURES: Record<string, { sheet: ImportReading; text: ImportReading }> = {
  'deer-creek-riparian-corridor-enhancement': { sheet: DEER_CREEK_SHEET, text: DEER_CREEK_TEXT },
};
