// Per-clone email sender configuration. This is the ONE place a clone's mail
// identity is set; everything that sends mail reads it from here. Values are
// taken from the environment when provided, so a clone can be pointed at its
// own sending domain without code changes.
export const SENDER_DOMAIN = process.env["EMAIL_SENDER_DOMAIN"] ?? "notify.dorothe.deerva.com";
export const ROOT_DOMAIN = process.env["SITE_ROOT_DOMAIN"] ?? "dorothe.deerva.com";
export const SITE_URL = `https://${ROOT_DOMAIN}`;
export const ADMIN_URL = `${SITE_URL}/admin`;

/** "Site name <noreply@sender-domain>", the shape the mail API expects. */
export function fromAddress(siteName: string): string {
  return `${siteName} <noreply@${SENDER_DOMAIN}>`;
}
