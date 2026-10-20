# 01 — Intake form model, field kinds, sample form

Status: resolved
Spec: ../spec.md

The one seam: a pure intake-form module (form definition, block rules, visibility, clearing, submit readiness, working vs published copy) plus its persisted store. Grow custom field kinds to text, long text, number (unit), money, date, yes/no, choose one, choose several. Seed the invented restoration sample form (three screens, two custom questions, one condition on a question and a text block).

## Acceptance
- Locked built-ins (name, type, lead organization, classifications) always present and required; each built-in at most once.
- `visibleBlocks(form, answers)`, cleared answers, and `missingRequired` behave per spec.
- Publish copies the working form to the published form; drafts read the published copy.

## Comments
