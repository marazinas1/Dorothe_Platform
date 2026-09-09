import type { PostView } from "@/lib/posts/types";
import type { SiteSettings } from "@/types/site-settings";

/** Article structured data. Only fields the page actually shows. */
export function postJsonLd(settings: SiteSettings, post: PostView, canonical: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    mainEntityOfPage: canonical,
    url: canonical,
    ...(post.metaDescription ? { description: post.metaDescription } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.cover ? { image: post.cover } : {}),
    author: {
      "@type": "Organization",
      name: settings.legal_name ?? settings.site_name,
    },
    publisher: {
      "@type": "Organization",
      name: settings.site_name,
      ...(settings.logo_url ? { logo: { "@type": "ImageObject", url: settings.logo_url } } : {}),
    },
  };
}
