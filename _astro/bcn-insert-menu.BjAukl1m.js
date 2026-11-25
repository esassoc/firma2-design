const a=r=>r.replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),d=`
  bcn-insert-menu {
    position: fixed;
    z-index: var(--z-popover, 1000);
    min-width: 16rem;
    max-height: 22rem;
    overflow-y: auto;
    padding: var(--spacing-100);
    background: var(--color-background-elevation-raised);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    box-shadow: var(--elevation-4, 0 8px 24px rgb(0 0 0 / 0.12));
  }
  bcn-insert-menu:not([open]) { display: none; }
  bcn-insert-menu:focus-visible {
    outline: 2px solid var(--color-border-default-focus);
    outline-offset: 2px;
  }
  bcn-insert-menu .bcn-insert-menu__group {
    margin: 0;
    padding: var(--spacing-200) var(--spacing-300) var(--spacing-100);
    color: var(--color-text-secondary);
  }
  bcn-insert-menu .bcn-insert-menu__option {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-300);
    padding: var(--spacing-200) var(--spacing-300);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background var(--transition-fast, 150ms ease);
  }
  bcn-insert-menu .bcn-insert-menu__option[aria-selected='true'] {
    background: var(--color-background-elevation-sunken);
  }
  bcn-insert-menu .bcn-insert-menu__option[aria-disabled='true'] {
    color: var(--color-text-secondary);
    cursor: default;
  }
  bcn-insert-menu .bcn-insert-menu__empty {
    margin: 0;
    padding: var(--spacing-200) var(--spacing-300);
    color: var(--color-text-secondary);
  }
  @media (prefers-reduced-motion: reduce) {
    bcn-insert-menu .bcn-insert-menu__option { transition: none; }
  }
`;let c=!1;function l(){if(c)return;const r=document.createElement("style");r.dataset.bcnInsertMenu="",r.textContent=d,document.head.appendChild(r),c=!0}let u=0;class h extends HTMLElement{items=[];#s=[];#t=0;#e=null;#i="";#n=`bcn-insert-${++u}`;connectedCallback(){l(),this.setAttribute("role","listbox"),this.id||(this.id=this.#n),this.addEventListener("mousedown",t=>t.preventDefault()),this.addEventListener("mousemove",this.#l),this.addEventListener("click",this.#u),this.addEventListener("keydown",t=>this.handleKey(t)),document.addEventListener("pointerdown",this.#c,!0)}disconnectedCallback(){document.removeEventListener("pointerdown",this.#c,!0)}get isOpen(){return this.hasAttribute("open")}get owner(){return this.#e}open(t,{owner:e,query:s=""}={}){this.#e?.setAttribute("aria-expanded","false"),this.#e=e??null,this.#t=-1,this.setAttribute("open",""),this.filter(s);const i=t instanceof Element?t.getBoundingClientRect():t,n=this.offsetHeight,o=i.bottom+4;this.style.left=`${Math.max(8,Math.min(i.left,window.innerWidth-this.offsetWidth-8))}px`,this.style.top=`${o+n>window.innerHeight-8&&i.top-n-4>8?i.top-n-4:o}px`,e?(e.setAttribute("aria-controls",this.id),e.setAttribute("aria-expanded","true")):(this.tabIndex=-1,this.focus())}filter(t){this.#i=t;const e=t.trim().toLowerCase();this.#s=this.items.filter(s=>!e||s.label.toLowerCase().includes(e)||s.group.toLowerCase().includes(e)),(this.#t<0||!this.#r(this.#t))&&(this.#t=this.#s.findIndex(s=>!s.disabled)),this.#a()}close(){this.isOpen&&(this.removeAttribute("open"),this.#e?.setAttribute("aria-expanded","false"),this.#e?.removeAttribute("aria-activedescendant"),this.#e=null,this.dispatchEvent(new CustomEvent("insert-close")))}handleKey(t){return this.isOpen?t.key==="ArrowDown"||t.key==="ArrowUp"?(t.preventDefault(),this.#d(t.key==="ArrowDown"?1:-1),!0):t.key==="Enter"?(t.preventDefault(),this.#o(this.#t),!0):t.key==="Escape"?(t.preventDefault(),t.stopPropagation(),this.close(),!0):(t.key==="Tab"&&this.close(),!this.#e&&!t.metaKey&&!t.ctrlKey&&!t.altKey&&(t.key.length===1||t.key==="Backspace")?(t.preventDefault(),this.filter(t.key==="Backspace"?this.#i.slice(0,-1):this.#i+t.key),!0):!1):!1}#r(t){return t>=0&&t<this.#s.length&&!this.#s[t].disabled}#d(t){const e=this.#s.length;if(!this.#s.some(i=>!i.disabled))return;let s=this.#t;do s=(s+t+e)%e;while(!this.#r(s));this.#t=s,this.#a()}#o(t){if(!this.#r(t))return;const{id:e}=this.#s[t];this.close(),this.dispatchEvent(new CustomEvent("insert-choose",{detail:{id:e}}))}#a(){if(!this.#s.length){this.innerHTML=`<p class="bcn-insert-menu__empty typography-body-md">Nothing matches “${a(this.#i)}”.</p>`,this.#e?.removeAttribute("aria-activedescendant");return}let t="",e="";this.#s.forEach((i,n)=>{i.group!==e&&(e=i.group,t+=`<p class="bcn-insert-menu__group typography-label-md-strong" role="presentation">${a(e)}</p>`);const o=i.note?`<span class="typography-body-sm">${a(i.note)}</span>`:"";t+=`<div class="bcn-insert-menu__option typography-body-md" role="option" id="${this.#n}-opt-${n}" data-i="${n}" aria-selected="${n===this.#t}"${i.disabled?' aria-disabled="true"':""}><span>${a(i.label)}</span>${o}</div>`}),this.innerHTML=t;const s=this.querySelector(`#${this.#n}-opt-${this.#t}`);s&&(this.#e?.setAttribute("aria-activedescendant",s.id),s.scrollIntoView({block:"nearest"}))}#l=t=>{const e=t.target.closest("[data-i]"),s=Number(e?.dataset.i);!e||s===this.#t||!this.#r(s)||(this.querySelector(`#${this.#n}-opt-${this.#t}`)?.setAttribute("aria-selected","false"),this.#t=s,e.setAttribute("aria-selected","true"),this.#e?.setAttribute("aria-activedescendant",e.id))};#u=t=>{const e=t.target.closest("[data-i]");e&&this.#o(Number(e.dataset.i))};#c=t=>{if(!this.isOpen)return;const e=t.target;this.contains(e)||this.#e?.contains(e)||e.closest?.("[data-insert-trigger]")||this.close()}}customElements.get("bcn-insert-menu")||customElements.define("bcn-insert-menu",h);
