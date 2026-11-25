// Picking from a closed list — the three helps a picker gets from the list it
// picks from (src/lib/vocabulary-guidance.ts), wired onto an esa-* choice
// control already on the page:
//
//   GUIDANCE      the chosen entry's line, as the control's own helper text,
//                 kept in step with every change.
//   USED HERE     on a long list, a two-segment esa-button-toggle — "Used here
//                 (3)" / "All (16)" — narrowing the control's options to the
//                 entries this workspace's projects hold. On by default when
//                 the current answer is among them; the list itself never forks.
//   HELP ME CHOOSE  on a list that carries a path, a ghost button that opens a
//                 few plain questions inline under the control; the last answer
//                 picks the entry, as if the reader had clicked it.
//
// The control stays the question: label, required, errors and its `change`
// are the lego's. Everything here is added after it, in one row of tools and
// one panel, so a reader who needs none of it reads past one line.
//
// Runtime markup, so the buttons are clones of EsaButton templates the caller
// owns (an .astro lego cannot be built from JS); the toggle and the questions
// are Lit legos (esa-button-toggle, esa-radio-group), built here.

import { announce } from '@esa/ecology/announcer';
import { LONG_LIST, chooserFor, guidanceFor, listEntries, livePath, usedCounts, type ListId } from './vocabulary-guidance';
import type { ChooserStep } from '../data/firma2-project-types';

type Control = HTMLElement & { value?: unknown; options?: { label: string; value: string }[]; helpText?: string };

export interface PickerOptions {
  /** The list this control picks from. */
  list: ListId;
  /** The question's own help text, kept ahead of the guidance. */
  help?: string;
  /** A fresh EsaButton clone with this label. */
  button: (label: string) => HTMLElement;
  /** Remembered per control across repaints: whether "Used here" is on. */
  state?: Map<string, boolean>;
}

const native = (wrap: HTMLElement) => wrap.querySelector<HTMLButtonElement>('button') ?? (wrap as HTMLButtonElement);

/** Wire guidance, "Used here" and "Help me choose" onto one choice control. */
export const enhancePicker = async (control: Control, opts: PickerOptions): Promise<void> => {
  if (control.dataset.pickerWired) return;
  control.dataset.pickerWired = '';
  await customElements.whenDefined(control.localName);

  const all = listEntries(opts.list).map((e) => e.name);
  const paintGuidance = () => {
    const guidance = guidanceFor(opts.list, control.value);
    control.helpText = [opts.help, guidance].filter(Boolean).join(' ');
  };
  paintGuidance();
  control.addEventListener('change', paintGuidance);

  // Only a single-answer list in its own options takes the rest.
  const offered = (control.options ?? []).map((o) => o.value);
  if (!offered.length || Array.isArray(control.value)) return;

  const tools = document.createElement('div');
  tools.className = 'vocabulary-picker__tools cluster';
  tools.dataset.gap = 'sm';
  const panel = document.createElement('div');
  panel.className = 'vocabulary-picker__chooser stack';
  panel.dataset.gap = 'md';
  panel.hidden = true;

  // ---- used here -----------------------------------------------------------
  const counts = usedCounts(opts.list);
  const used = offered.filter((n) => counts.has(n));
  const stateKey = control.dataset.answer ?? opts.list;
  let toggle: Control | null = null;
  const applyFilter = (on: boolean) => {
    const keep = control.value;
    const names = on ? offered.filter((n) => counts.has(n) || n === keep) : offered;
    control.options = names.map((n) => ({ label: n, value: n }));
    if (keep != null) control.value = keep;
    opts.state?.set(stateKey, on);
  };
  if (offered.length >= LONG_LIST && used.length > 0 && used.length < offered.length) {
    toggle = document.createElement('esa-button-toggle') as Control;
    toggle.setAttribute('size', 'md');
    toggle.setAttribute('aria-label', 'Which choices to show');
    const current = String(control.value ?? '');
    const on = opts.state?.get(stateKey) ?? (!current || counts.has(current));
    void customElements.whenDefined('esa-button-toggle').then(() => {
      toggle!.options = [
        { value: 'used', label: `Used here (${used.length})` },
        { value: 'all', label: `All (${offered.length})` },
      ];
      toggle!.value = on ? 'used' : 'all';
    });
    toggle.addEventListener('change', (e) => {
      e.stopPropagation();
      applyFilter(toggle!.value === 'used');
    });
    applyFilter(on);
    tools.append(toggle);
  }

  // ---- help me choose --------------------------------------------------------
  const path = (() => {
    const p = chooserFor(opts.list);
    return p ? livePath(p, all.filter((n) => offered.includes(n))) : undefined;
  })();
  if (path) {
    const open = opts.button('Help me choose');
    native(open).setAttribute('aria-expanded', 'false');
    const trail: ChooserStep[] = [];
    const close = (focusOpen = true) => {
      panel.hidden = true;
      panel.replaceChildren();
      native(open).setAttribute('aria-expanded', 'false');
      if (focusOpen) native(open).focus();
    };
    const pick = (name: string) => {
      if (toggle && !counts.has(name) && toggle.value === 'used') {
        toggle.value = 'all';
        applyFilter(false);
      }
      control.value = name;
      control.dispatchEvent(new Event('change', { bubbles: true }));
      close(false);
      control.focus();
      announce(`${name} chosen.`);
    };
    const ask = (step: ChooserStep) => {
      const question = document.createElement('esa-radio-group') as Control;
      question.setAttribute('label', step.question);
      question.setAttribute('size', 'md');
      void customElements.whenDefined('esa-radio-group').then(() => {
        question.options = step.answers.map((a, i) => ({ label: a.label, value: String(i) }));
      });
      question.addEventListener('change', (e) => {
        e.stopPropagation();
        const answer = step.answers[Number(question.value)];
        if (!answer) return;
        if (answer.pick) return pick(answer.pick);
        if (answer.next) {
          trail.push(step);
          ask(answer.next);
        }
      });
      const actions = document.createElement('div');
      actions.className = 'cluster';
      actions.dataset.gap = 'xs';
      if (trail.length) {
        const back = opts.button('Back');
        native(back).addEventListener('click', () => ask(trail.pop()!));
        actions.append(back);
      }
      const cancel = opts.button('Cancel');
      native(cancel).addEventListener('click', () => close());
      actions.append(cancel);
      panel.replaceChildren(question, actions);
      requestAnimationFrame(() => question.focus());
    };
    native(open).addEventListener('click', () => {
      if (!panel.hidden) return close();
      trail.length = 0;
      panel.hidden = false;
      native(open).setAttribute('aria-expanded', 'true');
      ask(path);
    });
    tools.append(open);
  }

  if (!tools.childElementCount) return;
  const host = control.closest<HTMLElement>('[data-block-id]') ?? control.parentElement!;
  host.append(tools, panel);
};
