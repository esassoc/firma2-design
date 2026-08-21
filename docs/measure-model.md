# The measure model — the grammar of a reported result

What a performance measure *is*, grounded in evidence rather than asserted. This
is the model the prototype's data module and measure screens implement, and the
companion to the product brief's §0 ("What this makes a performance measure").

**Evidence basis.** Five production tenant catalogs of the predecessor product
were normalized and coded: 152 measures, 222 subcategories, 1,047 options
(collected 2026-08-20; analysis is reproducible from the owner's normalized
CSVs). Tenants are anonymized here; the detailed analysis, including tenant
identification, is private and does not live in this repository. Findings below
cite the private analysis's PM1–PM11 numbering so the two stay alignable.

**Blind spot, stated up front:** this is catalog evidence — what tenants
*defined*, not what reporters actually *filed*. A defined subcategory nobody
reports against is not yet distinguishable from a used one. Conclusions about
entry behavior (especially "optional at entry") are directional until usage data
is run.

---

## The grammar

Every measure in every sampled catalog is an attempt to say one sentence:

> **"On this project, in this period, we accomplished [quantity] [unit] of
> [concept] — [qualifier], [qualifier], …"**

e.g. *"…150 acres of fuels reduction — by hand thinning, on private land, in the
northern unit."* The parts:

1. **Result concept** — the thing accomplished ("fuels reduction", "stream
   corridor restored", "people trained"). Concepts cluster into ~15 recurring
   themes across all tenants, and near-identical concepts recur across tenants
   under trivially different names — a **standard library with tenant
   selection/extension** would cover most catalogs (PM10).
2. **Aspect (1..n)** — how the concept is quantified: a count (35%), an area
   (29%), a length (16%), a mass (12%), money, or a water volume/flow (PM11).
   One concept often has several aspects (acres *and* linear feet *and* count of
   the same practice); tenants today fake this with suffix-named measure clones
   — "(area)/(length)" families (PM8). An aspect = quantity name + unit +
   precision + counting rule.
3. **Qualifier dimensions (0..n)** — orthogonal axes tagging the quantity. The
   entire observed vocabulary of 83 subcategory names collapses into **~10
   archetypes** — the qualifier questions (PM3):

   | Archetype | Question answered | Share of real uses |
   |---|---|---|
   | object-kind | what kind of thing? | 25% |
   | activity-method | done how / by what practice? | 22% |
   | land-tenure | on what kind of land? | 13% |
   | action-verb | what was done to it? (created/enhanced/restored) | 9% |
   | place-context | where? | 8% |
   | measurement-protocol | number derived how? | 6% |
   | purpose | why? | 4% |
   | species | for which species? | 4% |
   | status-phase | at what lifecycle stage? | 3% |
   | regulatory-status / audience | legal status? for whom? | 4% |

   Dimensions combine as an **independent cube, never a hierarchy** — top pairs
   are method×tenure and method×kind; same-archetype pairs are rare (PM4).
4. **Vocabularies** — each dimension draws options from a list that is
   conceptually *shared*, not per-measure: tenant-wide house lists (ownership,
   action verbs) pasted by hand onto up to 11 measures, or external standards
   (conservation-practice codes, species lists, administrative units) hand-copied
   with observed typo drift that silently splits roll-up buckets (PM5, PM6).
   Median list: 4 options; 41% end in an `Unspecified`/`Other` escape valve
   because entry forces a choice (PM7).

## What the old machinery gets wrong

- **Forced dimensions manufacture filler.** 20% of all subcategory rows across
  all five tenants are a literal `Default/Default` — created only because
  reporting requires a subcategory option (PM2).
- **Per-measure options are a copy-drift machine.** The same conceptual list
  exists as many hand-pasted copies, and the copies diverge by typo (PM5).
- **One unit per measure clones concepts** into suffix-named families (PM8).
- **Non-measurements get shoehorned in** (PM9): workflow state as a measure;
  per-project tags as "# of projects" measures whose value can only be 1;
  measurement provenance (accounting method, model used) as a breakdown axis;
  binned numerics ("0–10 m") as options.

## The model

```
Theme (standard library, ~15)
  └─ ResultConcept                    [tenant selects/extends from library]
       └─ Aspect (1..n)               unit + precision + counting rule
            ─ tagged by ─ Dimension (0..n, ordered, OPTIONAL at entry)
                            archetype: one of ~10
                            vocabulary → Vocabulary (tenant-level or imported
                                          standard; shared across concepts;
                                          referenced, never copied)

ReportedResult = (project, period, concept, aspect, value, {dimension→option}*)
```

Rules the evidence supports:

1. **Dimensions are optional, never filler.** No `Default/Default` artifact; no
   forced escape-valve options — an untagged value is simply untagged. (Held
   directional pending usage data: if optional tagging collapses to zero tagging,
   the answer is cheaper tagging — derived dimensions — not forcing.)
2. **Vocabularies are first-class and shared.** Defined once per tenant or
   imported from a standard; referenced by concepts. Kills copy drift and makes
   cross-measure rollups by ownership/geography possible at all.
3. **Concepts own multiple aspects.** "(area)/(length)" clone families become
   one concept with two aspects.
4. **Evict the non-measurements.** Workflow state → project attributes;
   tag-measures → project classifications, aggregated by counting projects;
   measurement protocol → provenance metadata on the reported value; banded
   numerics → numeric attributes, bandable at display time.
5. **Value kinds beyond raw magnitude are real** (indices, rates, percentages
   were smuggled into option labels because a value is a bare float). v1 ships
   magnitude; the aspect is where a value-kind would be declared.

## What this prototype adds beyond the evidence

The observed catalogs are 100% hand-reported. This prototype also models
**derived dimensions** — axes answered by a map layer, the project record, or
entry history rather than by a person. They are the complement to rule 1: the
system tags what it already knows; humans are asked only what only humans know.
That is the design answer to the tension between optional tagging and the asset
side of the product (see the brief's §0) — make tagging cheap before making it
optional.

Two deliberate deviations, argued in the data module where they bite:
- **`kind` (output/outcome) is kept.** The grammar is output-shaped ("we
  accomplished"); the exports lacked the action/outcome field, so outcomes are a
  blind spot, not a refutation. An outcome reads "we measured", has no actor,
  and constrains counting rules.
- **The counting rule lives on the aspect.** Absent from the evidence's model
  (no actuals), but it is the trust mechanism — sum vs union is the difference
  between effort delivered and ground in a condition — and it is per-aspect
  because an area can union where a count can only sum.

## Consequences already taken in this spoke

- The **primary-subcategory slot is retired** — the concept absorbs the job the
  primary was doing, and a forced slot is PM2's filler machine.
- Measure options are **references to shared vocabularies**; authoring a list
  from scratch is the "create a new vocabulary" path, not the default.
- Measure creation is **library-first** (~15 themes → concept → prefilled
  aspects and suggested dimensions), with "start from scratch" as the escape.
- The setup page is built on **claim → editable reporter form → answerability**
  (see the brief's "Author the artifact, not its settings").
