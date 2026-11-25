import{f as m}from"./geospatial-areas.CE5csAVO.js";import{o as c,a as p}from"./work-areas.CGaAEOso.js";import"./firma2-projects.C39EMZfa.js";import"./geo.9W3-G_ti.js";import"./firma2-project-detail.D2I3k4ea.js";import"./firma2-publish-history.DXmpO5-w.js";import"./firma2-project-types.CILPCDkd.js";import"./firma2-funding-sources.B1JcX38J.js";const s=e=>e.replace(/[&<>"]/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[n]);document.querySelectorAll(".firma2-area-groups").forEach(e=>{const n=e.querySelector("[data-rows]"),d=e.querySelector("[data-table]"),i=e.querySelector("[data-none]"),o=()=>{const r=p();d.hidden=!r.length,i.hidden=!!r.length,n.innerHTML=r.map(a=>{const t=m(a),l=`${e.dataset.recordHref}?id=${encodeURIComponent(a.id)}`;return`<tr data-slug="${s(a.id)}">
            <th scope="row">
              <a class="firma2-settings-table__name" href="${s(l)}">${s(a.name)}</a>
              ${a.description?`<span class="firma2-settings-table__meta typography-body-sm">${s(a.description)}</span>`:""}
            </th>
            <td>${t.layer?s(t.layer.name):"<span data-problem>Layer deleted</span>"}</td>
            <td class="firma2-settings-table__num">${t.status==="ok"?t.areas.length:t.status==="unread"?"<span data-problem>Not read</span>":"—"}</td>
            <td class="firma2-settings-table__num">${t.status==="ok"?t.filed:"—"}</td>
          </tr>`}).join("")};o(),c(o)});
