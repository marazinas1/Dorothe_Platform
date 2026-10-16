/**
 * Owner photos attached to a valuation request. Phone photos are large, so
 * each one is resized in the browser (longest side 1600 px, JPEG) before it
 * is sent: owners can attach straight from the camera roll without hitting a
 * size limit, and the request stays small. Browser-only.
 */
export const MAX_SELLER_PHOTOS = 8;
/** Raw file ceiling before resizing; anything bigger is not a normal photo. */
export const MAX_RAW_BYTES = 25 * 1024 * 1024;
const MAX_EDGE = 1600;

export type PreparedPhoto = { filename: string; content_type: string; data_base64: string };

export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  const name = file.name.replace(/\.[^.]+$/, "") || "photo";
  return { filename: `${name}.jpg`, content_type: "image/jpeg", data_base64: dataUrl.slice(dataUrl.indexOf(",") + 1) };
}

/** Pick usable images from a file input; reports whether any were dropped. */
export function pickPhotos(list: FileList | null): { files: File[]; rejected: boolean } {
  const all = Array.from(list ?? []);
  const ok = all.filter((f) => f.type.startsWith("image/") && f.size <= MAX_RAW_BYTES);
  return { files: ok.slice(0, MAX_SELLER_PHOTOS), rejected: ok.length !== all.length || ok.length > MAX_SELLER_PHOTOS };
}
