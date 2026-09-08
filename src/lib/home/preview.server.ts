// Home page design preview: a short-lived HMAC token lets a new browser tab
// render a design that is not the live one, during SSR, without changing
// anything for visitors. Same construction as the listing preview token.

const TTL_SECONDS = 30 * 60;

function secret(): string {
  const value = process.env.LISTING_PREVIEW_SECRET;
  if (!value) throw new Error("Missing LISTING_PREVIEW_SECRET");
  return value;
}

function b64url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
}

export async function createHomePreviewToken(template: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = `home:${template}.${exp}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifyHomePreviewToken(
  template: string,
  token: string,
): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [head, expRaw, signature] = parts;
  if (head !== `home:${template}`) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;

  const expected = await sign(`${head}.${expRaw}`);
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}
