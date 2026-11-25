const x=`
  bcn-tooltip { display: inline-flex; }
  .bcn-tooltip__bubble {
    position: fixed;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: var(--z-tooltip, 600);
    box-sizing: border-box;
    max-inline-size: min(22rem, calc(100vw - 16px));
    padding: var(--spacing-100, 0.25rem) var(--spacing-200, 0.5rem);
    border-radius: var(--radius-sm, 0.25rem);
    background: var(--color-background-default-knockout, #202020);
    color: var(--color-content-default-knockout, #fcfcfc);
    font-family: var(--typography-body-sm-font-family, inherit);
    font-size: var(--typography-body-sm-font-size, 0.875rem);
    line-height: var(--typography-body-sm-line-height, 1.4);
    font-variant-numeric: tabular-nums;
    /* A line break in the text is a line break in the bubble. */
    white-space: pre-line;
    text-wrap: balance;
    box-shadow: var(--elevation-4, 0 6px 24px -6px rgba(0, 0, 0, 0.07));
  }
  .bcn-tooltip__bubble[hidden] { display: none; }
  /* The gap between trigger and bubble, bridged, so the pointer crossing it
     never leaves both. */
  .bcn-tooltip__bubble::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    block-size: 10px;
  }
  .bcn-tooltip__bubble[data-side='below']::after { inset-block-end: 100%; }
  .bcn-tooltip__bubble[data-side='above']::after { inset-block-start: 100%; }
  /* A rotated square half-sunk in the bubble's edge: esa-tooltip's notch. */
  .bcn-tooltip__notch {
    position: absolute;
    inset-inline-start: 0;
    inline-size: 8px;
    block-size: 8px;
    background: inherit;
    transform: translateX(var(--bcn-tooltip-notch, 0px)) rotate(45deg);
  }
  .bcn-tooltip__bubble[data-side='below'] .bcn-tooltip__notch { inset-block-start: -4px; }
  .bcn-tooltip__bubble[data-side='above'] .bcn-tooltip__notch { inset-block-end: -4px; }
  @media (forced-colors: active) {
    .bcn-tooltip__bubble { border: 1px solid CanvasText; }
    /* A bordered rotated square reads as a loose diamond: the edge suffices. */
    .bcn-tooltip__notch { display: none; }
  }
`;let e=null,f=null,o=null,g=0;function E(){if(e)return e;const l=document.createElement("style");l.dataset.bcnTooltip="",l.textContent=x,document.head.appendChild(l),e=document.createElement("div"),e.className="bcn-tooltip__bubble",e.id="bcn-tooltip-bubble",e.setAttribute("role","tooltip"),e.hidden=!0,f=document.createElement("span");const t=document.createElement("span");return t.className="bcn-tooltip__notch",t.setAttribute("aria-hidden","true"),e.append(f,t),document.body.appendChild(e),document.addEventListener("keydown",n=>{n.key==="Escape"&&o?.hide()}),window.addEventListener("scroll",()=>o?.hide(),{capture:!0,passive:!0}),window.addEventListener("resize",()=>o?.hide(),{passive:!0}),e.addEventListener("pointerleave",n=>{o&&!o.contains(n.relatedTarget)&&o.hide()}),e}class w extends HTMLElement{#t=null;connectedCallback(){this.addEventListener("pointerenter",this.#i),this.addEventListener("pointerleave",this.#e),this.addEventListener("focusin",this.#o),this.addEventListener("focusout",this.#e)}disconnectedCallback(){this.removeEventListener("pointerenter",this.#i),this.removeEventListener("pointerleave",this.#e),this.removeEventListener("focusin",this.#o),this.removeEventListener("focusout",this.#e),this.hide()}get text(){return this.getAttribute("text")??""}set text(t){this.setAttribute("text",t)}get#n(){return this.firstElementChild??this}#i=t=>{t.pointerType==="mouse"&&this.#s()};#o=()=>{this.matches(":has(:focus-visible)")&&this.show()};#e=t=>{const n=t.relatedTarget;t.type==="pointerleave"&&e&&n&&e.contains(n)||this.hide()};#s(){this.#t&&clearTimeout(this.#t),Date.now()-g<300?this.show():this.#t=setTimeout(()=>this.show(),300)}show(){if(this.#t&&clearTimeout(this.#t),this.#t=null,!this.text||!this.isConnected)return;const t=E();o&&o!==this&&o.hide(),o=this,f&&(f.textContent=this.text),t.style.inlineSize="",t.hidden=!1;const n=document.createRange();n.selectNodeContents(f??t);const c=Math.max(0,...Array.from(n.getClientRects(),v=>v.width)),h=getComputedStyle(t),d=parseFloat(h.paddingLeft)+parseFloat(h.paddingRight)+parseFloat(h.borderLeftWidth)+parseFloat(h.borderRightWidth);c>0&&(t.style.inlineSize=`${Math.ceil(c+d)+1}px`),this.hasAttribute("labelled")||this.#n.setAttribute("aria-describedby",t.id);const s=this.#n.getBoundingClientRect(),i=t.getBoundingClientRect(),r=Math.min(Math.max(8,s.left+s.width/2-i.width/2),Math.max(8,window.innerWidth-8-i.width)),a=s.bottom+8,b=a+i.height>window.innerHeight-8,u=b?Math.max(8,s.top-8-i.height):a;t.dataset.side=b?"above":"below",t.style.transform=`translate(${Math.round(r)}px, ${Math.round(u)}px)`;const p=s.left+s.width/2-Math.round(r),m=Math.min(Math.max(10,p),i.width-10)-4;t.style.setProperty("--bcn-tooltip-notch",`${m}px`)}hide(){this.#t&&clearTimeout(this.#t),this.#t=null,o===this&&(o=null,g=Date.now(),e&&(e.hidden=!0),this.#n.removeAttribute("aria-describedby"))}}customElements.get("bcn-tooltip")||customElements.define("bcn-tooltip",w);document.querySelectorAll("[data-firma2-classification-outline]").forEach(l=>{const t=[...l.querySelectorAll("tbody tr")],n=new Set,c=new Set,h=()=>{for(const d of t){const i=(d.dataset.parents??"").split(" ").filter(Boolean).some(a=>n.has(a)),r=d.dataset.measureOf;d.hidden=i||r!=null&&!c.has(r)}};l.addEventListener("click",d=>{const s=d.target.closest("[data-toggle] button, [data-toggle] [aria-expanded]"),i=s?.closest("tr");if(!s||!i)return;const[r,a]=(i.dataset.row??"").split(":"),b=i.querySelector(".firma2-classification-outline__link")?.textContent??"",u=r==="g"?n:c;u.has(a)?u.delete(a):u.add(a);const p=r==="g"?!n.has(a):c.has(a),m=i.querySelector("[data-toggle] [aria-expanded]");m?.setAttribute("aria-expanded",String(p)),m?.setAttribute("aria-label",r==="g"?`${p?"Hide":"Show"} ${b}`:`${p?"Hide":"Show"} measures for ${b}`),h()})});
