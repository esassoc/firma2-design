// The app-wide image viewer's one seam. firma2-lightbox (mounted once by
// BaseLayout) listens for this event; anything that wants a set of images shown
// full size dispatches it instead of drawing a viewer of its own.

export interface LightboxImage {
  /** The largest source there is for the image. */
  src: string;
  /** Read under the image; also its alt text in the viewer. */
  caption?: string;
  /** Read beside the caption, quieter. */
  date?: string;
  /** What the picture shows, for a screen reader, when it differs from the caption. */
  alt?: string;
  /** Where in the work it was taken, read before the date: "Before · Culvert, looking upstream". */
  tag?: string;
}

export interface LightboxOpen {
  images: LightboxImage[];
  /** Which image to start on. */
  index?: number;
  /** The viewer's accessible name. Defaults to "Image" / "Images". */
  heading?: string;
}

export const LIGHTBOX_OPEN = 'firma2:lightbox-open';

export const openLightbox = (detail: LightboxOpen): void => {
  document.dispatchEvent(new CustomEvent<LightboxOpen>(LIGHTBOX_OPEN, { detail }));
};
