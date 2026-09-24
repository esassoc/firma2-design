# Product brief — who we build for, and what we optimize

The standing brief for ProjectFirma 2.0 prototypes in this spoke. Read it before
designing a new screen; update it when a screen teaches us something the brief
did not already say.

**What this document is for.** Every screen we build makes the same handful of
judgment calls — who is this for, what do they want first, what gets the room,
what gets cut. Those calls have been getting made well and getting written down
*in the file where they were made*, which means the next screen has to rediscover
them. This is where they live once.

**What it is not.** It does not cover visual style, tokens, or component choice —
those are the `spoke-kit:design-principles` and `spoke-kit:component-first` skills.
It does not cover interface wording — that is the repo-local `microcopy` skill.
This document is one level up from all three: it is about *who* and *why*, and
they are about *how*.

> **Status, by section — they are not equally solid.**
> **§0 is GROUNDED**: the purpose chain and what a performance measure *is* come
> from the client directly. Treat it as settled and reason from it.
> **§4 is EARNED**: each principle was paid for by a decision on a screen that
> exists, and the screen is named.
> **§1 is INFERRED**: the four readers come from the domain and from our own
> decisions, not from research. Everything unvalidated is marked. See
> [Open questions](#open-questions) for what to ask the client, and do not let an
> inference in here harden into a finding.

> **Confidentiality.** This repo and its deployed site are PUBLIC. Nothing
> client-specific — named agencies, real programs, real numbers, meeting notes —
> goes in this file. It belongs in `docs/private/`, which is gitignored. Mock
> data stays invented.

---

## 0. Why the product exists

Everything below is downstream of this. When a screen decision is genuinely
close, this is the tiebreaker.

**The chain, asked "why" until it stops:**

> Track your projects → so you can track their **actions and outcomes** → so you
> can see the **health and progress** of your work → so you can **report to your
> stakeholders** → so they know what has been done, what still needs doing, and
> what became of the money they granted → so that two things become possible.

Those two things are the point, and they are different in kind:

1. **Trust with partners.** A funder who can see what their money bought funds
   you again. This is why an aggregate has to be *true* — a total that
   double-counts, or a bucket split in two by a spelling, is not a small data
   defect. It is a claim to a stakeholder that turns out to be wrong.
2. **Understanding the landscape — and acting on it.** With enough consistent
   history you can characterise ground ("heavily treated", "low risk"), find the
   gaps ("nothing here for three years"), and decide where projects and grant
   applications should go next. This is why a vocabulary has to be *closed* and
   why a question you failed to ask is an analysis you can never run.

**So: the reports are not an output of the product. They are the reason for it,**
and every screen either feeds them or reads them.

### What this makes a performance measure

Not a settings object. **A performance measure is a question you ask of every
project, forever:** *tell me X about this project.* Setting them up is how an
organization decides what it wants to learn — and what it will be able to answer
later.

That makes every measure two things at once, and a good authoring screen prices
both:

- **A tax.** Somebody answers it on every entry for the life of the program.
- **An asset.** It is what the portfolio will be able to *say* — to a funder, to
  a partner, to a model looking for the watershed nobody has touched.

**The structure of the question is now evidence-grounded, not asserted** — five
production tenant catalogs (152 measures, 1,047 options) reduce to one grammar:
*"we accomplished [quantity] [unit] of [concept] — [qualifier], [qualifier]…"*,
with ~10 qualifier archetypes, shared vocabularies, and multi-aspect concepts.
The full model, its evidence, and the rules it imposes live in
[`docs/measure-model.md`](./measure-model.md); the detailed tenant analysis is
private and not in this repository.

### The compliance loop — the failure nobody sees at authoring time

The admin's goal is gated by an experience the admin never has:

> The admin can only tell the funder X **if** reporters answer.
> Reporters do not answer when it is **cumbersome**, or when they do not
> **understand** what is being asked of them.

And the failure is silent and slow. You write a demanding measure, feel fine
about it, and discover eighteen months later that the field is empty — or worse,
full of confident garbage because nobody knew what the question meant.

**Design consequence: an admin screen must make the author feel the downstream
burden at the moment they are deciding to impose it.** Clarity of the ask is not
polish here; it is the mechanism by which the data exists at all. Reporter
guidance, plain question wording, and an escape hatch in a vocabulary
("Unspecified", so a reporter is never cornered into a wrong answer) are
load-bearing product features, not nice-to-haves.

### Where data governance fits

The closed unit list, the controlled classification vocabulary, options rather
than free text — these read as bureaucratic constraints and they are not. They
are the *only* thing that makes the asset aggregable. Without them the numbers
still exist, nothing rolls up, and the report at the end of the chain cannot be
written. Governance is not a separate concern from the ask; it is what makes an
answer worth collecting.

*Grounded: this is the client's own account of the product's purpose, given
2026-08-20. It is the least speculative section in this document — treat the
chain as settled and everything in §1 as still inferred.*

---

## 1. Who we build for

Four readers land on these screens. Most of them are not the person the software
was written for, and that is the whole difficulty: **the same screen has to serve
someone who lives in it daily and someone who arrived from a link.**

| Reader | What they bring | What they want in the first five seconds |
|---|---|---|
| **Sponsor / reporter** — the person accountable for a project record | Deep knowledge of *their* project, patchy knowledge of the system | "What is being asked of me, and is my record in good shape?" |
| **Program staff** — grant, restoration, and program officers | Daily fluency in the vocabulary and the workflow | "Show me the numbers, let me correct what is wrong, don't make me navigate." |
| **Executive / decision-maker** — a director reading across a portfolio | Program knowledge, not tooling knowledge | "Is this on track against what it promised?" |
| **Public / partner** — arrived from an index, a link, or a report | Little shared vocabulary, no task and no training | "What is this, where is it, and is it real?" |

Three consequences we keep hitting:

1. **Read-first, edit-second — but never read-only.** Most sessions are reading.
   Editing is the minority case, which is why we do not put screens into an "edit
   mode": the affordance is on the field, revealed on hover and on focus, and the
   page never changes shape. See `firma2-editable-field.astro`.
2. **Domain terms stay; the reader gets a way in.** *Reach*, *BMP*, *treatment*,
   *obligation* are the precise words and plain-washing them costs the fluent
   reader accuracy. The trigger for an explanatory affordance is set by the
   *widest* reader, not the fluent one. (This rule is the `microcopy` skill's; it
   is repeated here because it is an audience decision before it is a wording one.)
3. **A screen read cold has to make sense.** Client reviews and public visitors
   both read these pages with no task in mind. Headings front-load. Nothing
   depends on knowing what the previous screen was.

*Not yet validated: the four readers, their relative frequency, and whether the
public is a real audience for these screens or an assumption we inherited.*

---

## 2. What they are trying to do

Stated as jobs, because a job survives a redesign and a feature list does not.

- **Judge delivery.** "Is this project doing what it said it would?" — promised
  against delivered, planned against reached, spent against the budget it was
  given. This is the question the project detail page is organized around, and
  the one an executive and a member of the public turn out to share.
- **Place a record.** "Whose is this, under what program, where, over what
  years?" Nobody comes for these facts, and nobody can read the numbers without
  them.
- **Correct what is wrong.** A record is only as good as the last person willing
  to fix a field in it. Every step between noticing an error and fixing it is a
  step where the error survives.
- **Decide what the organization will be able to learn.** Defining a measure is
  authoring a question asked of every project forever (§0) — part exploration,
  part consulting other people, rarely finished in one sitting. The same job
  underneath every admin screen: adding a funding source, onboarding an
  organization, publishing a custom page.
- **Answer what is being asked of me.** The reporter's job, and the one nobody
  configuring the product ever performs. It is not on a screen we have built yet,
  which is precisely why the authoring screens have to carry it — see the
  compliance loop in §0.
- **Find the way back to work in progress.** The reason Recently viewed sits
  above the table on the Projects index rather than beside or below it.

---

## 3. What we optimize for

**In this order.** When two of these conflict, the higher one wins, and the
decision gets written down where it was made.

1. **Answer the page's question first.** Every screen owes one question an answer
   above the fold. Everything else on it is support. If you cannot say the
   question in one sentence, the screen is not designed yet.
2. **Availability of context over prominence of context.** Facts a reader needs
   in order to *read* the page must be reachable at the moment they are reading —
   which is not the same as being emphasized. The pinned record rail on the
   project detail page exists for exactly this distinction.
3. **Reversibility, honestly signalled.** Decisions that can be corrected later
   get a small, quiet affordance. Decisions that cannot — a counting rule, a
   dimension that can never be backfilled — get the room, the explanation, and
   the friction. See `pages/prototypes/measures/[measure].astro`.
4. **Always editable, always saved.** This is the stance the whole site takes,
   not a feature of one screen. There is no view mode and no edit mode; there is
   no Save. Every screen is a live record you are already inside.

   **The challenge we set ourselves: see something you want to change, and change
   it with the least friction possible.** Count the steps between noticing and
   fixing — a mode to enter, a pencil to find, a dialog to open, a button to
   press afterward — and take them out. Click the value, change it, leave. That
   is the whole gesture, and leaving is what commits.

   Two consequences worth stating, because they are the price:
   - **Nothing may move when a field opens.** A layout that reflows on edit puts
     friction back in at the moment we just removed it. The display state is a
     display-only variant of the control's own box, so the swap changes chrome
     and never geometry.
   - **If everything saves, we owe an undo.** Removing Save removes the moment
     where a user could decline. Per-field abandon (Escape) covers the common
     case; a bulk undo does not exist yet and is the outstanding debt of this
     stance. See [Open questions](#open-questions).
5. **One stable footprint.** A section should not change size as the window does
   or as its content loads. Sizes are stated once and measured, not left to
   resolve from a ratio.
6. **Subtraction over addition.** A border the container already implies, a
   divider under a title, a second route to the same act, a label the heading
   already said — all get cut. "Polish is subtractive" is used as a test, not a
   slogan.

**What we deliberately do NOT optimize for:** density for its own sake, feature
parity with ProjectFirma 1.x, screens that only make sense to someone trained on
them, or first-render cleverness that costs legibility.

---

## 4. Principles we have earned

Each of these was paid for on a real screen. The screen is named so the reasoning
can be read in full where it was written.

### Sort content by whether it has a history

A **series** has an account over time worth reading — what was delivered against
what was expected, reached against planned, drawn down year after year. A
**scalar** is a fact that can be corrected but has no interesting history: lead
organization, program, county, the description — and the budget, which is
authored once for the whole project (see the next principle).

Series lead. Scalars go in the rail — present, because the numbers cannot be read
without them; not prominent, because they are not why anyone opened the page.

*Proved on: project detail. Tested twice — the description moved out of the rail
and came back (the argument was about reading ORDER but the position bought
PROMINENCE), and funding sources moved out and stayed out.*

### Only compare two things the record actually holds

A paired bar, a percentage, a variance — every comparison asserts that both
sides of it are facts somebody committed to. If one side is derived to make the
comparison possible, the comparison is the component's opinion wearing the
record's clothes, and a reader cannot tell the difference.

Expenditures spent a release charting a per-year "budgeted" bar beside a
per-year "spent" bar. The spent figures are real; the budgeted ones were
`estimatedTotalCost` sliced by an accrual curve, because a project is budgeted
ONCE, for the whole of itself, and nothing in the record divides it into annual
allocations. The chart was inviting a reader to call 2024 "behind plan" against
a plan nobody wrote. The budget is now stated once as a figure, and the chart
carries only what genuinely varies year to year.

The test before pairing anything: *who authored the other side, and when?* If
the answer is "this component, just now", state the two facts separately.

*Proved on: project detail — expenditures. The same question is worth asking of
every progress ring and every "x of y" on the page.*

### The rail's test is scalar AND short AND narrow

Being a scalar is necessary and not sufficient. A rail row has to be readable at
a glance and has to live at 22rem. Funding sources is a set of scalars by the
definition above and still failed: a four-column table needed 434px in a 352px
column and the rail answered with a horizontal scrollbar. It also separated "who
committed the budget" from "what has been spent of it" — two halves of one
question, a screen apart.

"Scalar" here really means *no series*: a small fixed SET passes too, when each
member is one short label. Classifications — one or two goal chips per project —
joined the Key facts panel as its one set-valued pair. A set is added to and
removed from rather than retyped, so its editor is the multi-select combobox
(vocabulary-locked, like Program's select), and a pick does not commit the row
the way a select choice does — one member of a set is not "done", so the set
commits at the boundary like a text row.

*Proved on: project detail.*

### An entity chip is a door; its field still edits from the box

"Click the value to edit it" is the right default for a scalar, where
correction is the only thing a click could mean. An ENTITY value — a
classification, an organization, a person — inverts the odds: it cannot be
typo-fixed (it is picked from a vocabulary or a registry), and the act a
reader wants from it is overwhelmingly "take me to it". So an entity chip is
a real `<a>`: click navigates, with the browser's whole link grammar for
free, and hovering it raises a context card (esa-popover, `trigger="hover"`)
with the one fact that makes the hover worth it — for a classification, how
much of the portfolio shares the goal. Editing does not disappear; it moves
to the field's box: the line's empty space opens the editor, and a
hidden-until-focused Edit button after the last chip is the keyboard's path
(a container of links must not itself be a button). This is a deliberate,
scoped exception to "click the value, change it" — it applies to entity
chips, never to scalar text.

*Proved on: project detail, classifications row. The Lead organization row
still wants the same treatment (link + hover card) and is blocked on an
`esa-popover` gap — no block-level anchor mode — filed in the system
improvement ledger.*

### Room and position are different currencies

This is the one to internalise, because we have now paid for it three times on
the same screen and every time it looked like a different problem.

A section can argue convincingly that it deserves more ROOM — it is a surface
rather than a block of text, it improves with every pixel, a reader cannot use it
small. That argument is often right and says nothing at all about where the
section goes. Giving it the top of the page is a *second*, unearned grant, and it
is the expensive one: position is bounded by the fold, and whatever leads spends
the only screen the page is guaranteed to get.

**Give room freely. Make position argue separately, against optimization #1.**

Three cases, same shape:

| Section | Asked for | Got, wrongly | Where it landed |
|---|---|---|---|
| Description | reading order — "what IS this project" comes before any number | a band under the page title | last row of Key facts |
| Funding sources | proximity to the money it explains | a slot in the rail | directly after Expenditures |
| Work areas map | room — it is a surface, not text | the whole first screen | last in the column, still full width and a screenful tall |

The map is the cleanest illustration. Leading the column it put **zero pixels of
tracked data above the fold** — the page's actual question went unanswered until
a scroll. Moving it last cost it nothing it had asked for: it still has the full
width, still has no card, still fills the screen when you reach it. Only the
prominence went, and prominence was never the thing that made it good.

Halving its width was the other candidate fix and is worth recording as rejected:
at 1512px the content column is ~783px, so half is ~390px — the same width as the
rail. It would have narrowed every tracked section permanently (Expenditures'
chart from 757px to ~390px, the funding table to ~37px of slack over its measured
minimum) to buy one screen, and left the map in a portrait frame that suits
neither reaches nor polygons.

*Proved on: project detail, three times.*

### Do not put two components in charge of the same space

There was a version where the record floated *over* the map, and the map framed
its shapes around the panel. It looked right. It was two components negotiating
where content is allowed to be, and it bought nothing a reader could name. A rail
owns its column outright and neither component has to know the other exists.

*Proved on: project detail. This is the most transferable lesson in this list —
prefer a boundary over a negotiation.*

### State the record; price the burden; never simulate someone else's UI

*(Revised 2026-08-20 — this principle was "Author the artifact, not its
settings" until the artifact conceit was built and failed. The revision keeps
what the original got right and names what it got wrong.)*

Every admin screen in this product configures something **a different person
meets later**:

| You configure | Someone else meets |
|---|---|
| a performance measure | a form a reporter fills, on every entry, forever |
| a funding source | an option in someone's dropdown |
| an organization | a record someone picks from and reports on behalf of |
| a custom page | a page someone reads |

What the original principle got RIGHT, and this one keeps:

1. **Lead with the claim.** The author starts from "I need to tell my funder
   X", not from a schema — so the page opens with the sentence the measure
   will let the program say, blanks marking the undecided parts.
2. **Price the downstream burden where it is incurred.** The person
   configuring never pays the cost (§0's compliance loop), so the split
   between "costs every reporter" and "costs nobody" is card structure, not a
   footnote.

What it got WRONG: it concluded the admin should edit a **mockup of the thing
the other person meets**. Measure setup built that — labelled wells shaped
like the reporter's inputs, italic example answers inside them — and the
simulacrum failed the admin test: operating a picture of someone else's UI
needs a theory to decode (wells that look like inputs but take no input;
example answers one register away from reading as stored data, and one did —
the invented "1,240" survived two reviews before a reader asked where it came
from; labels meaning "what the reporter will see" on a site where every other
label means "what you set"). An admin asked to define a measure should
**define the measure**: rows that state facts — "Treated extent / acres ·
summed across entries", "Treatment type / Biomass removal, Thinning, …" — in
the same click-to-edit idiom as every record page. The other person's
experience is *derivable* from a stated definition; it does not need to be
impersonated by it.

*Proved on: measure setup, both directions — the artifact version was built,
shipped its own counter-evidence (the "1,240" incident was the abstraction
leaking, not a copy bug), and was replaced by direct definition rows
2026-08-20. The claim-first lede and the priced two-card split are what
survived; they were the load-bearing part all along.*

### Setup is not a wizard

A wizard encodes an assumption that does not hold: that the user finishes in one
sitting. Creating a measure asks exactly ONE question — the one that changes what
every other field means — and hands back a saved draft with its own URL, to be
filled in over days from a link you can bookmark and send to a colleague. Drafts
appear in the catalog alongside finished records, unnamed ones included; a list
that hid your half-finished work would defeat the point.

*Proved on: performance measures + measure setup. The entity-create dialog knows
nothing about measures and is meant to be reused unchanged for Organizations,
Funding Sources and Users.*

The setup milestones are stepped, and that is not a wizard either. Start,
Organizations and Funding sources each walk three screens with one question a
screen, because a screen that asks "which of these?" over a dozen tiles and a
screen that asks "any we missed?" over three fields are different questions with
different answers, and putting them on one page made neither legible. What keeps
a stepped milestone out of wizard territory is the same four properties the
measure draft has: the page has its own URL, the step rides the query string so
a link reopens the screen it was copied from, Finish later keeps the draft, and
no screen refuses to be left. The write happens on Next, over the whole
cast, so there is no half-answered state to lose.

*Proved on: Funding sources, after its one-page version drew "I have no sense of
what I'm entering" (Andy, 2026-09-18). Organizations followed.*

A stepped milestone shows its steps. A rail beside the screen lists the
milestone's steps by name, marks each as done, skipped or ahead, and lets you
go back to any step, or forward to any step already reached, so no path
through a milestone is forced and you always know where you are. It shows
place, never a count or a percentage. Next says where it goes ("Next: Project
editors"), because a bare arrow leaving a screen gave no sense of what came
after. The rail is modelled on the biochar atlas's stepper, which took it from
Claude Cowork's task steps. Next and its skip sit in a footer that sticks to
the bottom of the viewport while a screen is taller than it, so the way
forward is always in reach on a long tile screen and rests under the content
on a short one; the skip matches Next's size because they share a row.

*Proved on: every stepped milestone, after the per-screen arrows drew "I'm not
loving our paging/arrows per milestone" (Andy, 2026-09-24).*

### Setup configures the vocabulary; the product makes the links

Setup is where a program tells the system what exists: its organizations, its
people, its classifications, its funding sources. Those are reference tables,
and each one is a list the rest of the product picks from. A row that JOINS two
of them, a project to a funding source with an amount, a project to a measure
with a target, is not configuration; it is the ongoing use of the platform, and
it belongs on the record that owns it, entered by the person who knows the
number, on the day they know it. Setup that asks for those rows asks the admin
to do the program staff's work before the program has started, with none of the
context the record page gives.

The test for a setup screen: does it produce a list, or a link? A list is setup.
A link is a card on a record.

*Proved on: Funding sources. Its first cut carried a commitments table
(dbo.ProjectFundingSource) and a notes field beside the list of funds; Andy,
2026-09-18: "individual data connections between a project and funding source
feel like the ongoing maintenance and use of the platform." The commitments
moved to the project record's Funding sources card and the notes were cut. The
same reasoning replaced the First project milestone with Import projects: the
portfolio's first fill is an import from the tracking spreadsheet Start already
reads, not hand-authoring one record.*

### A fixed list is asked as a preference, in the program's own words

Some of what a program "sets up" is not its to define. ProjectFirma's six
project stages are global rows no tenant adds to or renames. Setup still has a
question there, but it is a preference over the fixed list (which of these do
you use, which does a new record start in), never a form for authoring it. The
program's own vocabulary is the evidence: its tracker already says "Funded" and
"In construction", so the screen shows the fixed list with the program's words
mapped onto it and asks for a confirm, not a cold choice.

The test: if the list is the platform's, the screen asks which and where, and
shows the tenant's words beside the platform's.

*Proved on: Project stages. A teammate's 2026-09-23 mock argued the step could
be cut because the stages are a global lookup; what survived was the subset and
the starting stage, with the tracker's Status values as the provenance that
pre-selects four of six.*

### Suggestions come from what the tenant uploaded, never from what they said they want

Intent answers name the *kind* of grouping a program uses (Focal species,
Program area); a document names the *values* (Riparian habitat, Fish passage).
A tile is a yes-or-no on a value, so every setup picker sources its cast from
the documents Start took, and intent only decides whether a milestone is wanted
at all.

*Proved on: Classifications. A teammate's 2026-09-23 mock drew three
suggestions from theme choices; the built screen drew five from the tracker's
Program area column instead, which is how every other milestone already
worked.*

A public dataset can stand beside the documents when it is the vocabulary the
documents already speak. The Spatial areas layer screen offers USGS watersheds
and Census counties because an annual report's subbasins are those units, and
a map preview proves it by filling in the areas the report named. The
documents still decide what is suggested; the public layer only says where the
boundaries come from. Typing an area by hand is gone from that walk: a name
without a boundary is not an area, so the choices are a public layer, your own
service or file, or your GIS person later.

*Proved on: Spatial areas, layer screen, after the GIS lead asked for "use a
published source" and "connect a map service" to be one question and for the
hand-typed area to go (2026-09-23 prep meeting; built 2026-09-24).*

### An empty list can be the answer

Some milestones are finished with nothing in them. A program with no GIS
analyst that "just wants it on a map" has answered the spatial question fully
when it names no areas: every project sits on its own point. So the milestone
confirms on the answers, never on a count, and the empty roster names the
outcome ("Point locations only") instead of apologising for a gap.

The test: if zero is a legitimate configuration, completion waits on the
decisions, and the empty state is written as a result, not a to-do.

*Proved on: Spatial areas. A teammate's 2026-09-23 "Five Doors" mock made
point-only a separate exit; aligned to the linear walk, it became the honest
outcome of an empty roster, and the milestone confirms with zero areas once
both preferences are answered.*

### A finish reads the program back, in one paragraph

A multi-part setup closes where it was worked, not on a screen of its own. At
11 of 11 the hub raises one paragraph between the meter and the milestones,
four or five sentences in large type. Sentence one names the program in its
own name and says it is set up. The rest reads the program back, with each
fact set as a token in the color of the milestone that produced it: the name
and the noun in Names and appearance's hue, and one count per milestone with
that milestone's icon, so each token matches the card it came from. The money
and year rules stay prose so the paragraph does not become a wall of chips;
the proposals answer stays off it, since the stage list already shows it. Settings about the site (who can see it, its
accent color) are not facts about the program and stay off the paragraph;
"Its site is Forest green" read as a place. Only
next steps with a screen get a button. Unanswered facts drop out rather than
print as zero.

*Proved on: the setup hub's finish (2026-09-23). A separate Setup complete
page with three columns of summary copy was built and removed the same day.
It said less than one paragraph on the page the admin was already on.*

The finish is announced once. When the panel arrives because the draft changed
(Complete demo, or the eleventh milestone confirming), a burst of confetti in
the eleven milestone colours rises from the paragraph for about a second and a
half, then is gone; a reload with a complete draft shows the panel quietly, and
reduced motion gets a fade instead. Celebration marks the moment of finishing,
not the state of being finished. (Andy: "make it short but nice", 2026-09-24.)

### Start asks once; later screens build on the answer

A question Start already asked is not asked again later. Its answer pre-selects
the later screen, the tile says where that came from ("From Start: Habitat
restoration"), and the save still happens on Next. Where two Start questions
did the same job, the later one went: "Do you report performance measures?" was
carried by Goals' "Report to funders and the board" and was removed
(2026-09-24).

*Proved on: Performance measures kinds, where Start's kind of work pre-presses
the kinds, and Spatial areas boundaries, where Start's map answer opens the
screen on that layer with the preview running. Found by an audit after Andy
asked "make sure we're not double asking, and that initial steps win"
(2026-09-24).*

### A measure costs every project a number every year

Whoever configures a measure never enters it. Every project lead does, on every
split, every year, and a split added later cannot be backfilled. So the cost of
detail is stated where detail is chosen, as the choice's own help text, not in
a warning after the fact.

*Proved on: Performance measures. A teammate's 2026-09-24 mock carried the
split-cost note; the walk kept it as the detail question's help text.*

### Sort fields by what survives being wrong

Fill-in-the-blank fields can be corrected a year in and nothing breaks.
Irreversible ones change the meaning of history silently. Lay the page out by
that axis, not by which fields feel related.

*Proved on: measure setup.*

### A commit bar is friction wearing a safety costume

Removing Save and Cancel from the measure setup page is the clearest version of
optimization #4, and it is worth recording because the buttons had a defensible
reason to exist and were still wrong.

The argument for them: this page holds irreversible decisions (a counting rule, a
dimension), and a deliberate commit is how you signal that weight. The reason it
does not hold: **the commit bar does not gate the irreversible fields, it gates
all of them.** It taxed renaming a measure exactly as much as changing what its
number means. Weight belongs on the field that carries it — in the copy, the
layout, the room it gets — not on a button every field has to walk past.

It also suited *this* screen worst. The page's whole argument is that a measure
is defined over days, from a bookmarked URL, in consultation with other people. A
commit bar is the one control that punishes leaving.

And it asked authors to hold two models of one product: correct a project by
leaving the field, correct a measure by leaving the field *and then finding a
button*.

What replaced it was not new machinery. The editor already listened to every
control on the record to keep its previews live; it now writes the draft on that
same signal — on `change`, not `input`, so a paragraph is one write and not three
hundred, and so the save boundary is the same "crossing the field's edge" the
rest of the spoke uses. Silent on success, and it speaks once if the browser is
blocking storage — the one failure the author cannot see.

*Proved on: measure setup. Cost: Cancel's bulk discard is gone and nothing
replaces it yet.*

### One kind of data, one list — behavior can differ by row

The measure setup page presented reported subcategories ("Also asked of the
reporter") and derived ones ("Filled in automatically") as two sections — two
different kinds of thing. The data model never agreed: both are one shape with a
`source` field. The sections were the invention, and they cost real things: the
authored order of the list was silently re-sorted, and the author had to
pre-classify an attribute before naming it.

The mental model we build to (stated by the user, and now the page): **a measure
is the thing it measures — quantity, unit, counting rule, and the primary
subcategory — plus attributes recorded about each entry. Where an attribute's
answer comes from is a property of the attribute, not a different species.**

Merging did not flatten the difference, because the difference is real — a
reported subcategory taxes every reporter forever and cannot be backfilled; a
derived one is free. The signal moved from section membership to the two places
it operates: **the fork at the add moment** (a priced "Ask the reporter
something else" against a free "Available without asking" tray) and **a source
marker on every row**, with reported rows visibly forms and derived rows visibly
facts.

The rename came with it: one noun, *subcategory* ("Primary subcategory" /
"Other subcategories"), retiring "Category", "Question", and the UI use of
"dimension" — three names for one concept was a naming bug, not a copy choice.

*Proved on: measure setup.*

### Inert, not disabled

An unwired control in a prototype stays a real, enabled button. `disabled` claims
the action is unavailable to *this user*, which is a different and false
statement — and it tells a reviewer the wrong thing about the design.

*Applies to: every prototype in this spoke.*

*Tested and bounded (2026-08-20): the claim `disabled` makes is false for an
unwired control — and true for a genuinely gated one. Publish on measure setup
is disabled while required fields are empty, with the readiness count rendered
beside it saying exactly why. The rule is not "never disabled"; it is "disabled
must be telling the truth, with the reason in view."*

### The sibling record page is the spec — for idioms, not floor plans

What transfers between record pages is the **idioms**: editable title in the
header, click-to-edit rows quiet at rest, card sections at one rhythm, the
lifecycle in the actions cluster. A screen visited *rarely* — measure setup is
the proof — leans on these hardest, because its users run entirely on what the
daily screens taught them; every bespoke control is a dialect they must
re-learn on each visit.

What does NOT transfer is the **floor plan**. The project page's facts-rail-
beside-cards anatomy is right because its record arrives mostly filled: the
rail is an index beside the numbers. Measure setup copied that anatomy
(2026-08-20, first pass) and walking a first-time setup through it was the
indictment: on a page where everything starts empty, the "index card" held
three of the seven required settings, and the admin's path ran header → main
column → rail → header. The fix was not more consistency but the right kind:
the setup page is now one column in authoring order (claim → what it means →
the reporter's form, guidance authored where it displays → the automatic
additions → the payoff chart), built entirely from the shared idioms.

Ask which job the anatomy was priced for before copying it: **reading a
record** and **filling one in** are different jobs with different floor plans,
sharing one set of idioms.

*Proved on: measure setup — folded into the project anatomy and then walked as
a first-time setup, both 2026-08-20. The walk won.*

### A collection gets "Add"; a scalar gets a per-field affordance

A set has no single field to hover — you add to it, remove from it, reorder it —
so it keeps one header control that names the act it performs. A section of
scalars has no such act, so its header control goes away entirely and each field
carries its own.

*Applies to: every section on the project detail page.*

---

## 5. How to open a new screen

Answer these five before opening an editor. Put the answers in the page's module
header — that is where the next person will look.

1. **What is the one question this screen answers?** One sentence. If there are
   two, there are probably two screens.
2. **Which of the four readers lands here, and which one is hardest to serve?**
   Design for the hardest one; the fluent reader is rarely the one who fails.
   **And on an admin screen, ask who is NOT here** — every configuration screen
   imposes something on somebody absent (§0). Name them, and put their burden on
   screen.
3. **What is series and what is scalar?** Series leads, scalars support. Then
   apply the rail test — short and narrow, or it does not go in a rail.
4. **What is irreversible here?** That gets the room and the explanation.
   Everything recoverable gets a band it can be scanned in without opening.
5. **What can be cut?** Name at least one thing. If nothing can be cut, the
   screen has not been looked at hard enough yet.
6. **If this configures something: who meets it later, and what do they pay?**
   State the record directly and price that burden on screen — never build a
   mockup of the other person's UI as the editor. See "State the record; price
   the burden; never simulate someone else's UI".

**The tiebreaker when two options are genuinely close:** which one gets a truer
report to a stakeholder, sooner? That is what the product is for (§0).

Then: `/new-prototype` for the interview-and-compose flow, `/design-qa` for the
quality pass, `/ship` to deploy.

---

## 6. Screens, built and unbuilt

The nav model in `src/data/firma2-nav.ts` shows the whole app; routes we have not
built carry no `href` and render dimmed, which is an accurate picture rather than
a styling problem.

| Group | Screen | Status |
|---|---|---|
| Explore | Project Finder, Map | not built |
| Track | **Projects index** | built |
| Track | **Project detail** | built — the reference screen for this brief |
| Track | Organizations, Funding Sources | not built |
| Report | **Performance measures** catalog | built |
| Report | **Measure setup** (one per measure) | built |
| Report | Progress Dashboard, Funding Status | not built |
| Manage | Users, Manage Organizations, Manage Funding Sources, Custom Pages | not built |
| Setup | **Setup hub**, **Start**, **Program shape**, **Names and appearance**, **Organizations**, **Funding sources**, **Classifications**, **Project stages**, **Spatial areas**, **Import projects**, **People**, **Performance measures** | all eleven milestones built as stepped walks over a browser-local draft, grouped in three by dependency, each walk with a step rail beside its screens and a sticky Next footer (2026-09-24); Start is Documents, five intent questions (Kind of work, Goals, Project groups, Map, Data entry) and Review, each screen's guidance under its headline as a lede and a row of examples instead of a side column, and its work and map answers pre-select the measures kinds and the boundaries layer (2026-09-24); at 11 of 11 the hub itself carries the finish, one large-type paragraph of the program's facts (2026-09-23); Spatial areas picks its boundaries from a public layer with a map preview (2026-09-24); the Performance measures walk scaffolds kinds of work and counts from the documents into drafts, and the separate Performance measures prototype is where they live afterward (2026-09-24) |

The two built areas are deliberately different exercises: the project pages are
about **reading a record**, the measure pages about **setting one up**. Most
unbuilt screens are a variant of one or the other, which is the main reason this
brief is worth keeping.

**Measure setup is REBUILT** (2026-08-20) on claim → editable reporter form →
payoff chart, over an evidence-grounded model (`docs/measure-model.md`):
aspects 1..n per concept, shared vocabularies referenced never copied, no
primary slot, all dimensions optional, library-first creation from ~15 standard
themes. The same day it was folded into the project page's rail anatomy, then
restructured again when a step-by-step walk of a first-time setup exposed the
borrowed floor plan (see "The sibling record page is the spec — for idioms,
not floor plans"), then stripped of its form-simulacrum when the artifact
conceit failed the admin test (see "State the record; price the burden; never
simulate someone else's UI"). It is now **one column in authoring order** —
claim, an About card (kind, classifications, definition, reporter guidance),
a "What reporters enter" card of direct definition rows, the automatic
additions, the chart — with the record's lifecycle in the header: Publish
gated by the readiness count, Retire-never-delete for anything projects have
filed against, Delete only for drafts. The four unbuilt Manage screens now
have their pattern: state the record, price the downstream burden beside it,
in the shared idioms, with the floor plan chosen by the job.

**Nothing at the END of the chain exists yet.** Progress Dashboard and Funding
Status are the reports §0 says the product is *for*, and both are unbuilt. Worth
holding in mind: every screen we have built so far feeds a screen nobody has
specified.

---

## 7. Open questions

Answer these with the client rather than in here. Each one is currently carried
as an assumption by at least one screen.

**Settled 2026-08-20**, moved out of this list and into §0: why the product
exists (the purpose chain), what a performance measure fundamentally is, and that
measures are configured **once** — so the measure setup screen is a pattern
exercise whose value is what it teaches the other admin screens, not its own
traffic. Also settled: the admin thinks **claim-first** ("I need to tell my
funder X"), not ask-first.

- **Is the public a real reader of these screens, or an inherited assumption?**
  It changes how much a page has to explain itself.
- **Who actually corrects records — the sponsor, or program staff on their
  behalf?** The whole per-field editing model is built on the answer.
- **What does a reporter's session actually look like?** Frequency, device,
  whether they arrive from an email link, how much of the record they touch.
- **What does an executive do with the answer** once they know a project is off
  track? The next action is the thing we have not designed.
- **Which numbers are actually looked at**, and which exist because ProjectFirma
  1.x had a column for them?
- **What does a reporter actually abandon on?** The compliance loop in §0 says
  cumbersome-or-unclear kills the data, but not where the line is: how many
  questions per entry is too many, which wordings get misread, whether the
  failure is more often "gave up" or "guessed". Until we know, the authoring
  screen can only show the burden honestly, not score it.
- **What is the report at the end of the chain?** §0 says the reports are the
  reason the product exists, and we have not designed one — Progress Dashboard
  and Funding Status are both unbuilt. Everything we are building feeds a screen
  nobody has specified.
- **What is the real breakpoint floor?** Everything is currently reasoned about
  and verified at desktop widths.
- **What does undo look like when nothing is ever "saved"?** This is the open
  debt of optimization #4 and the one thing we have taken away without replacing.
  Escape abandons a field mid-edit; there is no way to take back a change already
  committed, and no history of who changed what. Candidates: a per-field revert on
  the row, an undo toast on commit, a record-level change log. Worth asking
  authors which failure they actually fear — the typo, or the decision they want
  back a week later — because those want different answers.

- **Does a proposal need approval before it counts, and is a pending one
  public?** Raised by a teammate's 2026-09-23 Project stages mock. ProjectFirma
  1.0 had role-gated approval and 2.0 did not rebuild it; dbo.Project has no
  approval or visibility column, and a public pending proposal would need an
  anonymous read surface the app lacks. Cut from setup by agreement: it is
  product work (a proposal workflow), and a setup question follows only once
  there is a column to write. Both Project stages answers share that debt today:
  no tenant-side table turns a global stage off, and no create-project endpoint
  reads a starting stage.
  Program shape (2026-09-23) now asks the narrower question, whether projects
  start as proposals at all, and the answer switches the Proposal stage on
  Project stages. Who approves one is still not asked.

- **What reads the reporting year?** Program shape now asks it (2026-09-23:
  calendar, July-to-June fiscal, federal fiscal, biennium, or a typed period),
  pre-answered from the grant agreement. Nothing downstream reads the answer
  yet: no report exists, and dbo.Tenant's reporting-year field is assumed, not
  confirmed. Until a report frames its periods by this answer, any period label
  on a report surface is still an undeclared frame.
- **Where does an area's geometry come from, and who draws it?** Spatial areas
  setup records the program's answer (a published source, an uploaded file, a
  map service, or "our GIS person has it") and names the areas, but nothing
  loads a boundary. A teammate's 2026-09-23 "Five Doors" mock carried upload
  and map-service follow-up screens; both are product work, as is the published
  source catalog (which watershed, county and tribal-land layers, at what
  resolution). Until one exists, dbo.GeospatialArea rows have names and no
  geometry, so no project can be placed in an area.
- **What does "our GIS person has it" hand off?** The same mock returned a link
  "back to this question with your answers intact" so the GIS person could
  finish it. Setup has no invite or share surface, so the answer is recorded
  and nothing is sent. Open: is the handoff a setup-scoped invite, a People
  milestone role, or an email the admin writes?

- **What is an invitation?** People setup stages a go-live list (name, email,
  organization, role) and sends nothing; sending and sign-in are product work.
  Open: is the list sent at go-live as one batch or person by person, what
  happens to a person with no email, and who resends one that expires.
  dbo.Person holds the email; nothing yet models an invitation's state.
- **How does a role meet stewardship?** People setup records both, and nothing
  reconciles them. A partner-organization Editor under "Our staff edit every
  project" can edit nothing, so either the role reads as Viewer there or
  stewardship narrows what Editor means. ProjectFirma's stewardship-by-
  organization model suggests the second; confirm with the client.

- **Does a public site show every project?** Names and appearance records one
  site-wide flag, public or signed-in only. Programs with sensitive sites
  (landowner parcels, cultural resources) may need a project-level override.
  Open: is visibility per tenant only, or per tenant with project exceptions?

---

## 8. Keeping this current

- One decision, one entry. Add to
  [Principles we have earned](#principles-we-have-earned) only when a screen has
  actually paid for it — this document is a record of what we learned, not a list
  of what we intend.
- Name the screen that proved it. A principle with no screen behind it is a
  preference.
- When a principle gets *tested and reversed*, say so and keep both sides. The
  description and funding-sources entries are the model: knowing what we tried
  and why it failed is worth more than the conclusion alone.
- Move anything client-specific to `docs/private/`.
- §0 is the exception to "one decision, one entry": it is not a record of what a
  screen taught us, it is the frame everything else is judged against. Change it
  only when the client's account of the product changes.
- Related: `docs/system-improvement-ledger.md` records gaps in the hub's
  components. Different document, different job — that one is about the toolkit,
  this one is about the product.
