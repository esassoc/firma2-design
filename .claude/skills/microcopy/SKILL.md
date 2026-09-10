---
name: microcopy
description: MANDATORY before writing or editing ANY microcopy in this spoke — every string a user cannot edit. Titles, headings, labels, button text, card summaries, empty states, tooltips, helper/hint text, placeholders, error and validation messages, toasts, table column headers, nav items, tab names, dialog titles, confirmation copy, mock/seed data labels. Triggers on writing or editing .astro/.ts/.tsx/.md files that contain user-facing strings, on any "write the copy for", "name this section", "what should this button say", "label this", "add a tooltip", and during /new-prototype, /design-qa, and /ship. Enforces the NN/g informative-microcopy method: Clarity > Concision > Character, front-loading, character budgets, and a plan → write → edit → check loop. Applies to invented mock data too.
---

# Microcopy

**Microcopy = every string the user cannot edit.** In this spoke that is nearly
all interface text: titles, headings, nav and tab labels, buttons, card
summaries, empty states, tooltips, helper text, validation errors, toasts,
column headers, dialog titles. Mock/seed data labels count too — a fake project
name is still copy a reviewer reads.

Roughly **fewer than 3 sentences**. (2–3 paragraphs on one idea = short-form.
3+ paragraphs = long-form. Both are *built out of* microcopy — titles, headings,
lead paragraphs, summaries — so this skill still governs those pieces.)

## The rule of precedence — never invert it

```
Clarity  >  Concision  >  Character
```

Cut words only while the meaning survives. Add personality only where clarity
is already intact. Character is the most subjective C and the first to sacrifice.

---

## 1. Clarity — deliver the key information

Two jobs every piece of informative microcopy does:

- **Information scent** — the user's estimate of "is this worth my click?"
  Judged on *usefulness* of the information and *ease of finding it*.
- **Signposting** — telling users where they are and what's available.
  Titles, headings, subheadings mark place and position.

**Requirements:**

- **Be relevant.** It must be worth something to *this* user for *this* task.
  Personalize when the app knows who's reading (role, agency, project state).
- **Avoid jargon your reader can't reasonably parse.** Three readers see this
  copy, and every string has to serve all of them:

  | Reader | What they bring | What they need |
  |---|---|---|
  | **Domain professionals** — grant, restoration, program staff | Daily fluency in the vocabulary | The precise term. Plain-washing it costs them accuracy. |
  | **Client decision-makers** reviewing the design | Program knowledge, not tooling knowledge | Headings that make sense read cold, with no task in mind. Front-load harder. |
  | **Mixed / occasional users** — partners, landowners, grantees | Little shared vocabulary | An affordance to decode the term without leaving the page. |

  So: **keep the domain term** (*BMP*, *reach*, *treatment*, *obligation*) — it's
  the clearest word for the fluent reader, and swapping it for a vague synonym
  serves nobody. But set the **tooltip trigger by the widest reader, not the
  fluent one**: if an occasional user would stall on it, it gets an info
  affordance, even when daily staff would find that obvious. Internal *system*
  vocabulary is different — that's not jargon to tooltip, it's a naming bug.
  Rename it.

  Never bloat the label to do a tooltip's job.
- **Tooltip pattern:** say what it means *to their decision*, not what it is.
  A tooltip annotates a label that is already on screen, so it must carry only
  what the label and its surroundings do NOT: never restate the label, the
  column beside it, or the value in the cell. Strip the tooltip to the fact the
  reader could not already see. If that fact is one word, the fix is usually the
  **label**, not a tooltip.

  > Before: "Still Image resolution indicates the maximum number of megapixels
  > (MP) a camera sensor is able to capture…"
  >
  > After: "Megapixels (MP) indicate how detailed your photos can be. 12–24MP
  > works for social or personal use; professionals usually work above 30MP."

**Before writing, state these four:**

1. **User's key takeaway** — one sentence, out loud. If you can't, don't write yet.
2. **Organization's goal** — what the product needs emphasized. Balance against 1.
3. **Visual hierarchy** — what gets read first, where it sits, how much room it has.
4. **Plainest phrasing** — the most straightforward way to say it. Write that.

Sometimes a microcopy problem is a long-form problem, or a *structure* problem.
If the heading can't be made clear, the section may be wrong. Say so.

---

## 2. Concision — absorb it fast

**Front-load.** Put the unique, information-carrying words first. This survives
truncation and rewards scanning.

- ✅ "Invoice overdue — 14 days" ❌ "You have an invoice that is now 14 days overdue"

### The four concision defects — check every string

| Defect | Smell | Fix |
|---|---|---|
| **Expletive** | `There is / there are / it is` + to-be | Rearrange. "There was an error in the code" → "The code had an error." |
| **Determiners & modifiers** | `very`, `really`, `kind of`, `-ly` adverbs | Delete. "Usability tests are really the backbone" → "Usability tests are the backbone." |
| **Passive voice** | Sentence still parses with "…by zombies" | Find the actor; make it the subject. |
| **Redundancy** | Two words, one idea | Delete. "intuitive and easy-to-use" → "intuitive." |

### Character budgets

| Element | Max |
|---|---|
| Title / heading | **60** |
| Email subject line | **60** |
| Description / summary / card body | **160** |
| Push notification | **200** |

These are NN/g defaults, not physics. Before committing, check the **real**
constraint: the `esa-*` lego's actual slot, the column width, the truncation
behavior at the narrowest breakpoint. The component's space wins over the table.

Going longer is legitimate for **clarity**, **SEO keywords**, or **style
constraints** — never for padding.

---

## 3. Character — voice, last

**Character** = tone, references, humor, personality, emoji, anything that
creates connection. For *informative* microcopy it is **nice to have**, not
required. Other categories (errors, empty states, onboarding) can carry more.

**Character is a dial, not a direction.** The job is hitting the *right* level
for the context — sometimes that means adding, sometimes subtracting. NN/g's
own practice set makes this explicit: a legal-ID form hint needed *more*
warmth, while an error reading "Well, that didn't work. But neither did the
Titanic, and people still talk about it." needed far *less*. A joke inside a
failure state is over-dialed.

- **House default: warm and plain.** Human and unfussy — contractions are fine,
  second person is fine — but never cute at the expense of precision. These are
  professionals doing accountable work with public money, and the copy is read
  cold in client reviews as often as it's used in anger.
- Keep the dial near zero in anything reporting money, compliance, status, or
  failure. An error tells the reader what happened and what to do next; that's
  all it does.
- Never buy character with clarity.

## 4. The editing checklist — canonical, run it per string

This is NN/g's checklist verbatim. Run it on **each element separately** — a
card's title and its summary get their own pass, not one shared verdict.

| Group | Criteria | Question | Answer |
|---|---|---|---|
| **Clarify** | Key Takeaway | Did the microcopy communicate the key takeaway? | Yes / No |
| | Jargon + Brand Terms | Can the audience reasonably understand the word choice? | Yes / No |
| **Concision** | Clutter | Have all unnecessary words been removed or rephrased? | Yes / No |
| | Front-Loaded | Is the primary information contained in the **first half** of the microcopy? | Yes / No |
| | Character-Limits | Does this fit the standard character limit for this microcopy? | Yes / No |
| **Character** | Tone of Voice | Does the tone of voice match the audience and brand? | Yes / No |
| **Misc (all)** | Vibe Check | Does it sound good and/or natural? | Yes / No |
| **Misc** *(omit for push notifications and subject lines)* | SEO Keywords | Does the microcopy include relevant keywords to improve searchability? | Yes / No / N/A |
| | Design Appearance | Does the microcopy visually align with the design? | Yes / No |

Any **No** is a rewrite, not a note. Work top-down: a Clarify failure usually
dissolves the rows beneath it.

Two rows are easy to skip and shouldn't be:

- **Vibe Check** — read it aloud. Copy that passes every rule and still sounds
  robotic has failed.
- **Design Appearance** — does it *look* right in the actual lego? A title that
  wraps to three lines or a summary that truncates mid-word fails here even at
  a legal character count. Check it in the component, not in the editor.

### The concision sub-pass

When cutting, ask these four in order (they're the per-element checklist from
the course):

1. Can I reduce word count while preserving the message?
2. Are there any common concision mistakes in this microcopy? *(the four defects above)*
3. Do any character limits apply?
4. Is it front-loaded?

---

## Working method — the five steps

1. **Scenario** — state the task, the audience, and the hard limit. If the
   audience profile is unknown, say so rather than inventing one.
2. **Plan** — fill three columns before writing a word:

   | Clarity | Concision | Character |
   |---|---|---|
   | What must the user take away? | What's the limit, and what gets cut? | What tone, at what dial setting? |

3. **Write** — generate **3+ options**, varying the angle, not the wording.
4. **Edit** — run the checklist table above on each option, then count characters.
5. **Final copy** — commit one. When the string is a real decision (page titles,
   primary CTAs, empty states, error text), show the user the alternates with
   character counts, not just the winner.

Scanning patterns tell you if this is working: **F-pattern** gaze means the user
needed more informative microcopy elements and didn't get them. **Layer-cake**
(reading headings, then committing to one section) is the goal — it means the
signposts did their job.

## Evaluation

There is no direct metric for copy quality. Proxy signals, each ambiguous on its
own: incoming traffic (initial interest), bounce rate (wrong expectations), time
on page and scroll depth (holding attention), support tickets (help text
failing), error rate (guidance failing). Real answers come from usability
testing — give realistic tasks that expose the copy naturally, never point at a
string and ask "what do you think?"; watch for hesitation, skimming, and
incorrect assumptions.

Follow-up questions, by goal:

| Goal | Ask |
|---|---|
| **Clarity** | "In your own words, what was that [microcopy] telling you?" · "Was there anything that made this easy or difficult to understand?" |
| **Concision** | "Was there anything unnecessary or confusing in that [microcopy]?" |
| **Character** | "If this [microcopy] were spoken by a person, who would they be?" · "If you had to describe this [microcopy] in one word, what would it be?" |

## AI limits (this applies to me)

Good at: defining an existing tone, generating options, summarizing long-form,
cutting words. Bad at: replacing user research, and producing anything decent
without context. So when generating, always carry: what I'm writing, where it
appears, who reads it, the target tone, the message, and the deliverable.

---

Full source notes: `references/microcopy.md`.
Visual/aesthetic rules live in `spoke-kit:design-principles` (including verbal
restraint — no text *about* the page). Component choice lives in
`spoke-kit:component-first`. This skill owns the words.
