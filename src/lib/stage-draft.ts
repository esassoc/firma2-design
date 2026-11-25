// Browser-local edits to the workspace's stages — same honesty terms as every
// other draft store in this prototype (src/lib/measure-draft.ts):
// localStorage, one browser, no backend.
//
// THE WHOLE LIST, NOT PATCHES. Stages are one short ordered list, and order is
// most of what an edit changes. The versioned key is the escape hatch if the
// seed changes shape.

import { stageSettings } from '../data/firma2-workspace-settings';
import type { StageSetting } from '../data/firma2-workspace-settings';

// v4: icons are Hugeicons export names with their markup (v3 held registry
// names, v2 an older icon set, v1 a pill ramp name).
const KEY = 'firma2:stages:v4';

export const readStages = (): StageSetting[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StageSetting[];
  } catch {
    // Blocked or corrupt storage falls back to the seed.
  }
  return stageSettings.map((s) => ({ ...s }));
};

export const writeStages = (stages: StageSetting[]): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(stages));
  } catch {
    // Unsaved in this browser; the page still shows the change.
  }
};
