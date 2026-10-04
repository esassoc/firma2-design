// bcn-progress-ring's stagger, loaded once per page by AppLayout.
//
// NOT IN THE COMPONENT'S OWN <script>: Astro writes a component's script
// where the component first renders, and on a page with the project side
// panel that is inside the panel's <template>s — where a script never runs.
//
// THE STAGGER. Rings that appear together — a list's rows, a page's tiles,
// a repainted table — start one after another, 70ms apart, and no ring
// waits more than 350ms however long its list: a cascade, not a queue.
// A group is the nearest list, table or section, so two sections each start
// from zero. Rings added later (cloned rows, the side panel) are staggered
// among themselves as they arrive. A MutationObserver callback runs before
// the next paint, so a ring never draws once and then restarts.
const STEP = 70;
const MAX = 350;
const seen = new WeakSet<Element>();

const stagger = (rings: Element[]) => {
  const counts = new Map<Element | null, number>();
  for (const ring of rings) {
    if (seen.has(ring)) continue;
    seen.add(ring);
    const group = ring.closest('ul, ol, table, section, aside');
    const i = counts.get(group) ?? 0;
    counts.set(group, i + 1);
    (ring as SVGElement).style.setProperty('--_ring-stagger', `${Math.min(i * STEP, MAX)}ms`);
  }
};

stagger([...document.querySelectorAll('.bcn-progress-ring')]);
new MutationObserver((records) => {
  const added: Element[] = [];
  for (const r of records)
    r.addedNodes.forEach((n) => {
      if (!(n instanceof Element)) return;
      if (n.matches('.bcn-progress-ring')) added.push(n);
      added.push(...n.querySelectorAll('.bcn-progress-ring'));
    });
  if (added.length) stagger(added);
}).observe(document.body, { childList: true, subtree: true });
