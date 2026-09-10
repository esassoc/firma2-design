const o=new CSSStyleSheet;o.replaceSync(`
  :host { --side-dialog-inset: 0px; }
  dialog.panel { height: auto; border-radius: 0; }
  :host([position='right']) dialog.panel { left: auto; }
  :host([position='left']) dialog.panel { right: auto; }
`);async function i(t){if(!t)return;await t.updateComplete;const e=t.shadowRoot;!e||e._f2SideDialogFixed||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,o],e._f2SideDialogFixed=!0)}export{i as f};
