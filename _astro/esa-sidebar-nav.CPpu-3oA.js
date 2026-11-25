import{i as l,b as i,A as r,a as d}from"./lit-element.D8DSg5zn.js";import{t as h}from"./typography.KBHeYOQc.js";import{i as n}from"./hugeicons-registry.DkuNnMpy.js";import{b as c}from"./boolish.DOQu-9JQ.js";const p=n("chevrons-left",16)??"",v=n("chevrons-right",16)??"",g=n("chevron-up",16)??"",b=n("chevron-down",16)??"",u=n("menu",20)??"",f=n("x",16)??"";class w extends l{constructor(){super(),this.toggleDrawer=()=>{this.drawerOpen?this.closeDrawer():this.openDrawer()},this.onDrawerKeydown=e=>{e.key==="Escape"&&this.drawer&&this.drawerOpen&&(e.preventDefault(),this.closeDrawer())},this.onDrawerFocusOut=e=>{if(!this.drawer||!this.drawerOpen)return;const a=e.relatedTarget;a&&this.renderRoot.contains(a)||this.closeDrawer(!1)},this.toggleCollapse=()=>{this.collapsed=!this.collapsed,this.dispatchEvent(new CustomEvent("collapsedchange",{detail:{collapsed:this.collapsed},bubbles:!0,composed:!0}))},this.items=[],this.label="Sidebar",this.collapsed=!1,this.collapsible=!0,this.drawer=!1,this.drawerOpen=!1,this._expanded=new Set}static{this.properties={items:{type:Array},label:{type:String},collapsed:{type:Boolean,reflect:!0},collapsible:{type:Boolean,converter:c},drawer:{type:Boolean,reflect:!0},drawerOpen:{type:Boolean,reflect:!0,attribute:"drawer-open"},_expanded:{state:!0}}}openDrawer(){this.drawerOpen=!0,this.emitDrawerChange(),this.updateComplete.then(()=>{this.renderRoot.querySelector(".drawer-close")?.focus()})}closeDrawer(e=!0){this.drawerOpen&&(this.drawerOpen=!1,this.emitDrawerChange(),e&&this.updateComplete.then(()=>{this.renderRoot.querySelector(".toggle")?.focus()}))}emitDrawerChange(){this.dispatchEvent(new CustomEvent("drawerchange",{detail:{open:this.drawerOpen},bubbles:!0,composed:!0}))}get groupedSections(){const e=[];let a=null,t=[];for(const o of this.items){const s=o.group??null;s!==a?(t.length>0&&e.push({group:a,items:t}),a=s,t=[o]):t.push(o)}return t.length>0&&e.push({group:a,items:t}),e}toggleChildren(e){const a=new Set(this._expanded);a.has(e.label)?a.delete(e.label):a.add(e.label),this._expanded=a}isExpanded(e){return this._expanded.has(e.label)}icon(e){if(!e)return null;const a=e.trimStart().startsWith("<")?e:n(e);return a?i`<span class="icon" .innerHTML=${a}></span>`:null}badge(e){return e!=null?i`<span class="badge typography-microcopy-xs-strong">${e}</span>`:null}renderLeaf(e){return e.href?i`<a
        class="link typography-microcopy-md ${e.active?"link--active":""} ${e.disabled?"link--disabled":""}"
        href=${e.href}
        tabindex=${e.disabled?-1:0}
        aria-current=${e.active?"page":"false"}
      >
        ${this.icon(e.icon)}
        <span class="label">${e.label}</span>
        ${this.badge(e.badge)}
      </a>`:i`<span class="link link--inert typography-microcopy-md">
      ${this.icon(e.icon)}
      <span class="label">${e.label}</span>
      ${this.badge(e.badge)}
    </span>`}renderItem(e){if(e.children&&e.children.length>0){const a=this.isExpanded(e);return i`<li class="item ${e.disabled?"item--disabled":""}">
        <button
          class="link link--parent typography-microcopy-md ${a?"link--expanded":""}"
          type="button"
          aria-expanded=${a}
          ?disabled=${e.disabled}
          @click=${()=>this.toggleChildren(e)}
        >
          ${this.icon(e.icon)}
          <span class="label">${e.label}</span>
          ${this.badge(e.badge)}
          <span class="chevron" .innerHTML=${a?g:b}></span>
        </button>
        ${a?i`<ul class="children" role="list">
              ${e.children.map(t=>i`<li class="child ${t.disabled?"child--disabled":""}">
                  ${t.href?i`<a
                        class="link link--child typography-microcopy-sm ${t.active?"link--active":""} ${t.disabled?"link--disabled":""}"
                        href=${t.href}
                        tabindex=${t.disabled?-1:0}
                      >
                        ${this.icon(t.icon)}
                        <span class="label">${t.label}</span>
                        ${this.badge(t.badge)}
                      </a>`:i`<span class="link link--child link--inert typography-label-sm">
                        ${this.icon(t.icon)}
                        <span class="label">${t.label}</span>
                        ${this.badge(t.badge)}
                      </span>`}
                </li>`)}
            </ul>`:null}
      </li>`}return i`<li class="item ${e.disabled?"item--disabled":""}">
      ${this.renderLeaf(e)}
    </li>`}render(){const e=this.drawer;return i`
      <!-- The <nav> is rendered UNCONDITIONALLY, in every state. Hiding it would
           take the navigation landmark off the page, and landmark navigation is the
           first thing a screen reader user reaches for — so what hides in drawer
           mode is .nav-content, never this element. -->
      <nav
        class="nav typography-label-md"
        aria-label=${this.label}
        @keydown=${this.onDrawerKeydown}
        @focusout=${this.onDrawerFocusOut}
      >
        <!-- The header slot and the collapse toggle share ONE row, so a rail
             carrying a brand puts the toggle beside it rather than stranding it
             on a full-width row of its own underneath. With no header content
             the row holds only the toggle, which its auto margin keeps at the
             trailing edge. Collapsed, the row stacks (see the CSS) - 32px of
             toggle will not fit next to a mark in a 72px rail.

             The toggle lives INSIDE the landmark on purpose. Navigate to the
             landmark while the drawer is shut and you land on the control that
             opens it, rather than in an empty region. -->
        <div class="rail-head">
          <slot name="header"></slot>
          ${e?i`<button
                id="nav-toggle"
                class="toggle"
                type="button"
                aria-expanded=${this.drawerOpen?"true":"false"}
                aria-controls="nav-content"
                @click=${this.toggleDrawer}
              >
                <span .innerHTML=${u}></span>
                <span class="toggle-label">${this.label}</span>
              </button>`:this.collapsible?i`<button
                  class="toggle"
                  type="button"
                  aria-label=${this.collapsed?"Expand sidebar":"Collapse sidebar"}
                  @click=${this.toggleCollapse}
                >
                  <span .innerHTML=${this.collapsed?v:p}></span>
                </button>`:null}
        </div>

        <!-- A real scrim ELEMENT, not Chapter 13's box-shadow trick. Forced colors
             forces box-shadow to 'none' at the used-value layer, so that scrim
             would simply not exist in Windows Contrast Themes. -->
        ${e&&this.drawerOpen?i`<div class="scrim" @click=${()=>this.closeDrawer()}></div>`:null}

        <div
          id="nav-content"
          class="nav-content"
          role=${e?"group":r}
          aria-labelledby=${e?"nav-toggle":r}
          ?inert=${e&&!this.drawerOpen}
        >
          ${e?i`<button class="drawer-close" type="button" @click=${()=>this.closeDrawer()}>
                <span .innerHTML=${f}></span>
                <span>Close</span>
              </button>`:null}
          <ul class="list" role="list">
            ${this.groupedSections.map(a=>i`
                ${a.group?i`<li class="group-heading" role="presentation">
                      <span class="group-label typography-eyebrow-md">${a.group}</span>
                    </li>`:null}
                ${a.items.map(t=>this.renderItem(t))}
              `)}
          </ul>
        </div>
      </nav>
    `}static{this.styles=[h,d`
    /* The light-DOM box-sizing reset doesn't cross the shadow boundary, so set it
       here — without it, .link (width:100% + padding) overflows the rail, pushing
       the right-aligned badge past the border and shifting collapsed icons off-center. */
    *, *::before, *::after { box-sizing: border-box; }

    :host {
      /* Renamed from --sidebar-width / --sidebar-width-collapsed on 2026-08-15:
         one component read them, and the name collided with the .sidebar
         layout primitive's own knob at a different value. The 260/56 fallbacks
         that sat here did not match the 280/72 the tokens ship — dead code,
         since the token always resolves, but it stated a default the rail never
         rendered. See migrations.json: sidebar-width-to-sidenav-width. */
      --_sidenav-width: var(--sidenav-width, 280px);
      --_sidenav-collapsed-width: var(--sidenav-width-collapsed, 72px);
      --_sidenav-bg: var(--color-background-elevation-sunken, #f0f0f0);
      --_sidenav-border: var(--color-border-default-subtle, #d9d9d9);
      --_sidenav-item-height: var(--sidenav-item-height, 40px);
      --_sidenav-item-padding: var(--spacing-300, 12px);
      --_sidenav-item-gap: var(--sidenav-item-gap, 0);
      --_sidenav-icon-gap: var(--spacing-200, 8px);
      --_sidenav-icon-size: var(--sidenav-icon-size, 18px);
      --_sidenav-icon-size-collapsed: var(--sidenav-icon-size-collapsed, 18px);
      --_sidenav-item-radius: var(--radius-md, 0.5rem);
      --_sidenav-item-color: var(--color-content-default-secondary, #646464);
      --_sidenav-item-color-hover: var(--color-content-default-secondary, #646464);
      --_sidenav-item-color-active: var(--color-content-brand, #2a7e3b);
      --_sidenav-item-bg: var(--sidenav-link-bg, transparent);
      /* One step ABOVE the rail's own fill. c225eb6 moved --_sidenav-bg to
         elevation-sunken and left this on the same token, so a hovered row painted
         the colour it already sat on. default-hover (gray-4) is the documented
         "hovered UI-element" step over sunken's gray-3.
         hub-edit-approved: user explicitly instructed this change, 2026-10-19 */
      --_sidenav-item-bg-hover: var(--color-background-default-hover, #e8e8e8);
      --_sidenav-item-bg-active: var(--color-background-brand-subtle, #fbfefb);
      --_sidenav-item-weight-active: var(--typography-font-weight-semibold, 550);
      --_sidenav-active-border-width: var(--sidenav-active-border-width, 0);
      --_sidenav-active-border-color: var(--color-background-brand, #46a758);
      --_sidenav-group-color: var(--color-content-default-secondary, #646464);
      --_sidenav-section-spacing: var(--spacing-300, 12px);
      --_sidenav-section-margin-top: var(--sidenav-section-margin-top, 0);
      --_sidenav-nested-gap: var(--sidenav-nested-gap, 0);
      --_sidenav-nested-indent: var(--spacing-400, 16px);
      --_sidenav-transition: var(--transition-base, 200ms ease);

      display: block;
      width: var(--_sidenav-width);
      height: 100%;
      border-right: var(--border-width-default, 1px) solid var(--_sidenav-border);
      background: var(--_sidenav-bg);
      transition: width var(--_sidenav-transition);
      overflow: hidden;
    }

    :host([collapsed]) { width: var(--_sidenav-collapsed-width); }
    :host([collapsed]) .label,
    :host([collapsed]) .badge,
    :host([collapsed]) .chevron,
    :host([collapsed]) .group-label {
      opacity: 0;
      width: 0;
      /* Collapse to a TRUE zero footprint so justify-content:center can center the
         icon: flex:none (else .label's flex:1 eats the space), and min-width/padding:0
         (else the badge's 20px min-width + padding leaves a ghost that shoves the
         icon off-center). */
      flex: none;
      min-width: 0;
      padding: 0;
      /* And ZERO the margins. NO BACKTICKS IN HERE — this is a Lit css template.
         .chevron carries margin-left: auto, and an auto margin absorbs the row's
         free space BEFORE justify-content:center gets to act — so a parent row
         (one with children) centred its icon inside what was left AFTER the
         chevron ate the slack, landing it 10.5px left of every leaf row's.
         Measured on the app-shell specimen: leaves at 35.5px from the rail edge,
         Reports at 25px. Width 0 alone does not fix it; an auto margin on a
         zero-width box still absorbs everything. */
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
    }
    :host([collapsed]) .link { justify-content: center; gap: 0; padding-inline: var(--spacing-200, 8px); }
    :host([collapsed]) .children { display: none; }

    /* COLLAPSED GROUP HEADINGS. The label is zeroed by the rule above, but the
       heading's own box stayed — 35px of unexplained blank rail between icon
       clusters, which reads as a rendering fault rather than a group break. The
       label goes out of flow (height 0; it is already width 0 + overflow hidden,
       so nothing about the collapse transition changes) and the heading becomes
       a hairline, which is the icon-rail convention for the same information. */
    :host([collapsed]) .group-label { height: 0; }
    :host([collapsed]) .group-heading {
      padding: var(--spacing-200, 8px) var(--spacing-300, 12px);
    }
    :host([collapsed]) .group-heading::after {
      content: '';
      display: block;
      height: var(--border-width-default, 1px);
      background: var(--_sidenav-border);
    }

    /* label-md on the rail is the default the slotted header inherits — every
       link, group label and badge below names its own role and overrides it. */
    .nav {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--spacing-200, 8px);
    }
    .nav-content {
      display: flex;
      flex-direction: column;
      min-height: 0;
      flex: 1;
    }

    /* ---- DRAWER MODE (Practical Accessibility ch. 13) ----
       The host stops reserving a column and the CONTENT becomes the overlay. The
       <nav> itself never moves off-screen, so the landmark stays reachable and the
       toggle inside it stays the thing you land on. */
    :host([drawer]) {
      width: auto;
      height: auto;
      overflow: visible;
      background: none;
      border: none;
    }
    :host([drawer]) .nav { height: auto; padding: 0; }
    :host([drawer]) .rail-head { margin-bottom: 0; }

    :host([drawer]) .nav-content {
      position: fixed;
      z-index: var(--z-modal, 400);
      inset-block: 0;
      inset-inline-start: 0;
      /* Reuses the existing rail token — a drawer width is not a new idea, and
         75vw is Chapter 13's own cap so the page stays visible behind it. */
      width: min(var(--_sidenav-width), 75vw);
      padding: var(--spacing-200, 8px);
      overflow-y: auto;
      background: var(--_sidenav-bg);
      border-inline-end: var(--border-width-default, 1px) solid var(--_sidenav-border);
      transform: translateX(-100%);
      transition: transform var(--animation-overlay-enter, 250ms ease-out);
    }
    :host([drawer][drawer-open]) .nav-content { transform: translateX(0); }

    /* The transform alone would only hide it from SIGHT — it would still be in the
       tab order and still in the accessibility tree. The inert attribute in the
       template is what removes it; this is the visual half of the same state. */
    :host([drawer]) .nav-content[inert] { visibility: hidden; }
    :host([drawer][drawer-open]) .nav-content { visibility: visible; }

    :host([drawer]) .scrim {
      position: fixed;
      inset: 0;
      z-index: calc(var(--z-modal, 400) - 1);
      background: var(--color-background-overlay-backdrop, rgba(0, 0, 0, 0.5));
    }

    :host([drawer]) .toggle-label { margin-inline-start: var(--spacing-200, 8px); }
    .drawer-close {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-200, 8px);
      align-self: flex-start;
      margin-bottom: var(--spacing-300, 12px);
      padding: var(--spacing-200, 8px) var(--spacing-300, 12px);
      border: var(--border-width-default, 1px) solid var(--color-border-default, #cecece);
      border-radius: var(--radius-md, 0.5rem);
      background: none;
      color: var(--color-content-default, #202020);
      font: inherit;
      cursor: pointer;
    }
    .drawer-close:focus-visible,
    :host([drawer]) .toggle:focus-visible {
      outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
      outline-offset: var(--focus-ring-offset, 2px);
    }

    /* The rail slides; honour the preference to sit still. The generated :root
       reduced-motion block cannot reach inside this shadow root. */
    @media (prefers-reduced-motion: reduce) {
      :host([drawer]) .nav-content { transition: none; }
    }

    /* Brand and toggle on one row. min-width:0 so a long wordmark ellipsises
       instead of shoving the toggle out of the rail. */
    .rail-head {
      display: flex;
      align-items: center;
      gap: var(--_sidenav-icon-gap);
      min-width: 0;
      margin-bottom: var(--spacing-200, 8px);
    }
    ::slotted([slot='header']) {
      display: block;
      min-width: 0;
      padding: var(--spacing-300, 12px) var(--_sidenav-item-padding);
      overflow: hidden;
      white-space: nowrap;
    }
    /* COLLAPSED: 22px of mark plus 32px of toggle plus a gap does not fit in a
       72px rail, so the row becomes a column and both centre on the same axis
       the nav icons use. */
    :host([collapsed]) .rail-head { flex-direction: column; gap: 0; }
    :host([collapsed]) .toggle { width: 100%; margin-left: 0; }

    .toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      /* Trailing edge whether or not a brand is slotted beside it. */
      margin-left: auto;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: var(--_sidenav-item-radius);
      background: transparent;
      color: var(--_sidenav-item-color);
      cursor: pointer;
      transition: background 150ms ease;
    }
    .toggle:hover { background: var(--_sidenav-item-bg-hover); }
    .toggle:focus-visible {
      outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
      outline-offset: var(--focus-ring-offset, 2px);
    }

    .list,
    .children { list-style: none; margin: 0; padding: 0; }
    /* Flex column so --sidenav-item-gap / --sidenav-nested-gap have something to
       act on. Both default to 0, which lays out identically to the plain blocks
       these were before. */
    .list { display: flex; flex-direction: column; gap: var(--_sidenav-item-gap); }
    .children {
      display: flex;
      flex-direction: column;
      gap: var(--_sidenav-nested-gap);
      padding-left: var(--_sidenav-nested-indent);
    }

    .group-heading {
      padding: var(--_sidenav-section-spacing) var(--_sidenav-item-padding) var(--spacing-100, 4px);
    }
    /* Only between sections — the first heading keeps the rail's own top padding. */
    .group-heading:not(:first-child) { margin-top: var(--_sidenav-section-margin-top); }
    /* Type comes from .typography-eyebrow-md — size, weight, uppercase and tracking
       were exactly that role, spelled out one property at a time. */
    .group-label {
      display: block;
      color: var(--_sidenav-group-color);
      white-space: nowrap;
      overflow: hidden;
      transition: opacity var(--_sidenav-transition), width var(--_sidenav-transition);
    }

    .link {
      display: flex;
      align-items: center;
      gap: var(--_sidenav-icon-gap);
      width: 100%;
      height: var(--_sidenav-item-height);
      padding: 0 var(--_sidenav-item-padding);
      border: none;
      /* Inset rather than a real border so switching the marker on cannot shift
         the row's box — width 0 (the default) paints nothing. */
      box-shadow: inset var(--_sidenav-active-border-width) 0 0 0 transparent;
      border-radius: var(--_sidenav-item-radius);
      background: var(--_sidenav-item-bg);
      color: var(--_sidenav-item-color);
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
      transition: background 150ms ease, color 150ms ease;
    }
    .link:hover:not(.link--disabled) { background: var(--_sidenav-item-bg-hover); }
    /* Scoped off the active row so it keeps its active colour while hovered —
       that is the behaviour that shipped before this hook existed. */
    .link:hover:not(.link--disabled):not(.link--active) { color: var(--_sidenav-item-color-hover); }
    .link:focus-visible {
      outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
      outline-offset: var(--focus-ring-offset, 2px);
    }

    /* The active row's weight stays a declaration, not a swapped composite:
       --sidenav-link-weight-active is a PUBLIC tier-3 hook, and a spoke's
       declaration of it is the one thing no alias could rescue if it went away. */
    .link--active {
      color: var(--_sidenav-item-color-active);
      background: var(--_sidenav-item-bg-active);
      box-shadow: inset var(--_sidenav-active-border-width) 0 0 0 var(--_sidenav-active-border-color);
      font-weight: var(--_sidenav-item-weight-active);
    }
    .link--disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
    .link--inert { cursor: default; }
    /* Size comes from .typography-label-sm on the element; only the height differs. */
    .link--child { height: 36px; }

    .icon { flex-shrink: 0; display: inline-flex; }
    /* iconSvg() stamps width/height ATTRIBUTES (18px). A presentational attribute
       loses to any rule, so these win without !important — but they must set both
       axes, or the attribute's other axis survives and the glyph goes oblong. */
    .icon svg { width: var(--_sidenav-icon-size); height: var(--_sidenav-icon-size); }
    :host([collapsed]) .icon svg {
      width: var(--_sidenav-icon-size-collapsed);
      height: var(--_sidenav-icon-size-collapsed);
    }
    .label {
      flex: 1;
      text-align: left;
      /* clip/visible, not "overflow: hidden" — .link carries a microcopy composite,
         whose line-height "none" (1) leaves the line box 1em against DM Sans's 1.30em
         glyph box, so hiding the Y axis clips the descenders in nav items like
         "Mapping" or "Projects". Same fix as esa-file-list's .file__name, where the
         arithmetic is written out. */
      overflow-x: clip;
      overflow-y: visible;
      text-overflow: ellipsis;
      transition: opacity var(--_sidenav-transition), width var(--_sidenav-transition);
    }
    .badge {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: var(--radius-pill, 9999px);
      background: var(--color-background-brand, #46a758);
      color: var(--color-content-default-knockout, #fcfcfc);
      transition: opacity var(--_sidenav-transition), width var(--_sidenav-transition);
    }
    .chevron {
      flex-shrink: 0;
      margin-left: auto;
      display: inline-flex;
      transition: opacity var(--_sidenav-transition), width var(--_sidenav-transition);
    }

    .item--disabled,
    .child--disabled { opacity: 0.5; pointer-events: none; }

    /* FORCED COLORS. The active row's marker is an INSET box-shadow — chosen so
       switching it on cannot shift the row's box — and inset or not, box-shadow
       is deleted here. Its other two signals, background and colour, are
       force-adjusted to the same values as an inactive row.

       Worse, --sidenav-active-border-width defaults to 0, so out of the box that
       marker paints nothing even in normal mode: the DEFAULT configuration has no
       forced-colors-durable active indicator at all. font-weight survives and is
       real but weak on its own.

       A fill is used rather than restoring the rail as a real border-left,
       because this component IS box-sizing: border-box (see the reset above), so
       a left border would shrink the content box and slide the icon and label of
       active rows right relative to inactive ones — the exact shift the inset
       shadow was written to avoid. */
    @media (forced-colors: active) {
      .link--active {
        background: Highlight;
        color: HighlightText;
      }
      .link--disabled,
      .child--disabled { color: GrayText; }
      /* The collapsed group rule is a painted background, so it is force-adjusted
         to Canvas and vanishes — the one signal a collapsed rail has left for
         where one group ends and the next begins. */
      :host([collapsed]) .group-heading::after { background: CanvasText; }
      /* The drawer's only separation from the page behind it is the scrim's
         translucent fill, which is force-adjusted to Canvas here — an opaque
         panel edge is what replaces it. */
      :host([drawer]) .nav-content { border: 1px solid CanvasText; }
    }
  `]}}customElements.get("esa-sidebar-nav")||customElements.define("esa-sidebar-nav",w);
