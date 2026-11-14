// One question per Progress Dashboard tile. A dashboard holds several tiles,
// so each [data-tile] element owns a store; the figure inside it, the edit
// sheet and the dashboard's filter all reach it with storeFor().
import { normalize, type Dataset, type TileState } from './dashboard-model';

export const ds: Dataset = JSON.parse(document.getElementById('firma2-dashboard-data')?.textContent ?? '{"projects":[],"measures":[],"dimensions":[]}');

type Listener = (s: TileState) => void;

export interface Store {
  root: HTMLElement;
  get: () => TileState;
  set: (patch: Partial<TileState>) => void;
  /** Back to how the tile opens — a tile added again starts fresh. */
  reset: () => void;
  subscribe: (fn: Listener) => void;
}

const stores = new WeakMap<HTMLElement, Store>();

export const storeFor = (el: Element): Store => {
  const root = el.closest<HTMLElement>('[data-tile]')!;
  const known = stores.get(root);
  if (known) return known;

  // What the tile opens on is written on it (data-open), so the page decides.
  const opening = (): TileState =>
    normalize(ds, { measure: '', split: 'none', scope: 'all', from: 0, attribution: 'full', view: 'year', kind: 'chart', span: 0, height: 0, ...JSON.parse(root.dataset.open ?? '{}') });
  let state = opening();
  const listeners = new Set<Listener>();
  const emit = () => listeners.forEach((fn) => fn(state));

  const store: Store = {
    root,
    get: () => state,
    set: (patch) => {
      state = normalize(ds, { ...state, ...patch });
      emit();
    },
    reset: () => {
      state = opening();
      emit();
    },
    subscribe: (fn) => {
      listeners.add(fn);
      fn(state);
    },
  };
  stores.set(root, store);
  return store;
};
