// Squarified treemap (Bruls, Huizing & van Wijk): rectangles whose AREAS are
// proportional to their values, kept as near to square as the set allows.
// Pure and build-time — give it values and the box's aspect ratio, get back
// each rectangle as fractions (0–1) of the box, in the order given.
//
// Values should arrive largest first; the algorithm fills from the top-left.
export interface TreemapRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const treemap = (values: number[], aspect: number): TreemapRect[] => {
  const total = values.reduce((sum, v) => sum + v, 0);
  if (total <= 0) return values.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));
  // Work in a box `aspect` wide and 1 tall; areas sum to its area.
  const areas = values.map((v) => (v / total) * aspect);
  const out: TreemapRect[] = [];
  let x = 0;
  let y = 0;
  let w = aspect;
  let h = 1;
  let i = 0;

  const worst = (row: number[], side: number) => {
    const sum = row.reduce((s, a) => s + a, 0);
    const max = Math.max(...row);
    const min = Math.min(...row);
    return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
  };

  while (i < areas.length) {
    const side = Math.min(w, h);
    const row = [areas[i]];
    let next = i + 1;
    while (next < areas.length && worst([...row, areas[next]], side) <= worst(row, side)) {
      row.push(areas[next]);
      next += 1;
    }
    const sum = row.reduce((s, a) => s + a, 0);
    if (w >= h) {
      // A column down the leading edge.
      const rw = sum / h;
      let cy = y;
      for (const a of row) {
        out.push({ x, y: cy, w: rw, h: a / rw });
        cy += a / rw;
      }
      x += rw;
      w -= rw;
    } else {
      // A strip across the top.
      const rh = sum / w;
      let cx = x;
      for (const a of row) {
        out.push({ x: cx, y, w: a / rh, h: rh });
        cx += a / rh;
      }
      y += rh;
      h -= rh;
    }
    i = next;
  }
  return out.map((r) => ({ x: r.x / aspect, y: r.y, w: r.w / aspect, h: r.h }));
};
