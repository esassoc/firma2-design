# Public site settings

Status: ready-for-human
Date: 2026-11-24

Step 3 of the public-views work (`.scratch/public-views/inventory.md`): the
settings that customize the public pages. Step 1 was the inventory, step 2 the
templates.

## Problem

The public home was built with its story half hard-coded: the description, the
featured projects and the announcement were seed data, and the order of the
page, the navigation bar, the footer and the fonts were the product's. A
workspace could not make the site its own without us.

## Who it is for

- **Administrator** — sets the public site up, and returns when there is news
  (a deadline to announce, a new funder to name, a project to feature).
- **Visitor** — reads the result. Never on these screens; the preview and the
  contrast table stand in for them.

## The brief's five questions

1. **One question:** "What does the public see when they arrive, and is it ours?"
2. **Readers:** the administrator. Hardest: one with no web experience, who must
   not be able to break the page or publish half an edit.
3. **Series or scalar:** a short ordered series (sections, bar items) and
   scalars (each section's choices, fonts, three colour roles).
4. **Irreversible:** Publish changes what the public sees. Removing a written
   block deletes its words.
5. **Cut:** free fonts and colours, typed figures, a second brand colour,
   per-section layout knobs.

## Decisions

Settled by the user on 2026-11-24 ("ok" to the proposed scope).

| # | Decision |
|---|----------|
| 1 | The public site's settings are one area of Workspace settings, **Public site**, with parts for Home page, Navigation, Theme and Footer. The public home sits beside the controls as a live preview. *(2026-11-24)* |
| 2 | Changes are a **draft** until an administrator presses **Publish**. The public reads only the published settings; the preview reads the draft, at desktop and phone width. An administrator can discard the draft or reset it to the defaults. *(2026-11-24)* |
| 3 | An administrator chooses **what appears, never a number**. Results, goals, funders and totals stay computed from published projects; the settings pick, order and word them. *(2026-11-24; restates the home's 2026-11-20 rule)* |
| 4 | **Fonts** are a short list of tested pairings, not any font. *(2026-11-24)* |
| 5 | **Colours** are a few named roles (brand, introduction background, accent), not free colours on any element, so the contrast check can grade every combination. Contrast warns and does not block, as Branding does. *(2026-11-24)* |
| 6 | The home is **modular**: the one-of-a-kind sections (introduction, map, goals, recently updated, partners) can each be removed, put back and reordered, and each has a few choices of its own. Written blocks — text, image with text, button, an embedded custom page — can be added more than once. *(2026-11-24)* |
| 7 | The **Public access** and **Contact details** switches move from Custom pages to Public site. *(2026-11-24)* |
| 8 | A section that is on the page but has **nothing to show** says so in the settings, with the reason. *(2026-11-24)* |
| 9 | The **announcement** has a message, a link, and a first and last day, so it comes down by itself. *(2026-11-24)* |
| 10 | The site has an **identity** of its own: name, logo, browser-tab icon, and the image and sentence shown when its link is shared. *(2026-11-24)* |
| 11 | The **navigation bar** can be reordered, renamed and trimmed; an administrator chooses which custom pages its Pages menu lists and can add outside links. *(2026-11-24)* |
| 12 | The **footer** can carry the contact address, the workspace's own links, its social accounts and its funders. *(2026-11-24)* |
| 13 | Theme, navigation and footer apply to **every public page**; sections apply to the **home only**. *(2026-11-24)* |
| 14 | **Later, not now:** custom domain, analytics, languages, and the same section builder for organization and project public pages. *(2026-11-24)* |

## Built this way, not yet confirmed

Choices Claude made while building. Each is a proposal until the user agrees.

- **The brand colour stays in Branding** and is linked from Theme, not set
  there. It re-skins the whole product and applies as it is picked; a second,
  public-only brand colour would let the site and the application disagree. The
  accent is the one free colour and colours only the introduction's results.
- **The navigation bar's colour** is a fourth role (Neutral, Brand color, Dark),
  because the request named the bar's colours.
- **Site details** is a fifth part, holding Access (decision 7), name and logo,
  and the link preview.
- **Six font pairings:** Standard, Public Sans, Atkinson Hyperlegible, Source
  Serif with Source Sans, Merriweather with Public Sans, Lora with Inter. Loaded
  from Google Fonts once chosen.
- **The introduction's photographs are the featured projects' own.** There is no
  separate hero photo to upload.
- **The share image is one of the workspace's project photos**, chosen from a
  list, not uploaded.
- **Funders in the footer are names**, from published projects' funding. No
  logos: organizations have none in the product yet.
- **Limits:** four results and three featured projects (the introduction's
  room); recently updated shows three or six.
- **The map's "Opens on"** is All projects or one county.
- **Social accounts are label-and-address links**, like the footer's other links.
- **Theme is plan-locked below Agency**, as Branding is.
- **Removing a written block deletes it** with no confirmation; Discard changes
  is the way back.

## Faked in the prototype

- The settings live in the browser (`src/lib/public-site-store.ts`), and the
  public page rearranges itself from them after it loads
  (`src/lib/public-site-apply.ts`). Production would render the published
  settings on the server.
- Uploaded images are kept as downscaled data URLs.
- Public access and Contact details are stored but change nothing yet.
- The first and last day of an announcement are compared with the browser's date.

## Samples for each state

All reachable from the settings screens with no seed needed:

| State | How to reach it |
|---|---|
| Default site | Clear `firma2:public-site:v1`, or Reset to defaults |
| Unpublished changes | Change anything; the header shows the badge, Discard changes and Publish |
| Section with nothing to show | A workspace with no public goals or partners (the row says "Nothing to show yet") |
| Written block not filled in | Add section › Button and leave it blank ("Not shown until filled in") |
| List at its limit | Introduction › Results with four chosen |
| Below-contrast colours | Theme › Accent, pick a dark colour on the Dark background |
| Navigation too long for the bar | Add outside links until the bar folds into Menu |
