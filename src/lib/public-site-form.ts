// The controls of Workspace settings › Public site, bound to the draft.
//
// ONE DRAFT, MANY CONTROLS. Every part of the settings (Home page, Navigation,
// Theme, Footer, Site details) edits the same draft, so the binding lives here
// once: a control names the setting it holds (`data-bind="theme.fonts"`), is
// given the stored value once its lego is defined, and writes the draft on
// every change. The preview beside it follows through the storage event.
//
// Each control commits on change; there is no Save. What the PUBLIC sees
// changes only on Publish (src/lib/public-site-store.ts).

import { getAt, setAt } from './public-site-config';
import type { PublicSiteConfig, PublicSiteDefaults, SiteLink } from './public-site-config';
import { imageToDataUrl, readDefaults, readDraft, writeDraft } from './public-site-store';

export const defaults = readDefaults() as PublicSiteDefaults;
/** The draft this screen is editing. Mutated in place, then `commit()`. */
export const config: PublicSiteConfig = defaults ? readDraft(defaults.config) : ({} as PublicSiteConfig);

type Toasts = HTMLElement & { show(o: { message: string; variant?: string }): void };

export const toast = (message: string, variant = 'success'): void => {
  void customElements.whenDefined('esa-snackbar-container').then(() => {
    document.querySelector<Toasts>('[data-public-site-toasts]')?.show({ message, variant });
  });
};

export const commit = (): void => {
  if (!writeDraft(config)) toast('This browser is out of storage. Remove an image and try again.', 'error');
};

export const read = (path: string): unknown => getAt(config, path);
export const write = (path: string, value: unknown): void => {
  setAt(config, path, value);
  commit();
};

type Control = HTMLElement & { value?: string; checked?: boolean };

const isSwitch = (el: Element): boolean => el.localName === 'esa-switch-toggle';

/**
 * Bind every `[data-bind]` control under `scope`. `prefix` is put before each
 * control's path, so one panel of controls can edit whichever block is open
 * (`home.blocks.text-2.`); binding again re-points the same controls.
 */
export const bind = (scope: ParentNode, prefix = ''): void => {
  // A `data-bind-scope` panel is bound on its own, with its own prefix; a wider
  // bind passes over it.
  const mine = (el: Element): boolean => {
    const owner = el.closest('[data-bind-scope]');
    return !owner || owner === scope;
  };
  scope.querySelectorAll<Control>('[data-bind]').forEach((el) => {
    if (!mine(el)) return;
    const path = prefix + el.dataset.bind!;
    el.dataset.bindPath = path;
    // Assigned only after define: a value set on a not-yet-upgraded element
    // becomes an own property that shadows the lego's setter for good.
    void customElements.whenDefined(el.localName).then(() => {
      const stored = getAt(config, path);
      if (isSwitch(el)) el.checked = Boolean(stored);
      else el.value = String(stored ?? '');
    });
    if (el.dataset.bound !== undefined) return;
    el.dataset.bound = '';
    el.addEventListener('change', (event) => {
      if (event.target !== el) return;
      write(el.dataset.bindPath!, isSwitch(el) ? Boolean(el.checked) : String(el.value ?? ''));
    });
  });

  // A switch that stands for one entry's presence in a list: on means the
  // entry is NOT in it (the Pages menu's hidden pages).
  scope.querySelectorAll<Control>('[data-bind-absent]').forEach((el) => {
    const path = el.dataset.bindAbsent!;
    const entry = el.dataset.entry!;
    const list = (): string[] => (getAt(config, path) as string[] | undefined) ?? [];
    void customElements.whenDefined(el.localName).then(() => (el.checked = !list().includes(entry)));
    if (el.dataset.bound !== undefined) return;
    el.dataset.bound = '';
    el.addEventListener('change', () => write(path, el.checked ? list().filter((v) => v !== entry) : [...new Set([...list(), entry])]));
  });

  bindImages(scope, prefix, mine);
};

/** Each switch's hint, as its accessible description (the lego has no description prop: esassoc/ecology#40). */
export const describeSwitches = (scope: ParentNode): void => {
  void customElements.whenDefined('esa-switch-toggle').then(() => {
    scope.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>('esa-switch-toggle[data-hint]').forEach(async (el) => {
      await el.updateComplete;
      el.shadowRoot?.querySelector('[role="switch"]')?.setAttribute('aria-description', el.dataset.hint ?? '');
    });
  });
};

// ---------------------------------------------------------------------------
// Images (firma2-site-image)
// ---------------------------------------------------------------------------

const bindImages = (scope: ParentNode, prefix: string, mine: (el: Element) => boolean): void => {
  scope.querySelectorAll<HTMLElement>('[data-image-bind]').forEach((host) => {
    if (!mine(host)) return;
    const path = prefix + host.dataset.imageBind!;
    host.dataset.imagePath = path;
    const shown = host.querySelector<HTMLImageElement>('[data-image-shown]')!;
    const remove = host.querySelector<HTMLElement>('[data-image-remove]')!;
    const paint = (): void => {
      const stored = String(getAt(config, host.dataset.imagePath!) ?? '');
      shown.hidden = !stored;
      remove.hidden = !stored;
      if (stored) shown.src = stored;
      else shown.removeAttribute('src');
    };
    paint();
    if (host.dataset.bound !== undefined) return;
    host.dataset.bound = '';
    host.addEventListener('change', async (event) => {
      const file = (event as CustomEvent<{ files?: File[] }>).detail?.files?.[0];
      if (!file) return;
      try {
        const type = host.dataset.imageType === 'png' ? 'image/png' : 'image/jpeg';
        write(host.dataset.imagePath!, await imageToDataUrl(file, Number(host.dataset.imageMax ?? 1200), type));
        paint();
      } catch {
        toast('That file is not an image this browser can read.', 'error');
      }
    });
    remove.addEventListener('click', () => {
      write(host.dataset.imagePath!, '');
      paint();
    });
  });
};

// ---------------------------------------------------------------------------
// Link lists (firma2-site-links)
// ---------------------------------------------------------------------------

export const bindLinkLists = (scope: ParentNode): void => {
  scope.querySelectorAll<HTMLElement>('[data-link-list]').forEach((host) => {
    const path = host.dataset.linkList!;
    const rows = host.querySelector<HTMLElement>('[data-link-rows]')!;
    const template = host.querySelector<HTMLTemplateElement>('template[data-link-row]')!;
    const links = (): SiteLink[] => (getAt(config, path) as SiteLink[] | undefined) ?? [];

    const paint = (focus?: number): void => {
      rows.replaceChildren(
        ...links().map((link, i) => {
          const row = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
          (['label', 'href'] as const).forEach((field) => {
            const input = row.querySelector<Control>(`[data-link-field="${field}"]`)!;
            void customElements.whenDefined(input.localName).then(() => (input.value = link[field]));
            input.addEventListener('change', () => {
              const next = links();
              next[i] = { ...next[i], [field]: String(input.value ?? '') };
              write(path, next);
            });
          });
          const remove = row.querySelector<HTMLElement>('[data-link-remove] button, [data-link-remove]')!;
          remove.setAttribute('aria-label', `Remove ${link.label || 'link'}`);
          remove.addEventListener('click', () => {
            write(path, links().filter((_, at) => at !== i));
            paint();
            host.querySelector<HTMLElement>('[data-link-add]')?.focus();
          });
          return row;
        }),
      );
      if (focus !== undefined) requestAnimationFrame(() => (rows.children[focus]?.querySelector('[data-link-field="label"]') as HTMLElement | null)?.focus());
    };

    host.querySelector('[data-link-add]')?.addEventListener('click', () => {
      write(path, [...links(), { label: '', href: '' }]);
      paint(links().length - 1);
    });
    paint();
  });
};
