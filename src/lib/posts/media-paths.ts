// Storage paths for article cover images.
// Convention: `posts/{post_id}/cover-{variant}.webp` in the public
// `post-images` bucket, so a cover always belongs to a known article and the
// storage RLS can stay simple (public read, staff write).
//
// Variants are produced in the BROWSER by src/lib/images/optimize.ts, exactly
// like listing photos — one pipeline, no server-side encoding.

export const POST_IMAGES_BUCKET = "post-images";

export function postCoverPath(postId: string, variant: string) {
  return `posts/${postId}/cover-${variant}.webp`;
}

export function postCoverFolder(postId: string) {
  return `posts/${postId}`;
}

/** Absolute public URL for a bucket-relative path in the post images bucket. */
export function postImageUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/${POST_IMAGES_BUCKET}/${path}`;
}
