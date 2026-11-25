// The mechanics every peek shares — firma2-project-peek's construction, lifted
// when the classifications board got a peek of its own (user, 2026-10-21), so
// the two cannot drift the way the rails once did (firma2-rail's header).
//
// A peek is a closes-mode firma2-rail holding one server-rendered <template>
// per record. Anything carrying the trigger attribute opens it on that
// record's slug: the template is cloned ONCE and kept, so an edit made in the
// panel survives closing it as long as an edit on the page would. The caller
// paints its own header from the template's data; this does the rest —
// opening and closing the rail, the hydrate/map seams once it has landed,
// scroll to top, focus on the name and back to the opener, and Escape.

export interface RecordPeekOptions {
  /** The attribute triggers carry, holding the slug: `data-open-project`. */
  trigger: string;
  /** The attribute each record's template carries, holding the slug: `data-project-peek`. */
  template: string;
  /** Paints the header for a record. Runs before the rail opens. */
  paint: (template: HTMLTemplateElement, slug: string) => void;
}

export interface RecordPeek {
  /** The open record's template, or null before the first open. */
  current: () => HTMLTemplateElement | null;
}

export const initRecordPeek = (panel: HTMLElement, options: RecordPeekOptions): RecordPeek | null => {
  const inner = panel.querySelector<HTMLElement>('.firma2-rail__inner');
  const host = panel.querySelector<HTMLElement>('[data-peek-record-host]');
  const door = panel.querySelector<HTMLAnchorElement>('[data-peek-door]');
  if (!inner || !host || !door) return null;

  const clones = new Map<string, HTMLElement>();
  let current: HTMLTemplateElement | null = null;
  /** Where focus goes back when the panel closes — the button that opened it,
   *  which is how a non-modal panel avoids dropping a keyboard reader at <body>. */
  let opener: HTMLElement | null = null;

  const open = (slug: string, trigger: HTMLElement): void => {
    const template = panel.querySelector<HTMLTemplateElement>(`template[${options.template}="${CSS.escape(slug)}"]`);
    if (!template) return;
    current = template;
    options.paint(template, slug);
    let record = clones.get(slug);
    if (!record) {
      record = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
      clones.set(slug, record);
    }
    host.replaceChildren(record);
    opener = trigger;
    // firma2-rail eases the track open (from out of the page, or at once if
    // it is already open) and fires rail-opened when the content is laid out.
    panel.dispatchEvent(new CustomEvent('firma2:rail-open'));
  };

  panel.addEventListener('firma2:rail-opened', (event) => {
    if (event.target !== panel) return;
    // Announce the (now laid-out) subtree to the modules whose load-time
    // sweeps never saw inside the template. Both seams are idempotent.
    const record = host.firstElementChild;
    record?.dispatchEvent(new CustomEvent('firma2:field-hydrate', { bubbles: true }));
    record?.dispatchEvent(new CustomEvent('firma2:map-init', { bubbles: true }));
    inner.scrollTo(0, 0);
    // Focus lands on the name, which announces which record just opened.
    door.focus();
  });

  panel.addEventListener('firma2:rail-closed', (event) => {
    if (event.target !== panel) return;
    // The stored trigger is the wrapper span; the tab stop is the control
    // inside it. isConnected: a repainted row leaves a detached node, and
    // focusing one silently does nothing while LOOKING like a focus return.
    if (opener?.isConnected) (opener.querySelector<HTMLElement>('button, a') ?? opener).focus();
  });

  // Capture phase, so a grid cell or card never also acts on the click.
  document.addEventListener(
    'click',
    (event) => {
      const trigger = (event.target as Element).closest<HTMLElement>(`[${options.trigger}]`);
      const slug = trigger?.getAttribute(options.trigger);
      if (trigger && slug) open(slug, trigger);
    },
    true,
  );

  // ESCAPE'S LADDER, bottom rung: an open field consumed the key already, an
  // open menu preventDefaulted it — a plain Escape that reaches here closes
  // the panel. On the panel, not the document: Escape elsewhere is not ours.
  panel.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    panel.dispatchEvent(new CustomEvent('firma2:rail-close'));
  });

  return { current: () => current };
};
