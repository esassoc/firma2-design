function H(o,t){const r=document.querySelector(o);r&&(r.value=t,r.dispatchEvent(new Event("input",{bubbles:!0})))}function K(o){for(const t of o||[])t.click?document.querySelector(t.click)?.click():t.fill?H(t.fill[0],t.fill[1]):t.clear?H(t.clear,""):t.clickText?[...document.querySelector(t.clickText[0])?.querySelectorAll("button")??[]].find(a=>a.textContent?.trim().includes(t.clickText[1]))?.click():t.key&&document.dispatchEvent(new KeyboardEvent("keydown",{key:t.key,bubbles:!0}))}const f=o=>String(o).replace(/[&<>]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[t]),U=o=>/^(#[0-9a-f]{3,8}|rgba?\([\d.,\s%/]+\)|hsla?\([\d.,\s%/]+\))$/i.test(String(o).trim());function G(o){return o.replace(/("[^"]*"|'[^']*')/g,'<span class="s">$1</span>').replace(/(var\()(--[\w-]+)/g,'$1<span class="t">$2</span>').replace(/(#[0-9a-fA-F]{3,8})\b/g,'<span class="n">$1</span>')}function O(o){return f(o).split(`
`).map(t=>{if(/\{\s*$/.test(t))return t.replace(/^(\s*)(.+?)(\s*\{)\s*$/,'$1<span class="sel">$2</span>$3');const r=t.match(/^(\s*)([\w-]+)(\s*:\s*)(.+?)(;?)\s*$/);return r?`${r[1]}<span class="p">${r[2]}</span>${r[3]}${G(r[4])}${r[5]}`:t}).join(`
`)}function Y(o){return f(o).replace(/("[^"]*")/g,'<span class="s">$1</span>').replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g,'$1<span class="tag">$2</span>')}function R(o){if(!o||!o.length)return'<p class="hint">No design tokens in this section.</p>';const t={};for(const a of o)(t[a.tier]=t[a.tier]||[]).push(a);return["brand","semantic","component","primitive"].filter(a=>t[a]).map(a=>`
      <div class="tgroup">
        <div class="tgroup__h">${a} <span>${t[a].length}</span></div>
        ${t[a].map(c=>`<div class="tok">
              <span class="tok__name">${U(c.value)?`<i style="background:${f(c.value)}"></i>`:""}<code>${f(c.name)}</code></span>
              <span class="tok__val">${f(c.value)}</span>
            </div>`).join("")}
      </div>`).join("")}function V(o){if(!o||!Object.keys(o).length)return'<p class="hint">No design guidance authored for this section.</p>';const t=(r,a)=>a?.length?`<div class="g"><div class="g__h">${r}</div><ul>${a.map(c=>`<li>${f(c)}</li>`).join("")}</ul></div>`:"";return[o.intent?`<p class="g__intent">${f(o.intent)}</p>`:"",t("Key decisions",o.decisions),t("Gotchas",o.gotchas),t("Done when",o.acceptance)].join("")}const W=`
  :host { all: initial; }
  /* The hidden attribute must win over the explicit display on .launch/.panel,
     otherwise the toggle is defeated by specificity. */
  [hidden] { display: none !important; }
  .host-root { position: fixed; inset: 0; pointer-events: none; z-index: 2147483000;
    font-family: system-ui, sans-serif; }
  .host-root > * { pointer-events: auto; }
  .launch { position: fixed; bottom: 22px; left: 22px; display: inline-flex; align-items: center; gap: 9px;
    padding: 13px 19px; border-radius: 999px; color: #fff; cursor: pointer; font-size: 15px; font-weight: 600;
    letter-spacing: .01em; border: 1px solid #3d6fd6;
    background: linear-gradient(180deg, #1f6feb, #1551c4);
    box-shadow: 0 10px 28px -8px rgba(31,111,235,.65), inset 0 1px 0 rgba(255,255,255,.18);
    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease; }
  .launch:hover { transform: translateY(-2px); filter: brightness(1.07);
    box-shadow: 0 16px 36px -8px rgba(31,111,235,.75), inset 0 1px 0 rgba(255,255,255,.25); }
  .launch:active { transform: translateY(0); }
  .launch svg { flex: none; }
  /* Full-height glass panel, inset from the edges. */
  .panel { position: fixed; top: 18px; right: 18px; bottom: 18px; width: min(720px, 94vw);
    display: flex; flex-direction: column; color: #ffffff; border-radius: 16px;
    background: linear-gradient(155deg, rgba(26,31,40,.74), rgba(11,15,21,.86));
    backdrop-filter: blur(26px) saturate(150%); -webkit-backdrop-filter: blur(26px) saturate(150%);
    border: 1px solid rgba(255,255,255,.15);
    box-shadow: 0 28px 70px -18px rgba(0,0,0,.62), inset 0 1px 0 rgba(255,255,255,.10);
    font-size: 12.5px; overflow: hidden;
    /* slide in from the right */
    transform: translateX(calc(100% + 32px)); opacity: 0; visibility: hidden;
    transition: transform .3s cubic-bezier(.4,0,.2,1), opacity .22s ease, visibility 0s linear .3s; }
  .panel.is-open { transform: none; opacity: 1; visibility: visible;
    transition: transform .3s cubic-bezier(.4,0,.2,1), opacity .22s ease; }
  .head { display: flex; align-items: center; gap: 8px; padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,.09); }
  .head strong { font-size: 14px; }
  .head .sub { flex: 1; color: #ccd5e0; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .picker { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,.09); }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { padding: 5px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.04);
    color: #eef2f6; font: inherit; font-size: 12.5px; cursor: pointer; white-space: nowrap;
    transition: border-color .12s ease, background .12s ease, color .12s ease; }
  .chip:hover { color: #fff; border-color: rgba(255,255,255,.3); }
  .chip.on { background: rgba(31,111,235,.28); border-color: #4493f8; color: #fff; font-weight: 600; }
  .tabs { display: flex; gap: 4px; padding: 9px 14px; border-bottom: 1px solid rgba(255,255,255,.09); }
  .tabs button { padding: 5px 12px; border: 0; border-radius: 6px; background: none; color: #ccd5e0;
    font: inherit; font-size: 12.5px; cursor: pointer; }
  .tabs button.on { background: rgba(255,255,255,.12); color: #fff; }
  .body { overflow: auto; padding: 13px 16px; flex: 1; }
  /* Prominent action footer. */
  .footer { position: relative; display: flex; justify-content: flex-end; gap: 8px; padding: 11px 16px;
    border-top: 1px solid rgba(255,255,255,.10); background: rgba(0,0,0,.18); }
  .footer button { flex: none; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 8px 14px; border-radius: 8px; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; }
  .copy { color: #eef2f6; border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.05); }
  .copy:hover { color: #fff; border-color: rgba(255,255,255,.34); }
  .copy.done { color: #7ee787; border-color: #2ea043; }
  .claude { color: #fff; border: 1px solid #d97757;
    background: linear-gradient(180deg, #e0805f, #c25e3c);
    box-shadow: 0 6px 18px -6px rgba(217,119,87,.6), inset 0 1px 0 rgba(255,255,255,.2); }
  .claude svg { flex: none; }
  .claude:hover { filter: brightness(1.06); }
  .claude.done { background: linear-gradient(180deg, #2ea043, #238636); border-color: #2ea043; }
  /* Claude payload preview popover (anchored above the footer). */
  .cpreview { position: absolute; left: 16px; right: 16px; bottom: calc(100% + 8px);
    background: rgba(13,17,23,.96); border: 1px solid rgba(255,255,255,.16); border-radius: 12px;
    box-shadow: 0 18px 50px -14px rgba(0,0,0,.7); padding: 12px 14px; max-height: 50vh; overflow: auto; }
  .cpreview__h { display: flex; align-items: center; margin-bottom: 8px; color: #ccd5e0; font-size: 11px;
    letter-spacing: .04em; text-transform: uppercase; }
  .cpreview__copy { margin-left: auto; color: #e9a589; border: 1px solid #d9775766; border-radius: 6px;
    background: none; font: inherit; font-size: 11.5px; padding: 3px 9px; cursor: pointer; text-transform: none; letter-spacing: 0; }
  .cpreview__copy:hover { color: #fff; border-color: #d97757; }
  .cpreview pre { margin: 0; white-space: pre-wrap; word-break: break-word; line-height: 1.55;
    color: #eef2f6; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px; }
  .hint { margin: 0; color: #c4cdd8; line-height: 1.6; }
  pre.code { margin: 0; white-space: pre-wrap; word-break: break-word; line-height: 1.55; tab-size: 2; color: #e3e9ef;
    font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  pre.code .tag { color: #7ee787; }
  pre.code .s   { color: #a5d6ff; }
  pre.code .sel { color: #d2a8ff; }
  pre.code .p   { color: #79c0ff; }
  pre.code .t   { color: #ffa657; }
  pre.code .n   { color: #f0883e; }
  pre.code .c   { color: #8d97a3; font-style: italic; }
  .g { margin-bottom: 14px; }
  .g__intent { margin: 0 0 14px; color: #ffffff; line-height: 1.6; font-size: 13px; }
  .g__h { color: #c4cdd8; font-size: 11px; letter-spacing: .04em; text-transform: uppercase; margin-bottom: 6px; }
  .g ul { margin: 0 0 2px; padding-left: 18px; }
  .g li { color: #e3e9ef; line-height: 1.55; margin-bottom: 5px; }
  .tgroup { margin-bottom: 14px; }
  .tgroup__h { text-transform: capitalize; color: #c4cdd8; font-size: 11px; letter-spacing: .04em; margin-bottom: 6px; }
  .tgroup__h span { color: #7a8492; }
  .tok { display: flex; flex-direction: column; gap: 2px; padding: 6px 0; border-bottom: 1px solid #161b22; }
  .tok__name { display: flex; align-items: center; gap: 8px; }
  .tok__name i { width: 14px; height: 14px; border-radius: 3px; border: 1px solid #ffffff22; flex: none; }
  .tok__name code { color: #ffffff; font-family: ui-monospace, monospace; }
  .tok__val { color: #c4cdd8; padding-left: 22px; word-break: break-all; font-family: ui-monospace, monospace; }
  .x { border: 0; background: none; color: #c4cdd8; font-size: 20px; line-height: 1; cursor: pointer; }
  .x:hover { color: #fff; }
`,P="handoff-inspector";function X(){const o="/firma2-design/";let t=location.pathname;return t.startsWith(o)&&(t=t.slice(o.length)),t=t.replace(/^\/|\/$/g,""),t.replace(/\//g,"-")||"index"}const Z=o=>`/firma2-design/handoff/${o}/manifest.json`;function J(){if(document.getElementById(P))return;const o=Z(X());fetch(o).then(t=>t.ok?t.json():Promise.reject()).then(t=>Q(t,o)).catch(()=>{})}function Q(o,t){const r=document.createElement("div");r.id=P;const a=r.attachShadow({mode:"open"});document.documentElement.appendChild(r);const c=document.createElement("style");c.textContent=`
    [data-handoff-on] { outline: 2px solid #4493f8 !important; outline-offset: -2px;
      scroll-margin: 80px; }`;const I=t.replace(/manifest\.json.*$/,""),$=document.createElement("style");$.textContent=W;const s=document.createElement("div");s.className="host-root",s.innerHTML=`
    <button class="launch" title="Inspect this prototype (⌥⇧I)">
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 9 3 3-3 3"/><path d="M14 15h3"/><rect width="18" height="16" x="3" y="4" rx="2"/></svg>
      Inspect
    </button>
    <div class="panel">
      <div class="head"><strong>Inspector</strong><span class="sub"></span><button class="x" title="Close (Esc)">×</button></div>
      <div class="picker"></div>
      <div class="tabs">
        <button data-tab="guide" class="on">Guide</button>
        <button data-tab="html">HTML</button>
        <button data-tab="css">CSS</button>
        <button data-tab="tokens">Tokens</button>
      </div>
      <div class="body"></div>
      <div class="footer">
        <div class="cpreview" hidden>
          <div class="cpreview__h">Prompt handed to Claude<button class="cpreview__copy">Copy prompt</button></div>
          <pre></pre>
        </div>
        <button class="copy" title="Copy the active tab's raw content">Copy</button>
        <button class="claude" title="Preview the prompt for Claude">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/></svg>
          for Claude
        </button>
      </div>
    </div>`,a.append($,s);const S=s.querySelector(".launch"),_=s.querySelector(".panel"),C=s.querySelector(".sub"),m=s.querySelector(".picker"),g=s.querySelector(".body"),T=[...s.querySelectorAll(".tabs button[data-tab]")],b=s.querySelector(".copy"),A=s.querySelector(".claude"),y=s.querySelector(".cpreview"),B=s.querySelector(".cpreview pre"),v=s.querySelector(".cpreview__copy"),q=()=>document.querySelectorAll("[data-handoff-on]").forEach(e=>e.removeAttribute("data-handoff-on")),E=e=>{q(),e&&document.querySelector(e)?.setAttribute("data-handoff-on","")};let n=null,p="guide",u=!1,k=!1;function L(){if(b.textContent=`Copy ${p}`,!n){C.textContent=`${o.name} · ${o.sections.length} sections`,g.innerHTML='<p class="hint">Pick a section above to inspect its markup, styles, tokens, and design intent.</p>';return}C.textContent=n.tag&&n.tag!=="page"?`${n.label} · <${n.tag}>`:n.label,p==="html"?g.innerHTML=`<pre class="code">${Y(n.html)}</pre>`:p==="css"?g.innerHTML=n.css?`<pre class="code">${O(n.css)}</pre>`:'<p class="hint">No section-local CSS (inherited utilities only).</p>':p==="tokens"?g.innerHTML=R(n.tokens):g.innerHTML=V(n.guide)}const D=()=>[...m.querySelectorAll(".chips .chip")];function z(e,i=!1){if(n=o.sections[e]||null,D().forEach((d,l)=>d.classList.toggle("on",l===e)),w(),i&&u&&n?.apply){k=!0;const d=document.querySelector("[data-omni]");d&&!d.hasAttribute("hidden")&&document.querySelector("[data-omni-close]")?.click(),K(n.apply),k=!1}u&&E(n?.selector),L()}function F(){m.innerHTML='<div class="chips"></div>';const e=m.querySelector(".chips");o.sections.forEach((i,d)=>{const l=document.createElement("button");l.className="chip",l.title=i.apply?`${i.label} — click to drive the app into this state`:i.label,l.textContent=i.label,l.onclick=()=>z(d,!0),e.appendChild(l)})}const M=e=>{!u||k||e.composedPath().includes(_)||h(!1)};function h(e){u=e,_.classList.toggle("is-open",e),S.hidden=e,e?(document.head.append(c),E(n?.selector),setTimeout(()=>document.addEventListener("click",M,!0),0)):(c.remove(),q(),document.removeEventListener("click",M,!0))}function N(){if(!n)return"";if(p==="html")return n.html||"";if(p==="css")return n.css||"";if(p==="tokens")return(n.tokens||[]).map(i=>`${i.name}: ${i.value};`).join(`
`);const e=n.guide||{};return[e.intent,e.decisions?.length&&`Key decisions:
${e.decisions.map(i=>`- ${i}`).join(`
`)}`,e.gotchas?.length&&`Gotchas:
${e.gotchas.map(i=>`- ${i}`).join(`
`)}`,e.acceptance?.length&&`Done when:
${e.acceptance.map(i=>`- ${i}`).join(`
`)}`].filter(Boolean).join(`

`)}const x=(e,i,d=!0)=>{const l=e.innerHTML;e.classList.toggle("done",d),e.textContent=i,setTimeout(()=>{e.innerHTML=l,e.classList.remove("done")},1300)};b.onclick=async()=>{const e=N();if(e)try{await navigator.clipboard.writeText(e),x(b,"Copied")}catch{x(b,"Failed",!1)}};function j(){if(!n?.claudePath)return"";const e=new URL(I+n.claudePath,location.origin).href,i=[`Here's a new UI section to build — "${n.label}".`,"","The linked spec has the design guidance (intent, key decisions, gotchas) plus sample","HTML and CSS. The finished UI should look and behave exactly like this — match it","faithfully. The sample code shows how it's built; you don't need to mirror it","line-for-line — translate it to your own stack and design system, mapping the","sample's values onto your established tokens.","","Spec — use whichever you can reach:",`• hosted: ${e}`];return n.repoPath&&i.push(`• in this repo: ${n.repoPath}`),i.join(`
`)}const w=()=>y.hidden=!0;A.onclick=()=>{if(n?.claudePath){if(!y.hidden)return w();B.textContent=j(),y.hidden=!1}},v.onclick=async()=>{try{await navigator.clipboard.writeText(j()),x(v,"Copied ✓")}catch{x(v,"Failed",!1)}},S.onclick=()=>h(!0),s.querySelector(".x").onclick=()=>h(!1),T.forEach(e=>e.onclick=()=>{p=e.dataset.tab,T.forEach(i=>i.classList.toggle("on",i===e)),w(),L()}),document.addEventListener("keydown",e=>{e.altKey&&e.shiftKey&&(e.key==="I"||e.key==="i")?(e.preventDefault(),h(!u)):e.key==="Escape"&&u&&(e.preventDefault(),h(!1))}),F(),z(0),new URLSearchParams(location.search).has("inspect")&&h(!0)}J();
