const r=(n,t,e)=>Math.min(Math.max(n,t),e),a=new CSSStyleSheet;a.replaceSync(`
  :host {
    /* The hit box, which is deliberately bigger than the mark: 18px across the
       edge and 56px down. Fitts's law on a target whose visible half is 2px. */
    --_hit-inline: var(--bcn-edge-handle-hit-inline, 18px);
    --_hit-block: var(--bcn-edge-handle-hit-block, 56px);
    /* The mark itself. 28px is a little under two line-heights — long enough to
       read as an intentional grip, short enough not to become a rule. */
    --_length: var(--bcn-edge-handle-length, 28px);
    --_thickness: var(--bcn-edge-handle-thickness, 2px);
    /* THE MARK CLEARS THE EDGE RATHER THAN SITTING ON IT. Centred on the border
       it read as a nick IN the rail — a 2px thickening of a 1px line, which looks
       like a rendering artefact before it looks like a control. Standing it off
       into the neighbouring pane makes it a separate object beside the line.

       --spacing-200 (8px), so the grip's centre lands 8px clear of the border:
       inside the content pane's own 24px padding on the nav's side, and inside
       the layout's 24px gutter on the record rail's, so it never reaches text or
       a card edge on either. AppLayout restates the same token — see the note
       there on why that placement cannot read this one. */
    --_gap: var(--bcn-edge-handle-gap, var(--spacing-200, 8px));

    /* DEFAULT PLACEMENT: absolutely positioned against the panel it sits inside,
       centred on the panel's own height. A panel that is a 100dvh sticky box —
       which is what both of this spoke's rails are — therefore puts the grip at
       the middle of the VIEWPORT and keeps it there.

       A caller whose panel cannot take children (a lego with a closed set of
       slots) overrides all of these and places the grip itself; that is what
       AppLayout does for the app's nav rail. Nothing below depends on how the box
       got where it is. */
    position: absolute;
    inset-block-start: 50%;
    inline-size: var(--_hit-inline);
    block-size: var(--_hit-block);
    translate: 0 -50%;

    display: flex;
    align-items: center;
    justify-content: center;

    /* One rung above the rails themselves (--z-sidebar), because the grip stands
       off the edge and sits over the neighbouring pane. */
    z-index: calc(var(--z-sidebar, 100) + 1);

    cursor: ew-resize;
    /* The drag must not be read as a scroll gesture on a touch screen. */
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;

    /* A step stronger than the hairline it stands beside
       (--color-border-default-subtle on both rails), so it reads as a mark rather
       than a fleck of the border that came loose. */
    color: var(--color-border-default-strong, #bbbbbb);
    transition: color var(--transition-fast, 150ms ease);
  }

  /* Half the hit box past the edge puts the mark ON the border; the gap then
     pushes the whole box outward, away from the panel. One expression for both
     sides: an inset toward the panel's own edge going more negative always means
     "further out", whichever edge it is. */
  :host([edge='end']) { inset-inline-end: calc(var(--_hit-inline) / -2 - var(--_gap)); }
  :host([edge='start']) { inset-inline-start: calc(var(--_hit-inline) / -2 - var(--_gap)); }

  /* NOTHING TO RESIZE WHEN THE PANEL IS SHUT. The attribute is mirrored off the
     panel by #sync, so this follows whoever collapsed it — the rail's own toggle
     button, the app shell's, or a restored preference. */
  :host([collapsed]) { display: none; }

  /* Text colour on approach — the same step every secondary glyph in this spoke
     uses. Deliberately NOT the brand: resizing a rail is not the primary action
     on any screen it appears on. */
  :host(:hover),
  :host(:focus-visible),
  :host([dragging]) {
    color: var(--color-content-default-secondary, #6f6f6f);
  }

  .grip {
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 100%;
    block-size: var(--_length);
    border-radius: var(--radius-pill, 999px);
  }

  /* THE RING IS MOVED TO THE GRIP, NOT REMOVED — see the a11y-checked note in
     the module header. The host is a 56px-tall hit box; the mark is 28px. */
  :host(:focus-visible) { outline: none; }
  :host(:focus-visible) .grip {
    outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
    outline-offset: var(--focus-ring-offset, 2px);
  }

  /* ONE BAR, AND IT STAYS ONE BAR. It was two halves that folded into a chevron
     on hover, back when a press here also collapsed the panel — the fold was how
     the mark advertised its second job. The second job moved to a button, so the
     mark went back to meaning one thing. */
  .bar {
    inline-size: var(--_thickness);
    block-size: 100%;
    border-radius: var(--radius-pill, 999px);
    background: currentColor;
  }

  /* Forced-colors modes drop author colours; currentColor resolves to the system
     text colour, so the mark survives — but only if it is not painted as a
     background the UA replaces. Stated rather than assumed. */
  @media (forced-colors: active) {
    .bar { background: CanvasText; }
  }
`);class h extends HTMLElement{#t=null;#l=null;#n=null;#i=null;#e=0;#d=!1;connectedCallback(){this.#g(),this.#t=this.#b(this.getAttribute("panel"))??this.parentElement,this.#l=this.#f(),this.#t&&(this.setAttribute("role","separator"),this.setAttribute("aria-orientation","vertical"),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this.hasAttribute("aria-label")||this.setAttribute("aria-label",`Resize ${this.getAttribute("label")??"panel"}`),this.#t.id&&this.setAttribute("aria-controls",this.#t.id),this.setAttribute("aria-valuemin",String(this.min)),this.setAttribute("aria-valuemax",String(this.max)),this.#m(),this.#e=this.#e||this.#a(),this.#n=new MutationObserver(()=>this.#s()),this.#n.observe(this.#t,{attributes:!0,attributeFilter:["collapsed"]}),this.addEventListener("pointerdown",this.#v),this.addEventListener("pointermove",this.#w),this.addEventListener("pointerup",this.#u),this.addEventListener("pointercancel",this.#u),this.addEventListener("keydown",this.#y),this.#s())}disconnectedCallback(){this.#n?.disconnect(),this.#n=null,this.#h()}get edge(){return this.getAttribute("edge")==="start"?"start":"end"}get min(){return Number(this.getAttribute("min"))||160}get max(){return Number(this.getAttribute("max"))||640}get sizeVar(){return this.getAttribute("size-var")||"--width"}get collapsed(){return!!this.#t?.hasAttribute("collapsed")}persist(){this.#o()}#g(){if(this.#d)return;this.#d=!0;const t=this.attachShadow({mode:"open"});t.adoptedStyleSheets=[a],t.innerHTML='<span class="grip" part="grip"><span class="bar"></span></span>'}#b(t){return t?t==="parent"?this.parentElement:document.querySelector(t):null}#f(){const t=this.getAttribute("size-host");return t?t==="parent"?this.#t?.parentElement??null:this.#t?.closest(t)??document.querySelector(t):this.#t}#a(){return this.#t?.getBoundingClientRect().width??0}#c(){return this.#e||this.#a()}#r(t){this.#e=Math.round(t),this.#l?.style.setProperty(this.sizeVar,`${this.#e}px`)}#s(){this.toggleAttribute("collapsed",this.collapsed),this.setAttribute("aria-valuenow",String(Math.round(this.#c())))}#o(){const t=this.getAttribute("storage-key");if(t)try{const e={w:this.#e,c:this.collapsed};localStorage.setItem(`bcn-edge-handle:${t}`,JSON.stringify(e))}catch{}this.dispatchEvent(new CustomEvent("bcn-edge-change",{bubbles:!0,composed:!0,detail:{collapsed:this.collapsed,width:this.#e}}))}#m(){const t=this.getAttribute("storage-key");if(t)try{const e=localStorage.getItem(`bcn-edge-handle:${t}`);if(!e)return;const i=JSON.parse(e);if(typeof i.w!="number"&&!i.c)return;this.#t?.setAttribute("data-resizing",""),typeof i.w=="number"&&this.#r(r(i.w,this.min,this.max)),i.c&&this.#t?.setAttribute("collapsed",""),requestAnimationFrame(()=>{this.#i||this.#t?.removeAttribute("data-resizing")})}catch{}}#v=t=>{t.button!==0||!this.#t||(t.preventDefault(),this.setPointerCapture(t.pointerId),window.addEventListener("keydown",this.#p),this.#i={id:t.pointerId,x:t.clientX,startWidth:this.#a(),moved:!1},this.setAttribute("dragging",""),this.#t.setAttribute("data-resizing",""),document.documentElement.style.cursor="ew-resize")};#w=t=>{const e=this.#i;if(!e||t.pointerId!==e.id)return;const i=t.clientX-e.x;if(!e.moved&&Math.abs(i)<=3)return;e.moved=!0;const o=e.startWidth+(this.edge==="end"?i:-i);this.#r(r(o,this.min,this.max));const s=this.#a();s>0&&Math.abs(s-this.#e)>1&&this.#r(s),this.#s()};#u=t=>{const e=this.#i;!e||t.pointerId!==e.id||(this.#h(),e.moved&&this.#o(),this.#s())};#p=t=>{const e=this.#i;if(t.key!=="Escape"||!e)return;t.preventDefault();const{startWidth:i}=e;this.#h(),this.#r(i),this.#s()};#h(){const t=this.#i;t&&(window.removeEventListener("keydown",this.#p),this.hasPointerCapture(t.id)&&this.releasePointerCapture(t.id),this.#i=null,this.removeAttribute("dragging"),this.#t?.removeAttribute("data-resizing"),document.documentElement.style.cursor="")}#y=t=>{if(t.key==="Home"||t.key==="End"){t.preventDefault(),this.#r(t.key==="Home"?this.min:this.max),this.#s(),this.#o();return}if(t.key!=="ArrowLeft"&&t.key!=="ArrowRight")return;t.preventDefault();const e=(t.shiftKey?64:16)*(t.key==="ArrowRight"?1:-1),i=this.edge==="end"?e:-e;this.#r(r(this.#c()+i,this.min,this.max)),this.#s(),this.#o()}}customElements.get("bcn-edge-handle")||customElements.define("bcn-edge-handle",h);
