# The adapter: `docs/agents/requirements.md`

One small file per repo. It is the only place repo-specific paths live, which is what lets the skill move between projects unchanged.

## Creating it

Look before asking: find the route directory, the component directory, any prototype registry, a glossary, decision records, a product brief, a roles document, existing specs, and whether the repo is public. Then ask the user only what the repo does not answer (usually: output location, whether anything is client-sensitive, the tracker). Write the file with these sections.

```markdown
# Requirements adapter

## Prototype
- Routes: <dir(s)>
- Routes that are not the product: <e.g. docs or design-system pages, or "none">
- Components: <dir(s)>
- Data and logic: <dir(s)>
- Registry of prototypes: <file, or "none">
- Experiments (never baselined): <dir(s), or "none">
- How to run it: <command and URL shape>
- Usual prototype artifacts: <how this repo fakes storage, responses, data>

## Context documents
- Glossary: <path>
- Decision records: <path>
- Navigation model: <file that lists routes by section, or "none">
- Actors: <path and section>
- Roles and permissions: <path>
- Actor vocabulary for stories: <which of the two stories name, and how the other maps onto it>
- Feature specs: <path pattern>
- Other domain docs: <paths>
- Session transcripts (backup only): <path, or "none">

## Output
- Per feature (`<out>`): <path pattern>
- Private companion: <path pattern, or "none">
- System map: <path>
- Open questions: <path>
- Public repo: <yes/no>

## Conventions
- Status strings: <list or pointer>
- Release values: <e.g. first, later, undecided>
- Snapshots: <on/off, and how to capture>
- Tracker: <name, or "undecided">
```

A missing value is written as "none", so a later run does not ask again.
