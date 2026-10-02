// Browser-local grid defaults, and applying them to a live AG Grid. Same
// honesty terms as every other draft store here: localStorage, one browser.
//
// A grid applies its default once it is built, and again whenever the
// default changes in another window — which is how the settings screen's
// preview (the grid's own page, in a frame) follows along.

import type { GridApi } from 'ag-grid-community';
import { getGrid, resolveColumns } from '../data/firma2-grid-defaults';
import type { ColumnsDelta } from '../data/firma2-grid-defaults';

const KEY_PREFIX = 'firma2:grid-default:v1:';

export const readGridDefault = (gridKey: string): ColumnsDelta => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY_PREFIX + gridKey) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const writeGridDefault = (gridKey: string, delta: ColumnsDelta | null): boolean => {
  try {
    if (delta) localStorage.setItem(KEY_PREFIX + gridKey, JSON.stringify(delta));
    else localStorage.removeItem(KEY_PREFIX + gridKey);
    return true;
  } catch {
    return false;
  }
};

export const applyGridDefault = (gridApi: GridApi, gridKey: string): void => {
  const grid = getGrid(gridKey);
  if (!grid) return;
  const state = resolveColumns(grid, readGridDefault(gridKey)).map(({ column, visible }) => ({
    colId: column.key,
    hide: !visible,
  }));
  gridApi.applyColumnState({ state, applyOrder: true });
};

/** Apply now and follow changes made in other windows. */
export const watchGridDefault = (gridApi: GridApi, gridKey: string): void => {
  applyGridDefault(gridApi, gridKey);
  window.addEventListener('storage', (event) => {
    if (event.key === KEY_PREFIX + gridKey) applyGridDefault(gridApi, gridKey);
  });
};
