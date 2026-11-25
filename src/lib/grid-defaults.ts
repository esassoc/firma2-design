// Browser-local grid defaults — the workspace's (Workspace settings › Grid
// defaults) and each person's own (Settings › Preferences) — and applying
// them to a live AG Grid. Same honesty terms as every other draft store here:
// localStorage, one browser, so "each person" is this browser.
//
// A grid applies its default once it is built, and again whenever the
// default changes in another window — which is how the settings screen's
// preview (the grid's own page, in a frame) follows along.

import type { GridApi } from 'ag-grid-community';
import { getGrid, resolveLayered } from '../data/firma2-grid-defaults';
import type { ColumnsDelta } from '../data/firma2-grid-defaults';

const KEY_PREFIX = 'firma2:grid-default:v1:';
const PERSONAL_PREFIX = 'firma2:grid-personal:v1:';

const readDelta = (key: string): ColumnsDelta => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeDelta = (key: string, delta: ColumnsDelta | null): boolean => {
  try {
    if (delta) localStorage.setItem(key, JSON.stringify(delta));
    else localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

/** The workspace's default for a grid. */
export const readGridDefault = (gridKey: string): ColumnsDelta => readDelta(KEY_PREFIX + gridKey);
export const writeGridDefault = (gridKey: string, delta: ColumnsDelta | null): boolean => writeDelta(KEY_PREFIX + gridKey, delta);

/** This person's own columns for a grid; null clears back to the workspace's. */
export const readGridPersonal = (gridKey: string): ColumnsDelta => readDelta(PERSONAL_PREFIX + gridKey);
export const writeGridPersonal = (gridKey: string, delta: ColumnsDelta | null): boolean => writeDelta(PERSONAL_PREFIX + gridKey, delta);

export const applyGridDefault = (gridApi: GridApi, gridKey: string): void => {
  const grid = getGrid(gridKey);
  if (!grid) return;
  const state = resolveLayered(grid, readGridDefault(gridKey), readGridPersonal(gridKey)).map(({ column, visible }) => ({
    colId: column.key,
    hide: !visible,
  }));
  gridApi.applyColumnState({ state, applyOrder: true });
};

/** Apply now and follow changes made in other windows. */
export const watchGridDefault = (gridApi: GridApi, gridKey: string): void => {
  applyGridDefault(gridApi, gridKey);
  window.addEventListener('storage', (event) => {
    if (event.key === KEY_PREFIX + gridKey || event.key === PERSONAL_PREFIX + gridKey) applyGridDefault(gridApi, gridKey);
  });
};
