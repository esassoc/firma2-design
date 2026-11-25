import{i as u}from"./hugeicons-registry.DkuNnMpy.js";const p=`
  .esa-dropdown-menu__bullet[data-icon] {
    display: inline-flex;
    width: 18px;
    height: 18px;
    border-radius: 0;
    background: none;
    opacity: 1;
    color: var(--color-content-default-secondary, #646464);
  }
  .esa-dropdown-menu__item--danger .esa-dropdown-menu__bullet[data-icon] { color: inherit; }
  .esa-dropdown-menu__bullet[data-icon] svg { display: block; }
  .esa-dropdown-menu__bullet[data-icon=''] { display: none; }
`;let i;const l=new WeakSet;function _(o){const e=o.shadowRoot;if(!e||l.has(o))return;l.add(o),i??=(()=>{const t=new CSSStyleSheet;return t.replaceSync(p),t})(),e.adoptedStyleSheets=[...e.adoptedStyleSheets,i];const s=()=>{const t=(o.items??[]).filter(d=>!d.divider);e.querySelectorAll(".esa-dropdown-menu__item").forEach((d,c)=>{const n=d.querySelector(".esa-dropdown-menu__bullet"),r=t[c]?.icon;if(!n||!r||n.dataset.icon!==void 0)return;const a=u(r,18);n.dataset.icon=a?r:"",a&&(n.innerHTML=a)})};new MutationObserver(s).observe(e,{childList:!0,subtree:!0}),s()}export{_ as d};
