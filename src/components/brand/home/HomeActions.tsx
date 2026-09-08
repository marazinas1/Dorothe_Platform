/**
 * Homepage templates keep importing these names; both are now thin aliases of
 * the site-wide button rule so there is exactly one filled style and one quiet
 * link style across the whole product.
 */
export { ActionLink as HomeButton, actionButtonClass } from "@/components/brand/ui/ActionButton";
export { QuietLink as HomeTextLink, quietLinkClass } from "@/components/brand/ui/QuietLink";
