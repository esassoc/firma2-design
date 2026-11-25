// The runtime half of firma2-provenance (src/components/shared/
// firma2-provenance.astro): the same one-line "where this value came from",
// built in the browser for values the page works out as the record changes —
// a measure measured from the work areas, an estimated measure, the places a
// work area falls within.
//
// ONE SHAPE, both halves: `source` first (front-loaded: how the value was
// arrived at and from what), then an optional `detail` after a middle dot —
// the edition, or the shapes it covers. Never a sentence, never a time stamp
// that is always "now".

import '../components/shared/firma2-provenance.css';

export interface ProvenanceParts {
  /** "Measured from the work areas", "Estimated with Restoration carbon". */
  source: string;
  /** "2026.1", "Upland buffer unit". */
  detail?: string;
  /** Sit inline in a one-line cell instead of as its own line. */
  inline?: boolean;
}

export const provenanceText = ({ source, detail }: ProvenanceParts): string =>
  detail ? `${source} · ${detail}` : source;

export const provenance = (parts: ProvenanceParts): HTMLElement => {
  const el = document.createElement(parts.inline ? 'span' : 'p');
  el.className = 'firma2-provenance typography-body-sm';
  if (parts.inline) el.dataset.inline = '';
  el.textContent = provenanceText(parts);
  return el;
};
