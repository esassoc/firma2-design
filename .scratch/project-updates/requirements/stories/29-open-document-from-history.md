# 29 — A Contributor opens an import's document from its row in the change history

Type: story
Epic: A — Import a report
Release: later
Status: needs-info
Revision: 1
Blocked by: 22, 03
Covers: RUL-65
Sources: not in the prototype (the Change history sheet at `/prototypes/projects/deer-creek-riparian-corridor-enhancement` names the document as text); spec #19; interview 2026-11-23, Q-26
Snapshot: not yet captured
Read with: `../epics/E-A-import-a-report.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (RUL) · `../../../open-questions.md` (Q-n) · `../../spec.md` (spec #n)

Can start: nothing. Waiting: R1 on Q-81.

**This story is a stub.** The prototype does not show it. It states the one rule that is decided and lists what must be decided before it can be built or signed off.

## Story

As a Contributor, I want to open the document an import came from straight from its row in the change history, so that I can check later that what went on the record is what the report says.

## Description

Story 22 lists each import in the project's change history and names its document as text. This later story makes that row a way in to the kept document (enabler 03). The spec says the document is reachable from the change history and from the review; the review half is story 33, in the first release, and the interview (Q-26) moved this half to later.

## Requirements

R1. An import's row in the change history offers a way to open that import's document.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The row itself — story 22.
- Opening the document from the review, at a change's passage — story 33.
- Keeping the document, and who may open it — enabler 03.
- An import that was undone, which has no row — story 23 (R7).

## Needs to know from elsewhere

- The change history has one row per import, reading "`<N>` changes from `<document name>`", with the day and who added it — owned by story 22.
- Only people who can edit or publish the project can open an import's document, and nobody else receives any of it — owned by enabler 03.
- The document is not listed as a file anywhere on the project — owned by story 24.

## Scenarios

**S1 — The row opens the document** (proves R1)
- Given the crew log's changes were added to Deer Creek, so its change history has the row "6 changes from deer-creek-crew-log-2025.xlsx"
- When a Contributor who can edit Deer Creek opens the document from that row
- Then the document kept with that import is opened

## Open questions

Q-81 holds everything that must be decided. Each part adds requirements, scenarios and the script:

- Q-81 (a) — where the document opens and how it is closed.
- Q-81 (b) — what is shown for a file that cannot be shown; the crew log in S1 is one, so it decides S1's Then.
- Q-81 (c) — where in the document it opens, with no change selected.
- Q-81 (d) — who can open the change history at all; it decides whether anyone who cannot open the document ever sees the row.
- Q-81, parts (e) to (i) — what the control on the row is and reads; pasted text; whether the row still opens the document once the import's changes are published; a document that cannot be fetched; a narrow screen; whether the changes the import made, and their places in the document, can be reached from here. Each adds requirements and scenarios.
- Q-82 — S1: the count of six in the row's wording.

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | decided, not built | RUL-65 |

- Prototype files: `src/components/projects/firma2-project-actions.astro` (the import's row, with the document's name as plain text); `src/lib/report-source.ts` (how a document is shown beside changes, the nearest existing behavior).
- Data shapes, as the prototype models them: the import holds its document's name and kind; the document is either the file or pages of passages.
- Do not copy: the document kept in the browser and previewed from an in-memory address.

</details>
