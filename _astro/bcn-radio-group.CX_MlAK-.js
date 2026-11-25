import{E as n}from"./esa-radio-group.CBSIoHfh.js";const d=`
  /* Options with a sentence each need more air between them than bare labels
     do, or the sentence reads as belonging to the next option. */
  .items { gap: var(--spacing-400, 16px); }

  /* The base lays an option out as circle + label in a row. A grid keeps that
     first row as it was and puts the description under the LABEL, not under
     the circle. */
  .item {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: var(--spacing-200, 8px);
  }

  .item-desc {
    grid-column: 2;
    margin-block-start: var(--spacing-100, 4px);
    color: var(--color-content-default-secondary, #646464);
  }
`;let s=null;class c extends n{#e=!1;updated(){super.updated(),this.#t(),this.#s()}#t(){this.#e||!this.shadowRoot||(s??=new CSSStyleSheet,s.cssRules.length||s.replaceSync(d),this.shadowRoot.adoptedStyleSheets=[...this.shadowRoot.adoptedStyleSheets,s],this.#e=!0)}#s(){const a=this.renderRoot.querySelectorAll("label.item");this.options.forEach((o,r)=>{const t=a[r];if(!t)return;const i=t.querySelector('[role="radio"]');let e=t.querySelector(".item-desc");if(!o.description){e?.remove(),i?.removeAttribute("aria-describedby");return}e||(e=document.createElement("span"),e.className="item-desc typography-body-md",e.id=`opt-${r}-desc`,t.append(e)),e.textContent=o.description,i?.setAttribute("aria-describedby",e.id)})}}customElements.get("bcn-radio-group")||customElements.define("bcn-radio-group",c);
