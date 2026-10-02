# Field patterns — record vs form

This app has two ways to show an editable value. They look different on purpose.
This note covers how each one works, how the code tells them apart, and how to
pick one.

The principle behind them is in `product-brief.md` §4, "A record reads first; a
form shows its boxes". This file is the working reference.

## The two patterns

| | Record | Form |
|---|---|---|
| **Use it for** | A page people mostly read and sometimes correct | A page whose only job is to be filled in |
| **Examples** | Project detail (Key facts, page title), organization record | Settings › Account, Workspace settings › General, the type studio's "New field" sheet |
| **Component** | `firma2-editable-field` (spoke component, `src/components/shared/`) | `esa-text-field` / `esa-select` / `esa-textarea` used directly |
| **At rest** | Value in a borderless box with no visible field edge | Label above, border always visible, value already in the input |
| **On hover/focus** | The outline appears | Border darkens (the component's own hover state) |
| **To edit** | Click (or Enter) swaps in the real input. The box stays the same size. | Type straight into it |
| **Saving** | Leaving the field saves it. Escape cancels. | Values stay in the page. There's no backend and no Save button. |

Both follow the brief's "always editable, always saved" stance. The difference
is how much of the field shows at rest, not how it saves.

## How the system tells them apart

**It doesn't, in code.** There's no `mode` prop, variant or flag. The
difference is entirely **which component the author uses**:

- **Record**: `firma2-editable-field` draws its own display state. That's a
  `<button>` built to match the input's exact size (40px tall, same padding and
  radius) with no border. Its CSS adds the outline on hover/focus, and its
  script swaps in the real input on click.
- **Form**: the design system's own controls with their default styling. They
  draw a 1px border at rest (`--form-border-color`), so a form needs nothing
  extra.

Both use `size="md"`, the one control size this app uses, and both render at
the same 40px height (AppLayout's `CONTROL_PINS` fixes the controls at 40px).

So the guard is convention: this doc, the product brief and code review. Nothing
in the build stops `firma2-editable-field` from landing in a settings form, or a
bare input from landing on a record page.

## How to choose

Ask: **did the reader come here to read, or to fill something in?**

- Read, then sometimes correct → **record**. A border on every value would make
  a page you read look like a page you have to fill in.
- Came to change something → **form**. Hiding the box makes people hunt for
  the input.

When unsure, look at the nearest similar page and match it (brief §4, "The
sibling record page is the spec").

## Building a form field

```astro
<div class="stack" data-gap="md">
  <esa-text-field name="email" label="Email" value={account.email}
    size="md" type="email" autocomplete="email" required></esa-text-field>
  <esa-select name="fiscalYearStart" label="Fiscal year starts in" size="md"
    options={JSON.stringify(MONTHS.map((m) => ({ value: m, label: m })))}
    data-seed={ws.fiscalYearStart}></esa-select>
</div>

<script>
  import '@esa/ecology/esa-text-field';
  import '@esa/ecology/esa-select';

  // esa-select only accepts its value through JavaScript (there is no `value`
  // attribute), and only after the element is defined. Setting it earlier
  // creates a property that permanently blocks the component's own setter.
  customElements.whenDefined('esa-select').then(() => {
    document.querySelectorAll('esa-select[data-seed]').forEach((el) => {
      el.value = el.dataset.seed ?? '';
    });
  });
</script>
```

Reference: `src/components/settings/firma2-workspace-general.astro`.

## Building a record field

```astro
<dl class="stack" data-gap="md">
  <Firma2EditableField field="leadOrganization" label="Lead organization" value={…} />
  <Firma2EditableField field="program" label="Program" value={…}
    control="select" options={programs} />
</dl>
```

See the header comment in `firma2-editable-field.astro` for the full contract
(controls, formats, `href`, `placeholder`, the page-title shape).

## Where each pattern is used today

- **Record:** `firma2-project-facts`, `firma2-page-header` (editable title),
  `firma2-project-contacts`, `firma2-project-map`, `firma2-project-peek`,
  `firma2-prose-field`, `firma2-organization-record`
- **Form:** `firma2-settings-account`, `firma2-workspace-general`,
  `firma2-type-studio` (New field sheet)

## If we want the system to enforce it

Two options, neither built yet:

1. **A prop:** `presentation="record" | "form"` on `firma2-editable-field`.
   The choice would show in the markup, but form mode would rebuild what the
   design-system controls already do, inside a ~1,700-line component.
2. **A lint/review rule (recommended):** flag `firma2-editable-field` under
   `src/components/settings/` unless the file is a record page (e.g.
   `firma2-organization-record`). It's cheap and keeps the two paths separate.
   The risk worth guarding against is picking the wrong component, not missing
   a feature.
