// Admin-side helper for reading a processed variant URL out of
// listing_images.variants. The browser pipeline stores absolute public URLs
// (the listing-images bucket is public; originals never are).
import { pickImageUrl } from "@/lib/listings/image";
import type { ImageVariant } from "@/lib/listings/media-paths";
import type { AdminListingRow } from "@/lib/listings/admin.functions";

export function primaryThumb(row: AdminListingRow): string | null {
  const sorted = [...(row.images ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const primary = sorted.find((image) => image.is_primary) ?? sorted[0];
  return primary ? variantUrl(primary.variants, "card") : null;
}

export function variantUrl(variants: unknown, size: ImageVariant = "card"): string | null {
  return pickImageUrl(variants, size);
}

export function fileExtension(name: string, contentType: string): string {
  const fromName = name.includes(".") ? name.split(".").pop() ?? "" : "";
  if (fromName) return fromName.toLowerCase();
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("avif")) return "avif";
  return "jpg";
}
