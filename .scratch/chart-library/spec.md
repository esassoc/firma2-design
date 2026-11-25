# Chart library — parked

Status: needs-triage

Not started. This keeps what was worth saving from the project detail lab of
2026-11-24 (built with emil-get-creative, discarded the same day: the project
detail page stays as it is). The user's reason for keeping it: "this app is only
as strong as the insights it provides", so a chart library may be in our future.

Nothing here is wired into the app. `reference/marks.ts` and
`reference/marks.css` are the mark functions and their styles as they ran in the
lab, kept outside `src/` so no build reads them.

## The hue system

1. Ink is neutral; hue is data. Chrome, labels, axes and rules never take a hue.
2. A series keeps its hue everywhere it appears: its mark, its swatch, its row.
3. Performance measures take the categorical ramp in order
   (`--color-background-dataviz-categorical-1` to `-8`).
4. Funding sources take the sequential ramp spread end to end
   (`--color-background-dataviz-sequential-7` down to `-1`), so two funders are
   far apart and never collide with a measure's hue.
5. Money (spent of cost) takes the brand fill.
6. One hue carries three states by treatment, not by a second colour:
   reported is solid, planned is the same hue hollow and dashed at 65%,
   intensity (cells) is the hue mixed toward transparent from 18% to 100%.
7. Alternatives tried as a single switch: `brand` (every series the brand
   fill), `ink` (every series the text colour, funders by opacity) and `poster`
   (orange, blue, amber, pink, teal, tomato at step 9 to 11; off-system).
8. Both schemes work without changes: every colour is a token.

## Rules the marks follow

- One time axis: every series is drawn on the record's own years, Now marked.
- A figure sits on its mark: no lone number, no chart without its numeral.
- Planned is hollow and dashed, reported is solid, a missing report is a gap
  (never a zero).
- A zero or missing figure is body-size text, never display size.
- Hairlines, ticks and dotted leaders carry structure; fills belong to data.

## Chart types built

| Mark | Shows | Notes |
| --- | --- | --- |
| Year bars | Reported against planned, per year | Planned as a dashed outline behind the bar |
| Year cells | Reported per year as intensity | One cell a year; dashed when open, outlined when missing |
| Dot matrix | Reported and planned per year as counts of dots | Block of dots a year; solid reported, ringed planned; denser blocks for short timelines |
| Cumulative line | Running total against the planned curve | Planned dashed, reported solid with a light area and an end dot |
| Tick meter | Share of a target | 40 ticks; a taller tick marks plan to date |
| Dash meter | Share of a target in tenths | 10 dashes; also used as a step bar (done, current, to come) |
| Fill meter | Spent of cost | The label sits inside the bar and inverts where the fill covers it |
| Stream | Cumulative spend widening over the years | Marker lines with pill labels |
| Segment bar | Parts of a whole (funding) | One bar split by share, with leader rows under it |
| Share bars | Parts of a whole, one bar a row | |
| Lanes | Several series on one shared year axis | A label and figure on the left, the mark on the right, one Now line through all |
| Count blocks | "5 of 7 reported" | One block per item, in a section head |

Stress-tested in the lab on six invented projects (most measures, nothing
reported, most funding sources, finished, longest timeline) in both schemes.

## Open

- Where it lives: a hub request (esa-chart exists and wraps AG Charts) or spoke
  `bcn-` marks for the small inline ones.
- The Progress Dashboard draws with AG Charts (`src/lib/dashboard-figure.ts`);
  whether these marks sit beside it or replace part of it.
- Off-system when tried: mono figures, mono caps labels, the poster palette.
