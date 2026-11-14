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
// A FUNDER REPORT IS THE THIRD DOCUMENT (2026-11-12). A project already owes
// its funder a completion report, and the same team then retypes it here. That
// report speaks the funder's vocabulary, not the workspace's, so its reading
// adds three things the crew log never needed:
//
//   - NEEDS A DECISION: the report supports two readings (two 6-acre planting
//     lines over the same ground). The row arrives unticked with one of them
//     written in; a person picks.
//   - NO MATCH: the report counts a different quantity than the measure asks
//     for (events, where the measure wants hours). Nothing is written in. A
//     suggestion may be offered with its arithmetic; taking it is the
//     person's act, never the reading's.
//   - TO DATE: a funder states totals since the grant began. The sheet files
//     the difference from what the record holds, worked out in code like
//     "already on file", so reading the same report twice adds nothing.
//
// It also proposes a RECORD FIELD (the timeline), not only measure entries.
// Money is skipped and says so: spend here is recorded by year, a funder's
// budget table is by grant, and no arithmetic turns one into the other.
//
// IT IS A PAGE NOW, AND READS MORE THAN MEASURES (2026-11-13;
// .scratch/project-updates/spec.md). The reading can also propose a CONTACT, a
// FUNDING SOURCE, and any NAMED ATTRIBUTE the project has a field for (county).
// Four rules the fixture is built to show:
//
//   - UNSURE LEAVES THE FIELD EMPTY. "Seed collected: 40" with no unit is not
//     40 pounds. The row arrives unticked with nothing written in and says
//     why; the person fills it or leaves it.
//   - AN ORGANIZATION IS NEVER CREATED. A funder the workspace does not hold
//     is flagged for the person to pick an existing one. Whether it is held
//     is a fact about the workspace, so the page works it out, not the model.
//   - LOCATION COMES ONLY FROM SPATIAL DATA. Coordinates typed in a form, and
//     a watershed this project has no field for, are listed as not used.
//   - SPEND IS STILL SKIPPED. Funding sources are who funded and how much was
//     secured; spend by grant does not become spend by year.
//
// Each proposal names the PASSAGE it was read from, and the reading carries
// the document as pages of passages, so the page can show the two side by
// side. A sample has no file behind it: these passages are the document.
//
// THERE IS NO MODEL HERE. This is a static prototype: any PDF or Word file
// reads as the sample funder report, any spreadsheet as the sample crew log,
// and pasted text as the sample paragraph. Invented content, deterministic.

export type Confidence = 'High' | 'Medium' | 'Low';

/** One block of a document: a heading and the lines under it. */
export interface DocumentPassage {
  id: string;
  heading?: string;
  lines: string[];
}

/** A document as the page shows it beside the changes read from it. */
export interface ImportDocument {
  pages: { label: string; passages: DocumentPassage[] }[];
}

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
  /** The report supports more than one reading. Arrives unticked. */
  decide?: boolean;
  /**
   * The report's figure is not this measure's quantity. Arrives unticked with
   * no amount; `suggestion` is offered beside it and never written in.
   */
  noMatch?: { suggestion?: { amount: number; basis: string } };
  /** A total to date. The sheet files this minus what the record holds. */
  cumulative?: number;
  /**
   * A record field instead of a measure entry: the editable field's key, its
   * label, the raw value to set and how that value reads. `measure`, `year`
   * and `amount` are unused on such a row.
   */
  field?: { key: string; label: string; raw: string; display: string };
  /** A person the report names. `measure`, `year` and `amount` are unused. */
  contact?: { name: string; role: string; organization: string; email: string };
  /** Who funded and how much was secured. `measure`, `year` and `amount` are unused. */
  funding?: { name: string; organization: string; amount: number };
  /**
   * Why the reading could not settle a figure. The row arrives unticked with
   * nothing written in; the person fills it or leaves it.
   */
  unsure?: string;
  /** The passage this was read from: an id in the reading's document. */
  passage?: string;
  /** The page of the file, for a stored PDF. */
  page?: number;
}

export interface ImportReading {
  proposals: ImportProposal[];
  /** In the document, asked by no measure on this project. Not saved. */
  notAsked: string[];
  /** Rows deliberately passed over, and why. */
  skipped: string[];
  /** The document, as pages of passages. Absent for a real file read locally. */
  document?: ImportDocument;
}

export const SAMPLE_SHEET_NAME = 'deer-creek-crew-log-2025.xlsx';
export const SAMPLE_REPORT_NAME = 'deer-creek-completion-report-2025.pdf';

export const SAMPLE_TEXT =
  'This spring we planted 6 acres of willow and cottonwood along the east bank, and fenced off another half mile of the upland pasture from the cattle. A volunteer day brought out 35 people for 4 hours each. Our logger showed a 7-day max of 65°F in late July.';

const DEER_CREEK_SHEET: ImportReading = {
  proposals: [
    {
      id: 'sheet-planting-2025',
      measure: 'Acres of riparian habitat restored',
      year: 2025,
      amount: 5.5,
      answers: { 'Riparian treatment': 'Planting' },
      quote: 'Rows 4 and 6 — “Willow stakes, east bank reach 2, 3.5 ac” and “Cottonwood poles, east bank reach 2, 2 ac”',
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
      note: 'Used the fence length, not the note’s “~4 ac”.',
      confidence: 'High',
    },
    {
      id: 'sheet-volunteers-2025',
      measure: 'Volunteer hours contributed',
      year: 2025,
      amount: 140,
      answers: { 'Activity type': 'Planting' },
      quote: 'Row 12 — “Saturday workday, sign-in sheet, 140 hrs”',
      note: 'Undated, so filed under 2025 from the sheet title. “Planting” is inferred.',
      confidence: 'Medium',
    },
    {
      id: 'sheet-planting-2024',
      measure: 'Acres of riparian habitat restored',
      year: 2024,
      amount: 2,
      answers: { 'Riparian treatment': 'Planting' },
      quote: 'Row 3 — “10/28/2024, late-season planting, west bank, 2 ac”',
      note: 'Filed by its date, not the sheet title.',
      confidence: 'Medium',
    },
  ],
  notAsked: [
    'Stream temperature, 7-day maximum 64.9 °F at logger LC-2',
    'Crew lunch, $180',
  ],
  skipped: ['Row 14, “TOTAL”.'],
};

const DEER_CREEK_TEXT: ImportReading = {
  proposals: [
    {
      id: 'text-planting-2025',
      measure: 'Acres of riparian habitat restored',
      year: 2025,
      amount: 6,
      answers: { 'Riparian treatment': 'Planting' },
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
      answers: { 'Activity type': 'Planting' },
      quote: '“A volunteer day brought out 35 people for 4 hours each”',
      conversion: '35 people × 4 hours = 140 hours',
      note: '“Planting” is inferred.',
      confidence: 'Medium',
    },
  ],
  notAsked: ['Stream temperature, 7-day maximum 65 °F'],
  skipped: [],
};

const DEER_CREEK_REPORT: ImportReading = {
  proposals: [
    {
      id: 'report-invasives-2025',
      measure: 'Acres of invasive vegetation removed',
      year: 2025,
      amount: 4.2,
      answers: {},
      quote: 'Treatments table, page 2 — “Riparian invasive plant control, 4.2 acres”',
      passage: 'treatments',
      page: 2,
      confidence: 'High',
    },
    {
      id: 'report-fence-2025',
      measure: 'Miles of livestock exclusion fencing',
      year: 2025,
      amount: 0.75,
      answers: {},
      quote: 'Treatments table, page 2 — “Livestock exclusion fence installed, 3,960 feet”',
      conversion: '3,960 ft = 0.75 miles',
      passage: 'treatments',
      page: 2,
      confidence: 'High',
    },
    {
      id: 'report-stream-2025',
      measure: 'Stream miles revegetated',
      year: 2025,
      amount: 0.4,
      answers: {},
      quote: 'Treatments table, page 2 — “Riparian planting, 2,112 feet of stream”',
      conversion: '2,112 ft = 0.4 miles',
      passage: 'treatments',
      page: 2,
      confidence: 'High',
    },
    {
      id: 'report-timeline',
      measure: '',
      year: 0,
      amount: 0,
      answers: {},
      field: { key: 'timeline', label: 'Timeline', raw: '2023,2026', display: '2023–2026' },
      quote: 'Project dates, page 1 — “Completion: September 2026”',
      passage: 'dates',
      page: 1,
      confidence: 'High',
    },
    {
      id: 'report-plants-to-date',
      measure: 'Native trees and shrubs planted',
      year: 2025,
      amount: 0,
      cumulative: 12400,
      answers: {},
      quote: 'Narrative, page 3 — “To date the Alliance has planted 12,400 native trees and shrubs”',
      passage: 'narrative',
      page: 3,
      confidence: 'Medium',
    },
    {
      id: 'report-planting-2025',
      measure: 'Acres of riparian habitat restored',
      year: 2025,
      amount: 6,
      answers: { 'Riparian treatment': 'Planting' },
      decide: true,
      quote: 'Treatments table, page 2 — “Riparian tree planting, 6 acres” and “Riparian shrub planting, 6 acres”',
      note: 'The report totals riparian treatment at 6 acres, so both lines look like the same ground: 6, not 12.',
      passage: 'treatments',
      page: 2,
      confidence: 'High',
    },
    {
      id: 'report-volunteers-2025',
      measure: 'Volunteer hours contributed',
      year: 2025,
      amount: 0,
      answers: {},
      noMatch: {
        suggestion: { amount: 720, basis: '9 events × 20 people × 4 hours, from the narrative on page 3' },
      },
      quote: 'Results table, page 2 — “Volunteer events held, 9”',
      note: 'The report counts events. This measure asks for hours.',
      passage: 'results',
      page: 2,
      confidence: 'High',
    },
    {
      id: 'report-seed-2025',
      measure: 'Native seed collected',
      year: 2025,
      amount: 0,
      answers: {},
      unsure: 'The table gives 40 with no unit. This measure is in pounds.',
      quote: 'Results table, page 2 — “Seed collected, 40”',
      passage: 'results',
      page: 2,
      confidence: 'Low',
    },
    {
      id: 'report-county',
      measure: '',
      year: 0,
      amount: 0,
      answers: {},
      field: { key: 'county', label: 'County', raw: 'El Dorado', display: 'El Dorado' },
      quote: 'Project location, page 1 — “County: El Dorado”',
      passage: 'location',
      page: 1,
      confidence: 'High',
    },
    {
      id: 'report-funding-board',
      measure: '',
      year: 0,
      amount: 0,
      answers: {},
      funding: { name: 'Watershed Resilience Grant Program', organization: 'California Watershed Restoration Board', amount: 255500 },
      quote: 'Participants and funding, page 1 — “California Watershed Restoration Board, Watershed Resilience Grant Program, $255,500”',
      passage: 'funding',
      page: 1,
      confidence: 'High',
    },
    {
      id: 'report-funding-fisheries',
      measure: '',
      year: 0,
      amount: 0,
      answers: {},
      funding: { name: 'Fisheries Habitat Fund', organization: 'Pacific Fisheries Trust', amount: 48000 },
      quote: 'Participants and funding, page 1 — “Pacific Fisheries Trust, Fisheries Habitat Fund, $48,000”',
      passage: 'funding',
      page: 1,
      confidence: 'High',
    },
    {
      id: 'report-funding-foundation',
      measure: '',
      year: 0,
      amount: 0,
      answers: {},
      funding: { name: 'Community Streams Grant', organization: 'Placerville Community Foundation', amount: 12500 },
      quote: 'Participants and funding, page 1 — “Placerville Community Foundation, Community Streams Grant, $12,500”',
      passage: 'funding',
      page: 1,
      confidence: 'High',
    },
    {
      id: 'report-contact-field',
      measure: '',
      year: 0,
      amount: 0,
      answers: {},
      contact: { name: 'Alma Reyes', role: 'Field contact', organization: 'Deer Creek Watershed Alliance', email: 'a.reyes@dcwa.org' },
      quote: 'Participants and funding, page 1 — “Alma Reyes, a.reyes@dcwa.org, primary project coordinator”',
      passage: 'funding',
      page: 1,
      confidence: 'High',
    },
    {
      id: 'report-contact-monitoring',
      measure: '',
      year: 0,
      amount: 0,
      answers: {},
      contact: { name: 'Tomás Ibarra', role: 'Monitoring contact', organization: 'Granite Bay Ecological Consulting', email: 't.ibarra@gbec.com' },
      quote: 'Monitoring, page 3 — “Monitoring contact: Tomás Ibarra, Granite Bay Ecological Consulting, t.ibarra@gbec.com”',
      passage: 'monitoring',
      page: 3,
      confidence: 'High',
    },
  ],
  notAsked: [
    'Large wood structures placed, 14 structures',
    'Pools created, 14 pools',
    'Watershed: South Fork American River. This project has no Watershed field.',
    'Site coordinates 38.742, −120.681. Location changes only from a spatial file.',
    'Landowner: Hollis Family Ranch. Not a contact or a funder.',
  ],
  skipped: ['Budget table, page 4: spend is recorded by year, not by grant.'],
  document: {
    pages: [
      {
        label: 'Page 1',
        passages: [
          {
            id: 'dates',
            heading: 'Project dates',
            lines: ['Start: June 2023', 'Completion: September 2026', 'Update for a multi-year project: No'],
          },
          {
            id: 'location',
            heading: 'Project location',
            lines: [
              'County: El Dorado',
              'Watershed: South Fork American River',
              'Stream: Deer Creek',
              'Site coordinates: 38.742, −120.681',
            ],
          },
          {
            id: 'funding',
            heading: 'Participants and funding',
            lines: [
              'California Watershed Restoration Board, Watershed Resilience Grant Program, $255,500, funder',
              'Pacific Fisheries Trust, Fisheries Habitat Fund, $48,000, funder',
              'Placerville Community Foundation, Community Streams Grant, $12,500, funder',
              'Deer Creek Watershed Alliance, Alma Reyes, a.reyes@dcwa.org, primary project coordinator',
              'Hollis Family Ranch, landowner',
            ],
          },
        ],
      },
      {
        label: 'Page 2',
        passages: [
          {
            id: 'results',
            heading: 'Results',
            lines: [
              'Large wood structures placed, 14 structures',
              'Pools created, 14 pools',
              'Volunteer events held, 9',
              'Seed collected, 40',
            ],
          },
          {
            id: 'treatments',
            heading: 'Treatments and metrics',
            lines: [
              'Riparian invasive plant control, 4.2 acres',
              'Livestock exclusion fence installed, 3,960 feet',
              'Riparian planting, 2,112 feet of stream',
              'Riparian tree planting, 6 acres',
              'Riparian shrub planting, 6 acres',
              'Total riparian treatment, 6 acres',
            ],
          },
        ],
      },
      {
        label: 'Page 3',
        passages: [
          {
            id: 'narrative',
            heading: 'Narrative',
            lines: [
              'To date the Alliance has planted 12,400 native trees and shrubs along both banks.',
              'Nine volunteer events drew about 20 people each for a four-hour morning.',
            ],
          },
          {
            id: 'monitoring',
            heading: 'Monitoring',
            lines: ['Monitoring contact: Tomás Ibarra, Granite Bay Ecological Consulting, t.ibarra@gbec.com'],
          },
        ],
      },
      {
        label: 'Page 4',
        passages: [
          {
            id: 'budget',
            heading: 'Budget by activity',
            lines: ['Instream, $186,000', 'Riparian, $130,000'],
          },
        ],
      },
    ],
  },
};

/** Readings by project slug. A project without one offers no import. */
export const IMPORT_FIXTURES: Record<string, { sheet: ImportReading; text: ImportReading; report?: ImportReading }> = {
  'deer-creek-riparian-corridor-enhancement': {
    sheet: DEER_CREEK_SHEET,
    text: DEER_CREEK_TEXT,
    report: DEER_CREEK_REPORT,
  },
};
