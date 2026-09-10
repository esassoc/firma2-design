import{i as p,A as d,b as n,a as m}from"./lit-element.D8DSg5zn.js";import{t as u}from"./typography.KBHeYOQc.js";import{a as h}from"./a11y.sqk3bMt7.js";import{a as f}from"./announcer.dkeh-00N.js";import{b as g}from"./boolish.DOQu-9JQ.js";class y extends p{constructor(){super(),this.query="",this.activeId=null,this.onGlobalKeydown=e=>{this.hotkey&&(e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"&&(e.preventDefault(),this.toggle())},this.onNativeClose=()=>{this.open=!1},this.onSearch=e=>{this.query=e.target.value,this.activeId=null},this.onKeydown=e=>{const a=this.flatCommands;if(e.key==="Escape"){e.preventDefault(),this.close();return}if(a.length===0)return;const t=a.findIndex(o=>o.id===this.activeId);switch(e.key){case"ArrowDown":{e.preventDefault();const o=t<a.length-1?t+1:0;this.activeId=a[o].id;break}case"ArrowUp":{e.preventDefault();const o=t>0?t-1:a.length-1;this.activeId=a[o].id;break}case"Enter":{e.preventDefault();const o=a.find(s=>s.id===this.activeId);o?this.execute(o):a.length===1&&this.execute(a[0]);break}}},this.wasEmpty=!1,this.commands=[],this.open=!1,this.hotkey=!0}static{this.properties={commands:{type:Array},open:{type:Boolean,reflect:!0},hotkey:{type:Boolean,converter:g},query:{state:!0},activeId:{state:!0}}}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.onGlobalKeydown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this.onGlobalKeydown)}toggle(){this.open?this.close():this.show()}show(){this.open=!0,this.query="",this.activeId=null,requestAnimationFrame(()=>{this.renderRoot.querySelector(".esa-command-palette__input")?.focus()})}close(){this.open=!1}get dialogEl(){return this.renderRoot.querySelector("dialog")}syncDialog(){const e=this.dialogEl;e&&(this.open?e.open||e.showModal():e.close())}get flatCommands(){return this.filteredGroups().flatMap(e=>e.commands.filter(a=>!a.disabled))}filteredGroups(){const e=this.query.toLowerCase().trim(),a=e?this.commands.filter(o=>[o.label,o.description??"",...o.keywords??[]].join(" ").toLowerCase().includes(e)):this.commands,t=new Map;for(const o of a){const s=o.group??"Commands",l=t.get(s)??[];l.push(o),t.set(s,l)}return Array.from(t.entries()).map(([o,s])=>({label:o,commands:s}))}execute(e){e.disabled||(e.action(),this.close())}announceEmptyResults(){const e=this.open&&!!this.query.trim()&&this.filteredGroups().length===0;e&&!this.wasEmpty&&f("No commands found",{assertive:!0}),this.wasEmpty=e}updated(e){e.has("open")&&this.syncDialog(),this.announceEmptyResults()}render(){const e=this.filteredGroups();return n`
      <dialog
        class="esa-command-palette"
        closedby="any"
        aria-label="Command palette"
        @close=${this.onNativeClose}
      >
        <div class="esa-command-palette__search">
          <svg class="esa-command-palette__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <!-- The input had no accessible name — only a placeholder, which is not a
               name and vanishes as soon as you type. The cue below is what makes
               announcing the result list on every keystroke unnecessary; the visible
               footer tells sighted users the same thing. -->
          <!-- COMBOBOX semantics, absent until 2026-08-18. Arrow keys moved the
               highlight and a screen reader said NOTHING: focus never leaves the
               input (it has to — you are still typing), so without
               aria-activedescendant there is no announcement to make. Same fix and
               same reasoning as esa-combobox.renderAutocomplete; all three IDREFs
               resolve inside this shadow root, which is the only place they can. -->
          <input
            class="esa-command-palette__input typography-microcopy-lg-subtle"
            type="text"
            role="combobox"
            aria-label="Search commands"
            aria-describedby="cue"
            aria-expanded="true"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="results"
            aria-activedescendant=${this.activeId?`cmd-${this.activeId}`:d}
            placeholder="Type a command..."
            .value=${this.query}
            @input=${this.onSearch}
            @keydown=${this.onKeydown}
            autocomplete="off"
          />
          <span class="visually-hidden" id="cue"
            >Commands filter as you type. Use the up and down arrows to review them,
            Enter to run one, Escape to close.</span
          >
          <kbd class="esa-command-palette__kbd typography-body-xs">ESC</kbd>
        </div>
        <div class="esa-command-palette__results" id="results" role="listbox" aria-label="Commands">
          ${e.map(a=>n`
              <div class="esa-command-palette__group" role="group" aria-label=${a.label}>
                <div class="esa-command-palette__group-label typography-eyebrow-md" aria-hidden="true">${a.label}</div>
                ${a.commands.map(t=>n`
                    <!-- A <button role="option"> is invalid: an option may not be an
                         interactive widget, and it also made every command its own
                         tab stop. It is a <div> now — the keyboard route is the
                         input's arrow keys plus aria-activedescendant, which is the
                         listbox contract. Pointer users keep the click. -->
                    <div
                      class="esa-command-palette__item ${t.id===this.activeId?"esa-command-palette__item--active":""} ${t.disabled?"esa-command-palette__item--disabled":""}"
                      id=${`cmd-${t.id}`}
                      role="option"
                      aria-selected=${t.id===this.activeId}
                      aria-disabled=${t.disabled?"true":d}
                      @click=${()=>this.execute(t)}
                      @mouseenter=${()=>this.activeId=t.id}
                    >
                      <div class="esa-command-palette__item-content">
                        <span class="esa-command-palette__item-label typography-label-md">${t.label}</span>
                        ${t.description?n`<span class="esa-command-palette__item-desc typography-body-sm">${t.description}</span>`:null}
                      </div>
                      ${t.shortcut?n`<kbd class="esa-command-palette__item-shortcut typography-body-xs">${t.shortcut}</kbd>`:null}
                    </div>
                  `)}
              </div>
            `)}
          ${e.length===0?n`<div class="esa-command-palette__empty typography-body-md">No commands found for "${this.query}"</div>`:null}
        </div>
      </dialog>
    `}static{this.styles=[u,h,m`
    :host { display: contents; }

    /* ::backdrop replaces the hand-rolled scrim div; the top layer replaces the
       z-index pair. Literal fallback is the real value where ::backdrop does not
       inherit custom properties — see esa-dialog. */
    dialog.esa-command-palette::backdrop {
      background: var(--color-background-overlay-backdrop, rgba(0, 0, 0, 0.5));
    }

    dialog.esa-command-palette {
      /* Docked 20% down rather than centered, so it keeps explicit insets and a
         zeroed margin instead of the UA's centering 'margin: auto'. */
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      padding: 0;
      width: var(--command-palette-width, 560px);
      max-width: calc(100vw - 2rem);
      max-height: var(--command-palette-max-height, 440px);
      background: var(--color-background-elevation-floating, #fcfcfc);
      border: var(--border-width-default, 1px) solid var(--color-border-default, #cecece);
      border-radius: var(--radius-lg, 0.75rem);
      box-shadow: var(--elevation-6, 0 20px 60px rgba(0, 0, 0, 0.2));
      overflow: hidden;
      color: var(--color-content-default, #202020);
      font-family: var(--typography-font-family-sans, 'DM Sans', sans-serif);
      animation: esa-cmdk-enter var(--animation-enter, 150ms ease-out);
    }
    dialog.esa-command-palette[open] { display: flex; flex-direction: column; }
    @keyframes esa-cmdk-enter {
      from { opacity: 0; transform: translateX(-50%) scale(0.96); }
      to { opacity: 1; transform: translateX(-50%) scale(1); }
    }

    .esa-command-palette__search {
      display: flex;
      align-items: center;
      gap: var(--spacing-300, 0.75rem);
      padding: var(--spacing-300, 0.75rem) var(--spacing-400, 1rem);
      border-bottom: var(--border-width-default, 1px) solid var(--color-border-default-subtle, #d9d9d9);
      /* Same clip as esa-entity-search: the panel is --radius-lg with
         overflow: hidden, so a square row's inset ring loses ~4.7px off each end
         of its top edge. Match the panel's INNER curve (radius minus its border)
         and the outline follows it. See that component for the geometry. */
      border-radius: calc(var(--radius-lg, 0.75rem) - var(--border-width-default, 1px))
        calc(var(--radius-lg, 0.75rem) - var(--border-width-default, 1px)) 0 0;
    }
    /* The ring goes on the ROW, not the input. The input is chromeless by design,
       so a ring drawn on it would float around bare text; the row is the visible
       affordance. :focus-within rather than :focus-visible for the same reason
       esa-text-field uses it — this is text entry, where a ring on click is native
       behaviour and wanted.

       Inset because the row runs edge to edge inside an overflow:hidden panel, so
       an outline at positive offset would be clipped on both sides. */
    .esa-command-palette__search:focus-within {
      outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
      outline-offset: calc(var(--focus-ring-offset, 2px) * -1);
    }
    .esa-command-palette__search-icon {
      /* STAYS -muted, unlike the six text rules around it. An icon is non-text
         content: SC 1.4.11 asks 3:1, not 4.5:1, and gray-10 on the dialog surface
         measures 3.70:1. Raising it would be consistency for its own sake. */
      color: var(--color-content-default-secondary, #646464);
      flex-shrink: 0;
    }
    .esa-command-palette__input {
      flex: 1;
      border: none;
      /* Suppressed only because the row above paints the ring — never bare. */
      outline: none;
      color: var(--color-content-default, #202020);
      background: transparent;
      font-family: inherit;
    }
    /* -secondary: a placeholder is TEXT under SC 1.4.3, and axe cannot evaluate
       ::placeholder — so this one was invisible to the audit as well as to readers. */
    .esa-command-palette__input::placeholder { color: var(--color-content-default-secondary, #646464); }

    .esa-command-palette__kbd,
    .esa-command-palette__item-shortcut {
      padding: 2px 6px;
      border: var(--border-width-default, 1px) solid var(--color-border-default, #cecece);
      border-radius: var(--radius-sm, 0.25rem);
      /* -secondary, not -muted: muted is gray-10, which measures 3.33:1 on this
         sunken chip at 12px and misses AA (SC 1.4.3). gray-11 gives 5.19:1. */
      color: var(--color-content-default-secondary, #646464);
      background: var(--color-background-elevation-sunken, #f0f0f0);
    }

    .esa-command-palette__results {
      overflow-y: auto;
      padding: var(--spacing-200, 0.5rem);
    }
    .esa-command-palette__group-label {
      padding: var(--spacing-200, 0.5rem) var(--spacing-200, 0.5rem) var(--spacing-100, 0.25rem);
      /* -secondary, not -muted: 3.70:1 vs 5.77:1 on the dialog surface at 12px. */
      color: var(--color-content-default-secondary, #646464);
    }

    .esa-command-palette__item {
      display: flex;
      align-items: center;
      gap: var(--spacing-300, 0.75rem);
      width: 100%;
      padding: var(--spacing-200, 0.5rem) var(--spacing-300, 0.75rem);
      border: none;
      border-radius: var(--radius-md, 0.5rem);
      background: transparent;
      color: var(--color-content-default, #202020);
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 80ms ease;
    }
    .esa-command-palette__item--active { background: var(--color-background-elevation-sunken, #f0f0f0); }
    .esa-command-palette__item--disabled { opacity: 0.5; cursor: not-allowed; }
    .esa-command-palette__item:focus-visible {
      outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
      outline-offset: -2px;
    }

    .esa-command-palette__item-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .esa-command-palette__item-desc {
      /* -secondary: same 3.70:1 as the group label; only renders once a result list
         is populated, which is why the audit never saw it. */
      color: var(--color-content-default-secondary, #646464);
    }

    .esa-command-palette__empty {
      padding: var(--spacing-600, 2rem);
      text-align: center;
      /* -secondary: only renders on a no-results state, so the audit never saw it. */
      color: var(--color-content-default-secondary, #646464);
    }
  `]}}customElements.get("esa-command-palette")||customElements.define("esa-command-palette",y);const v=document.getElementById("result"),r=i=>v.textContent=`Ran: ${i}`,c=document.getElementById("cmdk");c.commands=[{id:"new",label:"New file",description:"Create a blank file",shortcut:"⌘N",group:"File",keywords:["create"],action:()=>r("New file")},{id:"open",label:"Open…",description:"Open an existing file",shortcut:"⌘O",group:"File",action:()=>r("Open")},{id:"save",label:"Save",shortcut:"⌘S",group:"File",action:()=>r("Save")},{id:"theme",label:"Toggle theme",group:"View",keywords:["dark","light"],action:()=>r("Toggle theme")},{id:"settings",label:"Open settings",group:"View",disabled:!0,action:()=>r("Settings")}];document.getElementById("open-cmdk").addEventListener("click",()=>c.show());
