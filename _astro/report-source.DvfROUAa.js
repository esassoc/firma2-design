const p=a=>a.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),n=a=>/pdf/i.test(a.fileType??"")||/\.pdf$/i.test(a.name),l=(a,e)=>{const s=a.querySelector("[data-source-name]"),t=a.querySelector("[data-source-body]");if(!(!s||!t)){if(s.textContent=e.name,a.dataset.sourceKind=e.pages?"passages":e.fileUrl&&n(e)?"pdf":"none",e.pages){t.innerHTML=e.pages.map(i=>`
        <section class="firma2-report-source__page stack" data-gap="md">
          <p class="firma2-report-source__page-label typography-body-sm">${p(i.label)}</p>
          ${i.passages.map(o=>`
            <div class="firma2-report-source__passage stack" data-gap="2xs" data-passage="${p(o.id)}">
              ${o.heading?`<p class="typography-label-md-strong">${p(o.heading)}</p>`:""}
              ${o.lines.map(r=>`<p class="typography-body-md">${p(r)}</p>`).join("")}
            </div>`).join("")}
        </section>`).join("");return}if(e.fileUrl&&n(e)){t.innerHTML=`<iframe class="firma2-report-source__file" title="${p(e.name)}" src="${p(e.fileUrl)}"></iframe>`;return}t.innerHTML=`
    <div class="stack" data-gap="sm">
      <p class="typography-body-md">This file can’t be shown here.</p>
      <p class="firma2-report-source__quote typography-body-md" data-source-quote hidden></p>
    </div>`}},u=(a,e,s)=>{const t=a.querySelector("[data-source-body]");if(!t)return;if(t.querySelectorAll("[data-passage][data-current]").forEach(r=>r.removeAttribute("data-current")),s.passage){const r=t.querySelector(`[data-passage="${CSS.escape(s.passage)}"]`);if(r){r.setAttribute("data-current","");const c=r.offsetTop-t.offsetTop-16;t.scrollTo({top:Math.max(c,0),behavior:"auto"})}}const i=t.querySelector("iframe");if(i&&e.fileUrl&&s.page){const r=`${e.fileUrl}#page=${s.page}`;i.getAttribute("src")!==r&&i.setAttribute("src",r)}const o=t.querySelector("[data-source-quote]");o&&(o.textContent=s.quote??"",o.hidden=!s.quote)};export{l as p,u as s};
