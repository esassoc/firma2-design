// The behaviour behind firma2-gis-subscription-steps — every field of a GIS
// subscription's setup, wired once. Two hosts mount it: the side sheet that
// edits a saved subscription (onChange saves) and the wizard that adds one
// (onChange keeps the draft). Neither host touches a field directly.
//
// What lives here rather than in a host is everything a subscription's
// correctness depends on: the GlobalID/OBJECTID join warning, the plumbing
// filter on extra fields, the nominated-but-missing field kept and marked,
// and choosing a layer filling in what ArcGIS already knows.

import '@esa/ecology/esa-radio-group';
import '@esa/ecology/esa-select';
import '@esa/ecology/esa-text-field';
import '@esa/ecology/esa-switch-toggle';
import type { SharedLayer, Subscription, SubscriptionStep } from '../data/firma2-geography';

type Control = HTMLElement & { value?: unknown; options?: unknown; errorText?: string; helpText?: string; checked?: boolean; disabled?: boolean };

export interface EditorConfig {
  layers: SharedLayer[];
  group: { id: string; title: string };
  mappable: { value: string; label: string }[];
  projectTypes: string[];
  stages: string[];
}

export interface SubscriptionEditor {
  readonly config: EditorConfig;
  /** The subscription as the fields currently describe it. */
  readonly draft: Subscription;
  /** Fill every field from `draft`. Resolves once the legos are defined and painted. */
  load: (draft: Subscription) => Promise<void>;
  /** Mark what `step` is missing. True when it has everything it needs. */
  check: (step: SubscriptionStep) => boolean;
}

const PLUMBING = ['OID', 'GlobalID'];
const LEGOS = ['esa-select', 'esa-radio-group', 'esa-text-field', 'esa-switch-toggle'];
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export const blankSubscription = (config: EditorConfig): Subscription => ({
  id: `sub-${Date.now().toString(36)}`,
  name: '',
  access: 'arcgis',
  layerId: '',
  url: '',
  joinField: '',
  featureIdField: '',
  labelField: '',
  extraFields: [],
  nameField: '',
  defaultLead: '',
  defaultProjectType: config.projectTypes[0],
  defaultStage: 'Planning & Design',
  mappings: [],
  active: true,
  projectCount: 0,
  workAreaCount: 0,
  lastSuccess: null,
  lastMessage: null,
});

export const mountSubscriptionEditor = (root: HTMLElement, onChange: (draft: Subscription) => void): SubscriptionEditor => {
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const config: EditorConfig = JSON.parse(root.dataset.config ?? '{}');
  const clone = (name: string) => ($<HTMLTemplateElement>(`[data-tpl-${name}]`).content.firstElementChild as HTMLElement).cloneNode(true) as HTMLElement;
  const layerById = (id: string) => config.layers.find((l) => l.id === id);
  const defined = Promise.all(LEGOS.map((t) => customElements.whenDefined(t)));

  const f = {
    access: $<Control>('[data-access]'),
    layer: $<Control>('[data-layer]'),
    url: $<Control>('[data-url]'),
    join: $<Control>('[data-join]'),
    featureId: $<Control>('[data-feature-id]'),
    label: $<Control>('[data-label-field]'),
    extra: $<Control>('[data-extra]'),
    nameField: $<Control>('[data-name-field]'),
    projectType: $<Control>('[data-default-project-type]'),
    stage: $<Control>('[data-default-stage]'),
    lead: $<Control>('[data-default-lead]'),
    addMapping: $<Control>('[data-add-mapping]'),
    name: $<Control>('[data-name]'),
    active: $<Control>('[data-active]'),
  };

  let draft = blankSubscription(config);
  const change = (next: Subscription) => {
    draft = next;
    onChange(draft);
  };

  const fieldOptions = (layer: SharedLayer | undefined, includePlumbing = true) =>
    (layer?.fields ?? [])
      .filter((field) => includePlumbing || (!PLUMBING.includes(field.type) && !field.name.startsWith('Shape__')))
      .map((field) => ({ value: field.name, label: field.alias ? `${field.name} — ${field.alias}` : field.name }));

  const paintSchema = () => {
    const layer = layerById(draft.layerId);
    $('[data-schema]').hidden = !layer;
    root.querySelectorAll<HTMLElement>('[data-unlocked]').forEach((el) => (el.hidden = !layer));
    $('[data-locked]').hidden = Boolean(layer);
    if (!layer) return;
    $('[data-schema-name]').textContent = layer.name;
    const geometry = clone('badge-geometry');
    geometry.querySelector('.esa-badge__text')!.textContent = layer.geometry;
    $('[data-schema-geometry]').replaceChildren(geometry);
    $('[data-schema-count]').textContent = `${layer.fields.length} fields`;
    $('[data-schema-rows]').replaceChildren(
      ...layer.fields.map((field) => {
        const tr = document.createElement('tr');
        const roles = [
          field.name === layer.globalIdField && 'global ID',
          field.name === layer.objectIdField && 'object ID',
          field.name === layer.displayField && 'display',
        ].filter(Boolean) as string[];
        const cell = document.createElement('td');
        cell.innerHTML = `<span class="firma2-gis-steps__field typography-body-sm"><code>${esc(field.name)}</code>${field.alias && field.alias !== field.name ? `<span class="firma2-gis-steps__muted">${esc(field.alias)}</span>` : ''}</span>`;
        roles.forEach((role) => {
          const badge = clone('badge-role');
          badge.querySelector('.esa-badge__text')!.textContent = role;
          cell.firstElementChild!.append(badge);
        });
        const type = document.createElement('td');
        type.className = 'typography-body-sm';
        type.textContent = field.type;
        tr.append(cell, type);
        return tr;
      }),
    );

    // Three of the four pickers offer every field; the extra-fields list
    // offers none of the plumbing, plus anything already nominated that
    // this layer no longer carries — marked, so it is never dropped silently.
    const all = fieldOptions(layer);
    f.join.options = all;
    f.featureId.options = all;
    f.label.options = all;
    f.nameField.options = [{ value: '', label: 'The external ID (no name field)' }, ...all];
    const extras = fieldOptions(layer, false);
    const missing = draft.extraFields.filter((name) => !layer.fields.some((x) => x.name === name)).map((name) => ({ value: name, label: `${name} — not in this layer` }));
    f.extra.options = [...extras, ...missing];
    f.join.value = draft.joinField;
    f.featureId.value = draft.featureIdField;
    f.label.value = draft.labelField;
    f.nameField.value = draft.nameField;
    f.extra.value = [...draft.extraFields];
    const shapeId = [layer.globalIdField, layer.objectIdField].includes(draft.joinField);
    f.join.helpText = shapeId
      ? `${draft.joinField} identifies a shape, not a project, and changes when the layer is republished — every project would look abandoned. Choose a project number or grant ID.`
      : 'The field holding each project’s external ID, such as a project number.';
    f.join.errorText = '';
    f.featureId.helpText = 'Only matters when one project has several shapes.';
    f.label.helpText = 'What each shape is called on the map.';
    paintMappings();
  };

  const paintMappings = () => {
    const layer = layerById(draft.layerId);
    $('[data-mappings]').replaceChildren(
      ...draft.mappings.map((m) => {
        const li = document.createElement('li');
        li.className = 'firma2-gis-steps__mapping';
        const select = document.createElement('esa-select') as Control;
        select.setAttribute('size', 'md');
        select.setAttribute('label', config.mappable.find((x) => x.value === m.projectField)?.label ?? m.projectField);
        customElements.whenDefined('esa-select').then(() => {
          select.options = fieldOptions(layer);
          select.value = m.layerField;
        });
        select.addEventListener('change', () => {
          change({ ...draft, mappings: draft.mappings.map((x) => (x.projectField === m.projectField ? { ...x, layerField: String(select.value ?? '') } : x)) });
        });
        const remove = clone('remove');
        remove.setAttribute('aria-label', `Stop mapping ${select.getAttribute('label')}`);
        remove.addEventListener('click', () => {
          change({ ...draft, mappings: draft.mappings.filter((x) => x.projectField !== m.projectField) });
          paintMappings();
        });
        li.append(select, remove);
        return li;
      }),
    );
    $('[data-no-mappings]').hidden = draft.mappings.length > 0;
    const addable = config.mappable.filter((x) => !draft.mappings.some((m) => m.projectField === x.value));
    f.addMapping.hidden = addable.length === 0;
    f.addMapping.options = addable;
    f.addMapping.value = '';
  };

  const paintAccess = () => {
    const arcgis = draft.access === 'arcgis';
    f.layer.hidden = !arcgis;
    $('[data-read-wrap]').hidden = arcgis;
    $('[data-access-help]').textContent = arcgis
      ? `No credentials needed. Share feature services into ${config.group.title}, where the ProjectFirma ArcGIS account is a member. Nothing is stored here.`
      : 'A service anyone can read without signing in. It must return GeoJSON — for ArcGIS, the query URL with f=geojson.';
    f.url.helpText = arcgis ? 'Filled in from the layer you choose.' : '';
    f.url.disabled = arcgis;
  };

  // Options are assigned only once each lego is defined — a value set on an
  // un-upgraded element is shadowed and lost.
  const ready = defined.then(() => {
    f.access.options = [
      { value: 'arcgis', label: 'Shared with the ProjectFirma ArcGIS account' },
      { value: 'public', label: 'A public service' },
    ];
    f.layer.options = config.layers.map((l) => ({ value: l.id, label: `${l.name} — ${l.geometry.toLowerCase()}s` }));
    f.projectType.options = config.projectTypes.map((p) => ({ value: p, label: p }));
    f.stage.options = config.stages.map((s) => ({ value: s, label: s }));
  });

  // Choosing a layer fills in the URL, the name, and the defaults ArcGIS
  // already knows — the feature ID from the GlobalID, the label from the
  // display field. The join is NOT guessed: only the tenant knows it.
  f.access.addEventListener('change', () => {
    change({ ...draft, access: String(f.access.value ?? 'arcgis') as 'arcgis' | 'public' });
    paintAccess();
  });
  f.layer.addEventListener('change', () => {
    const layer = layerById(String(f.layer.value ?? ''));
    if (!layer) return;
    change({
      ...draft,
      layerId: layer.id,
      url: layer.url,
      name: draft.name || layer.name,
      featureIdField: layer.globalIdField,
      labelField: layer.displayField,
      joinField: layer.fields.some((x) => x.name === draft.joinField) ? draft.joinField : '',
    });
    f.url.value = draft.url;
    f.layer.errorText = '';
    f.url.errorText = '';
    f.name.value = draft.name;
    paintSchema();
  });
  f.url.addEventListener('change', () => change({ ...draft, url: String(f.url.value ?? '').trim() }));
  $('[data-read]').addEventListener('click', () => {
    if (!String(f.url.value ?? '').trim()) {
      f.url.errorText = 'Paste the service’s query URL first.';
      return;
    }
    f.url.errorText = '';
    const layer = config.layers[0];
    change({ ...draft, layerId: layer.id, featureIdField: layer.globalIdField, labelField: layer.displayField });
    paintSchema();
  });
  const bind = (control: Control, key: keyof Subscription, after?: () => void) =>
    control.addEventListener('change', () => {
      change({ ...draft, [key]: control === f.active ? Boolean(control.checked) : Array.isArray(control.value) ? [...control.value] : String(control.value ?? '') });
      after?.();
    });
  bind(f.join, 'joinField', paintSchema);
  bind(f.featureId, 'featureIdField');
  bind(f.label, 'labelField');
  bind(f.extra, 'extraFields');
  bind(f.nameField, 'nameField');
  bind(f.projectType, 'defaultProjectType');
  bind(f.stage, 'defaultStage');
  bind(f.lead, 'defaultLead');
  bind(f.name, 'name', () => (f.name.errorText = ''));
  bind(f.active, 'active');
  f.addMapping.addEventListener('change', () => {
    const field = String(f.addMapping.value ?? '');
    if (!field || draft.mappings.some((m) => m.projectField === field)) return;
    change({ ...draft, mappings: [...draft.mappings, { projectField: field, layerField: '' }] });
    paintMappings();
  });

  return {
    config,
    get draft() {
      return draft;
    },
    load: async (next) => {
      await ready;
      draft = { ...next };
      f.access.value = draft.access;
      f.layer.value = draft.layerId;
      f.url.value = draft.url;
      f.projectType.value = draft.defaultProjectType;
      f.stage.value = draft.defaultStage;
      f.lead.value = draft.defaultLead;
      f.name.value = draft.name;
      f.name.errorText = '';
      f.layer.errorText = '';
      f.url.errorText = '';
      f.active.checked = draft.active;
      paintAccess();
      paintSchema();
    },
    check: (step) => {
      if (step === 'layer') {
        // The error goes on the control the reader acts on: the picker for a
        // shared layer, the URL for a public service.
        const arcgis = draft.access === 'arcgis';
        f.layer.errorText = arcgis && !draft.layerId ? 'Choose a shared layer.' : '';
        f.url.errorText = arcgis ? '' : !draft.url ? 'Paste the service’s query URL.' : !draft.layerId ? 'Read the layer to list its fields.' : '';
        return !f.layer.errorText && !f.url.errorText;
      }
      if (step === 'matching') {
        f.join.errorText = draft.joinField ? '' : 'Choose the field that says which project a shape belongs to.';
        return !f.join.errorText;
      }
      if (step === 'name') {
        f.name.errorText = draft.name.trim() ? '' : 'Name it the way your team will.';
        return !f.name.errorText;
      }
      return true;
    },
  };
};
