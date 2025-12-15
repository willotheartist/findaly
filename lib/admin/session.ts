const te = new TextEncoder();

function base64url(bytes: Uint8Array) {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64url(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return new Uint8Array(Buffer.from(b64, "base64"));
}

async function hmacSha256(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    te.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, te.encode(data));
  return new Uint8Array(sig);
}

export async function createAdminToken(secret: string, ttlSeconds = 60 * 60 * 24 * 14) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = JSON.stringify({ exp });
  const payloadB64 = base64url(te.encode(payload));
  const sig = await hmacSha256(secret, payloadB64);
  const sigB64 = base64url(sig);
  return `${payloadB64}.${sigB64}`;
}

export async function verifyAdminToken(token: string | undefined, secret: string) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, sigB64] = parts;

  const expectedSig = await hmacSha256(secret, payloadB64);
  const gotSig = fromBase64url(sigB64);

  if (gotSig.length !== expectedSig.length) return false;
  for (let i = 0; i < gotSig.length; i++) {
    if (gotSig[i] !== expectedSig[i]) return false;
  }

  try {
    const payloadJson = Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const payload = JSON.parse(payloadJson) as { exp?: number };
    const exp = Number(payload.exp ?? 0);
    if (!exp) return false;
    return Math.floor(Date.now() / 1000) < exp;
  } catch {
    return false;
  }
}
