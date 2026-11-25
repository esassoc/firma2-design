# 16 — Reader reads a ring's measure name and figure by hovering it

Type: story
Epic: E-B Read progress against the tree
Release: first
Status: needs-triage
Built on proposals awaiting validation: Q-223
Revision: 1
Blocked by: 15
Covers: STA-8, ACN-6, RUL-26, RUL-60
Sources: `/prototypes/classifications` (the Outline's Progress column); spec #7; Q-192
Snapshot: not yet captured
Read with: `../epics/E-B-read-progress.md` · `../standing-requirements.md` · `../terms.md` · `../fixtures.md`
Look up IDs in: `../inventory.md` (OBJ, SCR, STA, ACN, RUL) · `../../../open-questions.md` (Q-n) · `../spec.md` (spec #n)

Can start: R1 to R7; R3 rests on proposal Q-223.

## Story

As a reader scanning the Outline, I want a ring to tell me which measure it is and how far along it is when I point at it, so that I can read a row of rings without opening the row.

## Description

A classification's row in the Outline shows a small ring for each performance measure, and a ring alone does not say which measure it is. A small bubble under the ring names the measure on one line and gives its figure on the next. It is a convenience: the same two facts are in the opened measure lines of the row (story 15, R9), so nobody needs a pointer to reach them. To see it in the prototype, open `/prototypes/classifications` with F1 and hover the third ring of Salmon & steelhead recovery (F3.1).

## Requirements

R1. Moving a mouse onto a ring in the Progress column and keeping it there for 300 ms opens a bubble under the ring, centred on it. It holds two lines: the measure's name, and under it the measure's figure as the opened measure line words it, for example "Stream miles of instream habitat improved" over "14.5 of 30 miles goal".

R2. Only one bubble is open at a time. Moving to a neighbouring ring within 300 ms of the last bubble closing opens the new bubble at once, with no wait; after a pause of 300 ms or more the wait applies again. Moving off the ring before 300 ms have passed opens nothing.

R3. A ring is not a keyboard stop and opens no bubble by focus. A keyboard reader reads the same name and figure as text by opening the row's measure lines with the chevron "Show measures for `<name>`" (story 15, R9) (proposed, Q-223).

R4. A bubble closes when the pointer leaves the ring, unless the pointer has moved onto the bubble; it stays open while the pointer is on the bubble, and closes when the pointer leaves the bubble, unless it has gone back onto the ring. No timer closes it. It closes at once when Escape is pressed, when the page or any pane in it is scrolled, and when the window is resized. After Escape it opens again only when the pointer enters a ring again.

R5. The bubble is never cut off by the table or the window: it is placed under the ring and shifted sideways to stay 8 pixels inside the window; it opens above the ring when there is no room below; its notch points at the ring it is about, even when the bubble has been shifted; text wider than 22rem wraps, and the bubble shrinks to its text.

R6. Nothing is reachable only by hover: a device with no mouse (touch, a pen) does not open the bubble, and the same name and figure are on the opened measure line under "Show measures for `<name>`" (story 15, R9). A screen reader hears "`<measure name>`: `<figure>`" from the ring itself (story 15, R6) and is not told the same words twice.

R7. The bubble carries the same figure words as the opened measure line and as the ring's accessible name, so the three can never disagree.

Standing requirements apply: see `../standing-requirements.md`.

## Out of scope

- The Outline's rows, folds and opened measure lines — see story 15.
- How a figure is counted and worded — see story 14.
- The side-panel button and the peek, which also show every measure's full figure — see story 18.

## Needs to know from elsewhere

- A ring's accessible name "`<measure name>`: `<figure>`" and the list of rings' name are set by the Outline — owned by story 15 (R6).
- The figure's words ("14.5 of 30 miles goal", "11.1 of 18 acres planned", "Not reported"; the line "No goal set" is not part of it) — owned by story 14 (R6, R9).
- Every screen must work with touch and a phone, and nothing may need hover alone — owned by the mobile foundation spec (SR-3).

## Scenarios

**S1 — Hover names the ring** (proves R1, R7)
- Given F1 on the Outline, a mouse and no bubble open
- When the reader rests the pointer on the third ring of "Salmon & steelhead recovery" for half a second
- Then a bubble under the ring reads "Stream miles of instream habitat improved" on one line and "14.5 of 30 miles goal" on the next.

**S2 — No bubble for a passing pointer** (proves R2)
- Given the same row
- When the pointer crosses a ring and leaves it within 100 ms
- Then no bubble opens.

**S3 — A neighbour opens at once** (proves R2)
- Given the bubble of the third ring is open
- When the pointer moves onto the fourth ring
- Then the third bubble closes and the fourth opens at once, naming "Acres of floodplain habitat reconnected" over "106 of 1,000 acres goal".

**S4 — A keyboard reader reads the same facts as text** (proves R3)
- Given a keyboard reader on F1's Outline
- When they press Tab through a row's controls
- Then no ring takes focus and no bubble opens; the chevron "Show measures for Salmon & steelhead recovery" does, and opening it shows each measure's name and figure as text.

**S5 — The bubble can be reached** (proves R4)
- Given the bubble of a ring is open
- When the pointer moves from the ring onto the bubble
- Then the bubble stays open; moving the pointer off the bubble and not onto the ring closes it.

**S6 — Escape and scrolling close it** (proves R4)
- Given a bubble is open
- When the reader presses Escape (and, separately, scrolls the page)
- Then the bubble closes and does not come back until the pointer enters a ring again.

**S7 — A ring in the last column is not cut off** (proves R5)
- Given a window narrow enough that the Progress column touches the right edge
- When the reader hovers the last ring of a row
- Then the whole bubble is on screen, 8 pixels or more from the edge, with its notch over the ring.

**S8 — Touch opens no bubble** (proves R6)
- Given a touch device or a phone-width window
- When the reader taps a ring
- Then no bubble opens, and "Show measures for Salmon & steelhead recovery" opens lines with the same name and figure.

## UAT script

Preconditions: A signed-in reader (F5) with a mouse, on the Classifications page in Outline (story 15). Window at laptop width.
Test data: F1; F3.1 (the third ring of Salmon & steelhead recovery) and the fourth ring of the same row.
Reset: none needed.

| # | Do this | You should see |
|---|---|---|
| 1 | Rest the pointer on the third ring of "Salmon & steelhead recovery" | After a short wait, a dark bubble under the ring: "Stream miles of instream habitat improved" and below it "14.5 of 30 miles goal" |
| 2 | Move the pointer onto the fourth ring | The first bubble closes and a new one opens at once: "Acres of floodplain habitat reconnected" over "106 of 1,000 acres goal" |
| 3 | Move the pointer from the ring down onto the bubble | The bubble stays |
| 4 | Move the pointer well away | The bubble closes |
| 5 | Rest on a ring again, then press Escape | The bubble closes |
| 6 | Press "Show measures for Salmon & steelhead recovery" | Lines under the row with the same names and figures as the bubbles |
| 7 | Make the window narrow, scroll the table so the last ring is at the right edge, and hover it | The bubble is fully on screen with its notch over that ring |
| 8 | Press Tab repeatedly through the "Salmon & steelhead recovery" row | Focus goes to the name, the chevron and the side-panel button, never to a ring; no bubble opens |

## Open questions

None open. Each question below carries a proposed answer, written into the requirements and awaiting validation.

- Q-223 (proposed) — Can a ring take keyboard focus?

<details>
<summary>Notes for whoever builds it</summary>

| Requirement | Tag | Inventory IDs |
|---|---|---|
| R1 | shown | STA-8; ACN-6 |
| R2 | shown | ACN-6 |
| R3 | proposed (Q-223) | RUL-60 |
| R4 | shown; shown | ACN-6; RUL-60 |
| R5 | shown | STA-8 |
| R6 | shown; shown | RUL-26; RUL-60 |
| R7 | shown | STA-8; RUL-26 |

- Prototype files: `src/components/shared/bcn-tooltip.ts` (written for the Outline's rings; used nowhere else; lines 104 to 175); `src/components/classifications/firma2-classification-outline.astro` (the tooltip wraps each ring; its text is `<name>\n<figure>`, `labelled` because the ring's own label says the same words; lines 108 to 118).
- Data shapes: the bubble's text is the measure's name, a line break and the figure.
- Do not copy: the choice of an `esa-tooltip` versus `bcn-tooltip` (a build matter: the hub's tooltip clipped at the table's edge); the tooltip's focus path (a ring takes no focus).

</details>
