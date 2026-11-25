// The two facts a field photo carries that a tenant should not retype: the day
// it was taken and where. A minimal JPEG/EXIF reader — DateTimeOriginal and the
// GPS position, nothing else — so a multi-file drop arrives half-filled.
// Anything it cannot read (a PNG, a stripped JPEG, a truncated file) returns
// empty rather than throwing: the person fills what the file did not say.

export interface PhotoExif {
  /** ISO day, "2025-06-14". */
  takenOn?: string;
  /** Decimal degrees. */
  position?: [number, number];
}

const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

export const readExif = async (file: File): Promise<PhotoExif> => {
  try {
    // EXIF lives in the first APP1 segment, well inside the first 128 KB.
    const view = new DataView(await file.slice(0, 131072).arrayBuffer());
    if (view.getUint16(0) !== 0xffd8) return {};

    let offset = 2;
    while (offset + 4 < view.byteLength) {
      const marker = view.getUint16(offset);
      const length = view.getUint16(offset + 2);
      if (marker === 0xffe1 && view.getUint32(offset + 4) === 0x45786966) return parseTiff(view, offset + 10);
      if ((marker & 0xff00) !== 0xff00) break;
      offset += 2 + length;
    }
  } catch {
    /* unreadable: the person fills it in */
  }
  return {};
};

const parseTiff = (view: DataView, base: number): PhotoExif => {
  const little = view.getUint16(base) === 0x4949;
  const u16 = (at: number) => view.getUint16(at, little);
  const u32 = (at: number) => view.getUint32(at, little);

  /** Every tag in the IFD at `ifd`, by tag number, as the raw entry's value offset and shape. */
  const entries = (ifd: number) => {
    const out = new Map<number, { type: number; count: number; at: number }>();
    const n = u16(base + ifd);
    for (let i = 0; i < n; i += 1) {
      const e = base + ifd + 2 + i * 12;
      const type = u16(e + 2);
      const count = u32(e + 4);
      const size = (TYPE_SIZE[type] ?? 1) * count;
      // A value of four bytes or fewer sits in the entry itself; longer ones are pointed at.
      out.set(u16(e), { type, count, at: size <= 4 ? e + 8 : base + u32(e + 8) });
    }
    return out;
  };

  const text = (e: { count: number; at: number }) =>
    String.fromCharCode(...new Uint8Array(view.buffer, view.byteOffset + e.at, Math.max(e.count - 1, 0)));
  const rationals = (e: { count: number; at: number }) =>
    Array.from({ length: e.count }, (_, i) => u32(e.at + i * 8) / (u32(e.at + i * 8 + 4) || 1));

  const result: PhotoExif = {};
  const ifd0 = entries(u32(base + 4));

  const exifPointer = ifd0.get(0x8769);
  if (exifPointer) {
    const stamp = entries(u32(exifPointer.at)).get(0x9003);
    // "2025:06:14 09:31:07"
    const match = stamp ? /^(\d{4}):(\d{2}):(\d{2})/.exec(text(stamp)) : null;
    if (match) result.takenOn = `${match[1]}-${match[2]}-${match[3]}`;
  }

  const gpsPointer = ifd0.get(0x8825);
  if (gpsPointer) {
    const gps = entries(u32(gpsPointer.at));
    const latRef = gps.get(1);
    const lat = gps.get(2);
    const lngRef = gps.get(3);
    const lng = gps.get(4);
    if (latRef && lat && lngRef && lng) {
      const degrees = (e: { count: number; at: number }) => {
        const [d = 0, m = 0, s = 0] = rationals(e);
        return d + m / 60 + s / 3600;
      };
      const north = text(latRef) !== 'S';
      const east = text(lngRef) !== 'W';
      result.position = [north ? degrees(lat) : -degrees(lat), east ? degrees(lng) : -degrees(lng)];
    }
  }
  return result;
};

/** "2025-06-14" → "June 2025", the label every record stores. */
export const monthLabel = (iso: string): string => {
  const [y, m] = iso.split('-').map(Number);
  if (!y || !m) return '';
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};
