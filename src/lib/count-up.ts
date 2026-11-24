// Count-up on hover — a figure runs from zero to its value while a fine
// pointer is on its host, and snaps back to the written value when it leaves.
//
// Mark the figure `data-count` and an ancestor `data-count-host`. The figure's
// own text is the truth: "13,067", "14.5", "$7.3M" and "52" are parsed into a
// prefix, a number (its decimals kept) and a suffix, so nothing is duplicated
// in attributes and the page reads the same with no script.
//
// Pointer only (touch fires hover on tap), and never under reduced motion.
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const still = matchMedia('(prefers-reduced-motion: reduce)');

export const countUpOnHover = (root: ParentNode = document, duration = 700): void => {
  root.querySelectorAll<HTMLElement>('[data-count-host]').forEach((host) => {
    if (host.dataset.countBound !== undefined) return;
    host.dataset.countBound = '';
    const figures = Array.from(host.querySelectorAll<HTMLElement>('[data-count]')).flatMap((el) => {
      const written = el.textContent ?? '';
      const match = written.match(/^(\D*)([\d,]+(?:\.(\d+))?)(\D*)$/);
      if (!match) return [];
      const [, prefix, digits, fraction = '', suffix] = match;
      const target = Number(digits.replace(/,/g, ''));
      const format = (n: number) =>
        prefix + n.toLocaleString('en-US', { minimumFractionDigits: fraction.length, maximumFractionDigits: fraction.length }) + suffix;
      return [{ el, written, target, format }];
    });
    if (!figures.length) return;
    let frame = 0;
    host.addEventListener('pointerenter', () => {
      if (!fine.matches || still.matches) return;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        figures.forEach((f) => (f.el.textContent = t < 1 ? f.format(f.target * eased) : f.written));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    });
    host.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      figures.forEach((f) => (f.el.textContent = f.written));
    });
  });
};
