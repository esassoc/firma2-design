# Project detail layout — exploration log

Prototype harnesses (throwaway, delete on promotion):
- Internal record page: `/proto/project-detail?p=<slug>&v=<n>`
- Public page: `/proto/public-project?p=<slug>&v=<n>`
- Internal page, whole-page round with the 2026-11-24 data-model changes (awaiting a pick): `/proto/project-record/<variant>/<slug>`, sources in `src/proto/project-record/` and `src/pages/proto/project-record/`. Variants: current, sections, document, years.
- Sources: `src/proto/project-detail/`, `src/pages/proto/project-detail/`, `src/pages/proto/public-project/`

## Decisions so far (2026-11-02)

**The record page has two audiences, and they get two pages.** Layouts that tell a
story with photos and headline numbers serve the public reader ("what is this,
where is it, is it real?"). The internal record page is optimized for task
completion ("what is being asked of me, and is my record in good shape?").

**Public page — starting point is Wall.**
- A bento band between the hero and the body: the lead photo at 2×2, then
  figure / photo alternating (spent of cost, each measure's % with "N of M unit",
  next milestone), 4 columns at public width.
- The photo card is dropped; the band carries the photos and opens the gallery's
  lightbox.
- Open: figures read the live record in the prototype; the real port must read
  the published snapshot (`published`) like the rest of the public page.
- Open: the big percentages are blunt (100% hides "4 of 4 miles" in small type).

**Internal page — task-first round in progress** (Inbox / Checklist / This period
against Current). Attention items are derived from the record only: a closed
period with no report (`isClosedPeriod`), a closed year with no spend after
spending started, an open milestone whose date has passed, unpublished changes,
and empty sections. Every button opens a control that already exists on the page.

## Rejected (and why)

- **Field report** (photo mosaic above the facts strip): a public-reader layout;
  pushes the numbers a screen down for the people who work in the record.
- **Overview + tabs**: splits the reading without speeding up any task.
- **Briefing** (summary bento + unboxed document): a public/executive glance, and
  the summary tiles repeat the tables.
- **Grid** (two-column bento of the real sections, no rail): the closest of the
  bento set to internal use, but it is a reshuffle, not a task answer; it also
  reverses the read/set split.
- **Unfold** (summary tiles that expand into sections): costs a click before any
  fix; more suited to a glance than to work.
- **Wall as the internal page**: kept for public instead (above).
