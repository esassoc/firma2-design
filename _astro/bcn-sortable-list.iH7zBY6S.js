import{a as U}from"./announcer.dkeh-00N.js";import{I as V}from"./hugeicons-registry.DkuNnMpy.js";const Q=4,Z='<circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>';function j(T){const o=T.content.cloneNode(!0);return o.querySelectorAll("svg").forEach(t=>t.innerHTML=V["grip-vertical"]??Z),o}const tt=`
  bcn-sortable-list { display: block; }
  bcn-sortable-list [data-sort-grip] { flex: none; }
  bcn-sortable-list [data-sort-spacer] { flex: none; visibility: hidden; }
  bcn-sortable-list [data-sort-grip] button { cursor: grab; touch-action: none; }
  /* THE ROW MOVES AS ITSELF, NOT ON A PLATE (user, 2026-10-20). A lifted row
     once grew a floating card — surface, shadow, padding — the full width of
     the list, so a short "Map" became a 784px slab and the drag felt like
     moving a container that holds the item. Now nothing is added around it:
     the row keeps its own look and only the surface it already sits on goes
     behind it, so it covers the rows it passes instead of showing through. */
  bcn-sortable-list li[data-dragging] {
    position: relative;
    z-index: var(--z-dropdown, 50);
    background: var(--firma2-sheet-background, var(--color-background-default, #fcfcfc));
  }
  bcn-sortable-list li[data-dragging] [data-sort-grip] button { cursor: grabbing; }
  /* drop="line": the row stays in place, dimmed, and out of the pointer's
     way; a label with its name is what travels. */
  bcn-sortable-list[drop='line'] li[data-dragging] {
    opacity: 0.4;
    pointer-events: none;
    background: transparent;
  }
  .bcn-sortable-drag-label {
    position: fixed;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: var(--z-dropdown, 50);
    box-sizing: border-box;
    max-inline-size: 20rem;
    padding: var(--spacing-150, 0.375rem) var(--spacing-300, 0.75rem);
    overflow: hidden;
    border: 1px solid var(--color-border-default, #cecece);
    border-radius: var(--radius-md, 0.5rem);
    background: var(--color-background-elevation-floating, var(--color-background-default, #fcfcfc));
    box-shadow: var(--elevation-4, 0 6px 24px -6px rgba(0, 0, 0, 0.18));
    color: var(--color-content-default, #202020);
    font-family: var(--typography-body-sm-font-family, inherit);
    font-size: var(--typography-body-sm-font-size, 0.875rem);
    line-height: var(--typography-body-sm-line-height, 1.4);
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
  }
  .bcn-sortable-drop-line {
    position: fixed;
    z-index: var(--z-dropdown, 50);
    block-size: 2px;
    margin-block-start: -1px;
    border-radius: 1px;
    background: var(--bcn-sortable-drop-color, var(--color-border-default-focus, #2a7e3b));
    pointer-events: none;
  }
  /* The ring at its leading end says where the line starts — which is the
     indent of the list the row would join. */
  .bcn-sortable-drop-line::before {
    content: '';
    position: absolute;
    inset-inline-start: -4px;
    inset-block-start: -3px;
    box-sizing: border-box;
    inline-size: 8px;
    block-size: 8px;
    border: 2px solid var(--bcn-sortable-drop-color, var(--color-border-default-focus, #2a7e3b));
    border-radius: 50%;
    background: var(--firma2-sheet-background, var(--color-background-default, #fcfcfc));
  }
  .bcn-sortable-drop-line[hidden] { display: none; }
  /* A row about to take the dragged one. Consumers restyle it (a tree marks
     the group's own line, not everything under it). */
  bcn-sortable-list li[data-drop-into] {
    outline: 2px solid var(--bcn-sortable-drop-color, var(--color-border-default-focus, #2a7e3b));
    outline-offset: -2px;
    border-radius: var(--radius-md, 0.5rem);
  }
  bcn-sortable-list[data-sorting] { user-select: none; cursor: grabbing; }
  bcn-sortable-list :is(ol, ul):has(> li[data-sort-key]) > li[data-sort-placeholder] { display: none; }
  @media (prefers-reduced-motion: reduce) {
    bcn-sortable-list li { transition: none !important; }
  }
`;let W=!1;function et(){if(W)return;const T=document.createElement("style");T.dataset.bcnSortableList="",T.textContent=tt,document.head.appendChild(T),W=!0}const _=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;class N extends HTMLElement{static observedAttributes=["label","move-label"];#s=new MutationObserver(()=>this.#n());#i=null;#a=!1;connectedCallback(){et(),this.#n(),this.#s.observe(this,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-sort-actions"]}),this.addEventListener("click",this.#h,!0),this.addEventListener("menu-action",this.#b)}disconnectedCallback(){this.#s.disconnect()}attributeChangedCallback(){this.isConnected&&this.#l().forEach(o=>o.#n())}#l(){const o=this.getAttribute("group");return o?Array.from(document.querySelectorAll(`bcn-sortable-list[group="${CSS.escape(o)}"]`)).filter(t=>t instanceof N):[this]}#d(o){return!(this.getAttribute("refuse")??"").split(/\s+/).includes(o)}get#e(){return this.querySelector(":scope > ol, :scope > ul")}#u(){return Array.from(this.#e?.children??[]).filter(o=>o instanceof HTMLLIElement)}get#o(){return this.getAttribute("layout")==="grid"}#p(o){return o.querySelector("[data-sort-grip-slot]")??o}#t(){return this.#u().filter(o=>o.dataset.sortKey&&!("sortLocked"in o.dataset))}#r(){return this.#t().map(o=>o.dataset.sortKey)}#n(){const o=this.querySelector(":scope > template[data-sort-handle]");if(!o)return;const t=this.#t();if(this.#s.disconnect(),this.#u().filter(d=>"sortLocked"in d.dataset&&!d.querySelector(":scope > [data-sort-spacer]")).forEach(d=>{const c=document.createElement("span");c.setAttribute("data-sort-spacer",""),c.setAttribute("aria-hidden","true"),c.inert=!0,c.append(j(o)),d.prepend(c)}),t.forEach((d,c)=>{const b=this.#p(d);let h=b.querySelector(":scope > [data-sort-grip]");h||(h=document.createElement("esa-dropdown-menu"),h.setAttribute("data-sort-grip",""),h.setAttribute("position",b===d?"below-start":"below-end"),h.append(j(o)),b.prepend(h),h.querySelector("button")?.addEventListener("pointerdown",k=>this.#f(k,d)));const w=d.dataset.sortLabel??"row",y=h.querySelector("button");y?.setAttribute("aria-label",`Move ${w}`),y?.setAttribute("title","Drag to move, or click for options");const x=d.dataset.sortActions?JSON.parse(d.dataset.sortActions):[],E=[...x,...x.length?[{label:"",action:"",divider:!0}]:[],{label:this.#o?"Move earlier":"Move up",action:"up",disabled:c===0},{label:this.#o?"Move later":"Move down",action:"down",disabled:c===t.length-1},{label:this.#o?"Move to start":"Move to top",action:"top",disabled:c===0},{label:this.#o?"Move to end":"Move to bottom",action:"bottom",disabled:c===t.length-1}],M=this.#l().filter(f=>f!==this),u=M.filter(f=>f.#d(d.dataset.sortKey));u.length&&(E.push({label:"",action:"",divider:!0}),u.forEach(f=>{const k=M.indexOf(f);E.push({label:f.getAttribute("move-label")??`Move to ${f.getAttribute("label")??`list ${k+1}`}`,action:`to:${k}`})})),customElements.whenDefined("esa-dropdown-menu").then(()=>{h.items=E})}),this.#s.observe(this,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-sort-actions"]}),this.#i){const d=this.#i;this.#i=null,requestAnimationFrame(()=>requestAnimationFrame(()=>{this.#t().find(b=>b.dataset.sortKey===d)?.querySelector("[data-sort-grip] button")?.focus()}))}}#c(o,t,d){const b=this.#t().find(w=>w.dataset.sortKey===o)?.dataset.sortLabel??"Row",h=d&&d!==this?` ${this.getAttribute("label")??"another list"},`:"";U(`${b} moved to${h} ${t.indexOf(o)+1} of ${t.length}.`),this.#i=o,this.dispatchEvent(new CustomEvent("sort-change",{detail:{order:t,key:o,from:d??this},bubbles:!0})),queueMicrotask(()=>this.#n())}#b=o=>{const t=o.detail,c=o.target.closest("[data-sort-grip]")?.closest("li");if(!c?.dataset.sortKey)return;if(t.startsWith("to:")){o.stopPropagation();const u=this.#l().filter(f=>f!==this)[Number(t.slice(3))];if(!u?.#e||!u.#d(c.dataset.sortKey))return;u.#e.append(c),u.#c(c.dataset.sortKey,u.#r(),this),queueMicrotask(()=>this.#n());return}if(!["up","down","top","bottom"].includes(t))return;o.stopPropagation();const b=this.#r(),h=c.dataset.sortKey,w=b.indexOf(h),y={up:w-1,down:w+1,top:0,bottom:b.length-1},x=Math.max(0,Math.min(b.length-1,y[t]));if(x===w)return;b.splice(w,1),b.splice(x,0,h);const E=this.#t(),M=E.filter(u=>u!==c)[x];M?M.before(c):E[E.length-1].after(c),this.#c(h,b)};#h=o=>{this.#a&&(this.#a=!1,o.stopPropagation(),o.preventDefault())};#f(o,t){if(o.button!==0)return;const d=o.clientY,c=o.clientX,b=this.#o,h=this.#r(),w={parent:t.parentElement,next:t.nextSibling};let y=!1,x=0,E=0;const M=(n,r)=>{const a=new Map(n.map(l=>[l,l.getBoundingClientRect()]));r(),!_()&&n.forEach(l=>{const i=l.getBoundingClientRect(),p=a.get(l).top-i.top,m=a.get(l).left-i.left;!p&&!m||(l.style.transition="none",l.style.transform=`translate(${m}px, ${p}px)`,requestAnimationFrame(()=>{l.style.transition="transform 150ms ease",l.style.transform=""}))})};let u=null;const f=(n,r)=>{if(this.getAttribute("drop")==="line"){u||(u=document.createElement("div"),u.className="bcn-sortable-drag-label",u.setAttribute("aria-hidden","true"),u.textContent=t.dataset.sortLabel??"",document.body.append(u)),u.style.transform=`translate(${Math.round(n+14)}px, ${Math.round(r+14)}px)`;return}t.style.transform="";const a=t.getBoundingClientRect();t.style.transform=b?`translate(${n-E-a.left}px, ${r-x-a.top}px)`:`translateY(${r-x-a.top}px)`},k=this.getAttribute("drop")==="line";let g=null,K=null,C=null;const R=n=>{K!==n&&(K?.removeAttribute("data-drop-into"),K=n,n?.setAttribute("data-drop-into",""))},P=(n,r,a)=>{const l=(n.#e??n).getBoundingClientRect(),i=a[a.length-1],p=r?r.getBoundingClientRect().top:i?i.getBoundingClientRect().bottom:l.top;g||(g=document.createElement("div"),g.className="bcn-sortable-drop-line",document.body.append(g)),g.hidden=!1,g.style.insetBlockStart=`${Math.round(p)}px`,g.style.insetInlineStart=`${Math.round(l.left)}px`,g.style.inlineSize=`${Math.round(l.width)}px`},J=(n,r,a)=>{const i=document.elementFromPoint(n,r)?.closest("li[data-sort-key]");if(!i||i===t||t.contains(i))return null;const p=a.find(s=>s.closest("li")===i),m=i.parentElement?.closest("bcn-sortable-list"),B=i.getBoundingClientRect().top,A=Array.from(i.querySelectorAll("bcn-sortable-list")).filter(s=>s.closest("li")===i&&s.getBoundingClientRect().height>0),S=A.length?Math.min(...A.map(s=>s.getBoundingClientRect().top)):i.getBoundingClientRect().bottom;if(r<B||r>S||S<=B)return null;const z=Math.min(10,(S-B)/4),e=r-B<z?"top":S-r<z?"bottom":"";return{row:i,inner:p,own:m&&a.includes(m)?m:void 0,edge:e}},q=(()=>{for(let n=this.parentElement;n;n=n.parentElement){const r=getComputedStyle(n).overflowY;if((r==="auto"||r==="scroll")&&n.scrollHeight>n.clientHeight)return n}return document.scrollingElement??null})();let $=null,L=0;const O=64,Y=()=>{if(L=0,!y||!$||!q)return;const n=q===document.scrollingElement?{top:0,bottom:window.innerHeight}:q.getBoundingClientRect(),r=Math.max(0,n.top+O-$.y),a=Math.max(0,$.y-(n.bottom-O)),l=Math.round((Math.min(O,a)-Math.min(O,r))/O*18);if(l){const i=q.scrollTop;q.scrollTop+=l,q.scrollTop!==i&&F(new PointerEvent("pointermove",{clientX:$.x,clientY:$.y}))}L=requestAnimationFrame(Y)},F=n=>{if(k&&n.isTrusted!==!1&&($={x:n.clientX,y:n.clientY}),!y){if((b?Math.hypot(n.clientX-c,n.clientY-d):Math.abs(n.clientY-d))<Q)return;y=!0,x=d-t.getBoundingClientRect().top,E=c-t.getBoundingClientRect().left,t.dataset.dragging="",this.dataset.sorting="",k&&!L&&(L=requestAnimationFrame(Y))}n.preventDefault();const r=n.clientY,a=n.clientX,l=this.#l().filter(e=>e.#d(t.dataset.sortKey)&&!t.contains(e));if(k){const e=J(a,r,l);if(e&&(e.inner||e.own)){const s=e.own?e.own.#t().filter(v=>v!==t):[];if(e.own&&(e.edge==="top"||!e.inner)){const v=e.edge==="bottom"?s[s.indexOf(e.row)+1]:e.row;C={target:e.own,next:v},R(null),P(e.own,v,s)}else if(e.own&&e.edge==="bottom"&&e.inner&&!e.inner.#t().some(v=>v!==t&&v.getBoundingClientRect().height>0)){const v=s[s.indexOf(e.row)+1];C={target:e.own,next:v},R(null),P(e.own,v,s)}else e.inner&&(C={target:e.inner},R(e.row),g&&(g.hidden=!0));f(a,r);return}}const i=e=>{const s=e.getBoundingClientRect();return r<s.top?s.top-r:r>s.bottom?r-s.bottom:0},p=l.reduce((e,s)=>{const v=i(s),G=i(e);return v<G||v===G&&e!==s&&e.contains(s)?s:e},t.closest("bcn-sortable-list")??this),m=p.#t().filter(e=>e!==t),B=l.flatMap(e=>e.#t()).filter(e=>e!==t),A=m.find(e=>{const s=e.getBoundingClientRect();return b?s.width?r<s.top||r<=s.bottom&&a<s.left+s.width/2:!1:r<s.top+s.height/2});if(k){C={target:p,next:A};const e=m.length?null:p.#e?.querySelector(":scope > li[data-sort-placeholder]");e&&e.getBoundingClientRect().height>0?(R(e),g&&(g.hidden=!0)):(R(null),P(p,A,m)),f(a,r);return}const S=t.parentElement===p.#e,z=S?p.#t()[p.#t().indexOf(t)+1]:void 0;(!S||A!==z)&&M(B,()=>{A?A.before(t):m.length?m[m.length-1].after(t):p.#e?.append(t)}),f(a,r)},H=n=>{if(window.removeEventListener("pointermove",F),window.removeEventListener("pointerup",D),window.removeEventListener("pointercancel",X),window.removeEventListener("keydown",I,!0),g?.remove(),g=null,u?.remove(),u=null,R(null),L&&cancelAnimationFrame(L),L=0,!y)return;if(k&&!n&&C){const{target:i,next:p}=C;p?p!==t&&t.nextElementSibling!==p&&p.before(t):i.#e&&!(t.parentElement===i.#e&&i.#t()[i.#t().length-1]===t)&&i.#e.append(t)}C=null,this.#a=!0,setTimeout(()=>this.#a=!1,0),delete t.dataset.dragging,delete this.dataset.sorting,t.style.transition=_()?"":"transform 150ms ease",t.style.transform="",t.addEventListener("transitionend",()=>t.style.transition="",{once:!0});const r=t.dataset.sortKey;if(n){w.parent.insertBefore(t,w.next);return}const a=t.closest("bcn-sortable-list");if(a&&a!==this){a.#c(r,a.#r(),this),queueMicrotask(()=>this.#n());return}const l=this.#r();l.join()!==h.join()&&this.#c(r,l)},D=()=>H(!1),X=()=>H(!0),I=n=>{n.key==="Escape"&&y&&(n.preventDefault(),n.stopPropagation(),H(!0))};window.addEventListener("pointermove",F),window.addEventListener("pointerup",D),window.addEventListener("pointercancel",X),window.addEventListener("keydown",I,!0)}}customElements.get("bcn-sortable-list")||customElements.define("bcn-sortable-list",N);
