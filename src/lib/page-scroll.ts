// The app's scroller. AppLayout makes the content pane the scroll container
// (the inset sheet), so `window.scrollTo` moves nothing inside the app; pages
// outside the shell still scroll the document, hence the fallback.
export const pageScroller = (): HTMLElement | Window =>
  document.querySelector<HTMLElement>('.esa-app-shell__content') ?? window;

export const scrollPageToTop = () => pageScroller().scrollTo({ top: 0 });
