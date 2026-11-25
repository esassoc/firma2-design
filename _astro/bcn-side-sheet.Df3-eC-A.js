import{E as k}from"./esa-side-dialog.CNnzC9hl.js";import{i as ot}from"./hugeicons-registry.DkuNnMpy.js";import"./bcn-edge-handle.DIxO6M6V.js";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const O=globalThis,L=O.ShadowRoot&&(O.ShadyCSS===void 0||O.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,D=Symbol(),q=new WeakMap;let tt=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==D)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(L&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=q.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&q.set(e,t))}return t}toString(){return this.cssText}};const at=r=>new tt(typeof r=="string"?r:r+"",void 0,D),ht=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new tt(e,r,D)},lt=(r,t)=>{if(L)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=O.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},W=L?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return at(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:dt,defineProperty:ct,getOwnPropertyDescriptor:pt,getOwnPropertyNames:ut,getOwnPropertySymbols:ft,getPrototypeOf:mt}=Object,M=globalThis,V=M.trustedTypes,$t=V?V.emptyScript:"",gt=M.reactiveElementPolyfillSupport,E=(r,t)=>r,z={toAttribute(r,t){switch(t){case Boolean:r=r?$t:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},et=(r,t)=>!dt(r,t),F={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:et};Symbol.metadata??=Symbol("metadata"),M.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=F){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ct(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=pt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){const l=i?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??F}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;const t=mt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){const e=this.properties,s=[...ut(e),...ft(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(W(i))}else t!==void 0&&e.push(W(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const n=(s.converter?.toAttribute!==void 0?s.converter:z).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:z;this._$Em=i;const l=o.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){const o=this.constructor;if(i===!1&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??et)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,n]of s){const{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[E("elementProperties")]=new Map,v[E("finalized")]=new Map,gt?.({ReactiveElement:v}),(M.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const B=globalThis,K=r=>r,U=B.trustedTypes,Z=U?U.createPolicy("lit-html",{createHTML:r=>r}):void 0,st="$lit$",m=`lit$${Math.random().toFixed(9).slice(2)}$`,it="?"+m,_t=`<${it}>`,_=document,w=()=>_.createComment(""),S=r=>r===null||typeof r!="object"&&typeof r!="function",I=Array.isArray,vt=r=>I(r)||typeof r?.[Symbol.iterator]=="function",R=`[ 	
\f\r]`,y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,G=/-->/g,J=/>/g,$=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Q=/'/g,X=/"/g,rt=/^(?:script|style|textarea|title)$/i,b=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Y=new WeakMap,g=_.createTreeWalker(_,129);function nt(r,t){if(!I(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Z!==void 0?Z.createHTML(t):t}const bt=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=y;for(let l=0;l<e;l++){const a=r[l];let d,p,h=-1,u=0;for(;u<a.length&&(o.lastIndex=u,p=o.exec(a),p!==null);)u=o.lastIndex,o===y?p[1]==="!--"?o=G:p[1]!==void 0?o=J:p[2]!==void 0?(rt.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=$):p[3]!==void 0&&(o=$):o===$?p[0]===">"?(o=i??y,h=-1):p[1]===void 0?h=-2:(h=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?$:p[3]==='"'?X:Q):o===X||o===Q?o=$:o===G||o===J?o=y:(o=$,i=void 0);const f=o===$&&r[l+1].startsWith("/>")?" ":"";n+=o===y?a+_t:h>=0?(s.push(d),a.slice(0,h)+st+a.slice(h)+m+f):a+m+(h===-2?l:f)}return[nt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class x{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,p]=bt(t,e);if(this.el=x.createElement(d,s),g.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=g.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(st)){const u=p[o++],f=i.getAttribute(h).split(m),P=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:P[2],strings:f,ctor:P[1]==="."?yt:P[1]==="?"?Et:P[1]==="@"?wt:H}),i.removeAttribute(h)}else h.startsWith(m)&&(a.push({type:6,index:n}),i.removeAttribute(h));if(rt.test(i.tagName)){const h=i.textContent.split(m),u=h.length-1;if(u>0){i.textContent=U?U.emptyScript:"";for(let f=0;f<u;f++)i.append(h[f],w()),g.nextNode(),a.push({type:2,index:++n});i.append(h[u],w())}}}else if(i.nodeType===8)if(i.data===it)a.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(m,h+1))!==-1;)a.push({type:7,index:n}),h+=m.length-1}n++}}static createElement(t,e){const s=_.createElement("template");return s.innerHTML=t,s}}function A(r,t,e=r,s){if(t===b)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl;const n=S(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=A(r,i._$AS(r,t.values),i,s)),t}class At{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??_).importNode(e,!0);g.currentNode=i;let n=g.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new C(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new St(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=g.nextNode(),o++)}return g.currentNode=_,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class C{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=A(this,t,e),S(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==b&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&S(this._$AH)?this._$AA.nextSibling.data=t:this.T(_.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=x.createElement(nt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const n=new At(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=Y.get(t.strings);return e===void 0&&Y.set(t.strings,e=new x(t)),e}k(t){I(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new C(this.O(w()),this.O(w()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=K(t).nextSibling;K(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=A(this,t,e,0),o=!S(t)||t!==this._$AH&&t!==b,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=A(this,l[s+a],e,a),d===b&&(d=this._$AH[a]),o||=!S(d)||d!==this._$AH[a],d===c?t=c:t!==c&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class yt extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}}class Et extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}}class wt extends H{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=A(this,t,e,0)??c)===b)return;const s=this._$AH,i=t===c&&s!==c||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==c&&(s===c||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class St{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){A(this,t)}}const xt=B.litHtmlPolyfillSupport;xt?.(x,C),(B.litHtmlVersions??=[]).push("3.3.3");const Ct=(r,t,e)=>{const s=e?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const n=e?.renderBefore??null;s._$litPart$=i=new C(t.insertBefore(w(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=globalThis;class T extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ct(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}}T._$litElement$=!0,T.finalized=!0,j.litElementHydrateSupport?.({LitElement:T});const Pt=j.litElementPolyfillSupport;Pt?.({LitElement:T});(j.litElementVersions??=[]).push("4.2.2");const N="(max-width: 64rem)";class kt extends k{static styles=[...Array.isArray(k.styles)?k.styles:[k.styles],ht`
      :host {
        position: fixed;
        /* Straight under the app bar, even on a page with a record bar: the
           sheet sits outside the pane, and the record bar narrows with the
           pane to end where the sheet begins. */
        inset-block-start: calc(var(--firma2-gutter, 0px) + var(--firma2-band-height, 48px));
        /* Down to the pane's foot, not the window's: the utility bar
           (firma2-utility-bar) runs under the pane, and a sheet to the window
           edge covered its Recent, Help and Shortcuts. */
        inset-block-end: max(var(--firma2-gutter, 0px), var(--firma2-utility-height, 0px));
        /* Inside the pane's scrollbar, as a rail in the pane would be. */
        inset-inline-end: calc(var(--firma2-gutter, 0px) + var(--firma2-pane-scrollbar, 0px));
        inline-size: var(--firma2-side-sheet-width, var(--firma2-side-sheet-size, 400px));
        box-sizing: border-box;
        z-index: calc(var(--z-header, 200) + 1);
        /* The rail's surface and hairline (user, 2026-11-16): a sheet stands in
           the rail's slot, so it paints what firma2-rail paints — neutral
           step 2 in both modes and a subtle leading border. */
        border-end-end-radius: var(--radius-lg, 12px);
        border-inline-start: var(--border-width-default, 1px) solid var(--color-border-default-subtle);
        background: var(--firma2-neutral-2, var(--color-background-default, #f8f8f8));
        overflow: visible;
        transition: inline-size var(--transition-base, 200ms ease);
      }
      :host(:not([open])) {
        display: none;
      }
      :host([data-resizing]) {
        transition: none;
      }

      /* The dialog fills the host; the host is the box. */
      dialog.panel {
        position: static;
        inline-size: 100%;
        block-size: 100%;
        border-radius: inherit;
        background: transparent;
        box-shadow: none;
        animation: none;
        transition: none;
      }

      /* ---- THE STRIP ---- firma2-rail's --_collapsed: the toggle and its margins. */
      :host([collapsed]) {
        inline-size: calc(2.5rem + 2 * var(--spacing-200, 0.5rem) + var(--border-width-default, 1px));
      }
      /* Taking a rail's place: the strip's part is played by the rail's width. */
      :host([collapsed][data-from-rail]) {
        inline-size: var(--firma2-side-sheet-from);
      }
      :host([collapsed]) dialog.panel,
      :host([data-opening]) dialog.panel {
        display: none;
      }
      /* The content fades in once the width has landed. */
      dialog.panel {
        animation: bcn-side-sheet-in var(--transition-base, 200ms ease);
      }
      @keyframes bcn-side-sheet-in {
        from {
          opacity: 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        dialog.panel {
          animation: none;
        }
      }

      /* ---- THE TOGGLE ---- firma2-rail__toggle, restated: inside, at the
         header's trailing end; the sheet is anchored there, so it stays put
         as the sheet eases to the strip that keeps it. */
      .toggle {
        position: absolute;
        inset-block-start: var(--spacing-300, 0.75rem);
        inset-inline-end: var(--spacing-500, 1.5rem);
        z-index: 1;
        display: grid;
        place-items: center;
        inline-size: 40px;
        block-size: 40px;
        padding: 0;
        border: var(--border-width-default, 1px) solid transparent;
        border-radius: var(--radius-sm, 4px);
        background: transparent;
        color: var(--color-content-default, #202020);
        cursor: pointer;
        transition: inset-inline-end var(--transition-base, 200ms ease);
      }
      :host([collapsed]) .toggle {
        inset-inline-end: var(--spacing-200, 0.5rem);
      }
      @media (hover: hover) and (pointer: fine) {
        .toggle:hover {
          background: var(--color-background-elevation-sunken, #f0f0f0);
        }
      }

      .toggle:active {
        background: var(--color-background-elevation-sunken, #f0f0f0);
      }
      .toggle:focus-visible {
        outline: var(--focus-ring-width, 2px) solid var(--focus-ring-color, #3e9b4f);
        outline-offset: var(--focus-ring-offset, 2px);
      }
      .header {
        padding-inline-end: calc(var(--spacing-500, 1.5rem) + 40px + var(--spacing-200, 0.5rem));
      }

      /* NO ROOM FOR TWO COLUMNS: over the pane, still under the bar and
         without a scrim. */
      @media (max-width: 64rem) {
        :host {
          inset-inline-start: var(--firma2-pane-start, 0px);
          inline-size: auto;
          border-inline-start: none;
          border-end-start-radius: var(--radius-lg, 12px);
          transition: none;
        }
        ::slotted(bcn-edge-handle) {
          display: none;
        }
      }
    `];#s=null;#t=0;#e=null;#i=null;constructor(){super(),this.showCloseButton=!1}connectedCallback(){if(super.connectedCallback(),this.addEventListener("keydown",this.#h),!this.querySelector(":scope > bcn-edge-handle")){const t=document.createElement("bcn-edge-handle");t.setAttribute("edge","start"),t.setAttribute("size-var","--firma2-side-sheet-width"),t.setAttribute("size-host",".firma2-app-frame"),t.setAttribute("min","320"),t.setAttribute("max","640"),t.setAttribute("label","side sheet"),t.setAttribute("storage-key","side-sheet"),t.slot="grip",this.append(t)}}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.#h)}#r(){return this.renderRoot.querySelector("dialog")}firstUpdated(){this.#r()?.removeAttribute("closedby");const t=document.createElement("button");t.type="button",t.className="toggle",t.innerHTML=ot("panel-right",18)??"",t.addEventListener("click",()=>this.close()),this.#e=t,this.#n();const e=document.createElement("slot");e.name="grip",this.renderRoot.append(t,e)}updated(t){if(t.has("heading")&&this.#n(),!t.has("open")&&!t.has("closing"))return;const e=this.#r();if(!e)return;const s=this.open||this.closing;s&&!e.open?e.show():!s&&e.open&&e.close()}#n(){if(!this.#e)return;const t=`Close ${(this.heading||"side sheet").toLowerCase()}`;this.#e.setAttribute("aria-label",t),this.#e.title=t}#o(){const t=this.closest(".firma2-app-frame");t?.setAttribute("data-sheet-swapping",""),requestAnimationFrame(()=>requestAnimationFrame(()=>t?.removeAttribute("data-sheet-swapping")))}#a(){const t=this.getAnimations().find(e=>["inline-size","width"].includes(e.transitionProperty));return t?t.finished.then(()=>{},()=>{}):Promise.resolve()}show(){document.querySelectorAll("bcn-side-sheet[open]").forEach(l=>l!==this&&l.close());const t=document.activeElement;this.#s=t instanceof HTMLElement&&t!==document.body&&!this.contains(t)?t:this.#s;const e=this.closest(".firma2-app-frame"),s=getComputedStyle(this).getPropertyValue("--_width").trim();s&&e?.style.setProperty("--firma2-side-sheet-size",s);const i=e?.querySelector(".esa-app-shell__content");i&&(e.style.setProperty("--firma2-pane-scrollbar",`${i.offsetWidth-i.clientWidth}px`),e.style.setProperty("--firma2-pane-start",`${Math.round(i.getBoundingClientRect().left)}px`));const n=matchMedia(N).matches?null:(e??document).querySelector("[data-rail][data-sheet-over], [data-rail]:not([hidden]):not([data-unpinned])");n&&!this.open&&(n.hasAttribute("data-sheet-over")||(e?.style.setProperty("--firma2-side-sheet-from",`${Math.round(n.getBoundingClientRect().width)}px`),n.setAttribute("data-sheet-over","")),this.#i=n,this.setAttribute("data-from-rail",""),this.#o());const o=++this.#t;if(this.open||matchMedia(N).matches){this.removeAttribute("collapsed"),super.show();return}this.setAttribute("collapsed",""),super.show(),this.updateComplete.then(()=>{o===this.#t&&(this.offsetWidth,e?.removeAttribute("data-sheet-swapping"),this.dataset.opening="",this.removeAttribute("collapsed"),this.#a().then(()=>{o===this.#t&&(delete this.dataset.opening,this.matches(":focus-within")||this.#e?.focus())}))})}close(){if(!this.open)return;const t=this.matches(":focus-within"),e=++this.#t,s=()=>{if(e!==this.#t)return;super.close(),this.removeAttribute("collapsed"),this.removeAttribute("data-from-rail"),delete this.dataset.opening;const i=[...document.querySelectorAll("bcn-side-sheet")].some(n=>n!==this&&n.open);this.#i&&!i&&(this.#o(),this.#i.removeAttribute("data-sheet-over")),this.#i=null,t&&this.#s?.isConnected&&this.#s.focus()};if(matchMedia(N).matches){s();return}this.setAttribute("collapsed",""),this.#a().then(s)}#h=t=>{t.key!=="Escape"||t.defaultPrevented||!this.open||(t.preventDefault(),this.close())}}customElements.get("bcn-side-sheet")||customElements.define("bcn-side-sheet",kt);
