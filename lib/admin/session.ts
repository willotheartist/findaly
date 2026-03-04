// lib/admin/session.ts
// Edge-safe + Node-safe token signing/verification (no Buffer).

const te = new TextEncoder();
const td = new TextDecoder();

// ---------------------------
// Base64 helpers (URL-safe)
// ---------------------------

function bytesToBase64(bytes: Uint8Array): string {
  // Convert bytes -> binary string -> base64 via btoa
  let binary = "";
  const chunkSize = 0x8000; // avoid call stack limits
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  // btoa exists in Edge + modern runtimes; if missing, fail loudly
  if (typeof btoa !== "function") {
    throw new Error("btoa is not available in this runtime.");
  }

  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  if (typeof atob !== "function") {
    throw new Error("atob is not available in this runtime.");
  }

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64urlEncodeBytes(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64urlDecodeToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return base64ToBytes(b64);
}

// ---------------------------
// Crypto
// ---------------------------

async function hmacSha256(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    te.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, te.encode(data));
  return new Uint8Array(sig);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  // constant-time compare
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// ---------------------------
// Token API
// ---------------------------

export async function createAdminToken(secret: string, ttlSeconds = 60 * 60 * 24 * 14) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = JSON.stringify({ exp });

  const payloadB64 = base64urlEncodeBytes(te.encode(payload));
  const sig = await hmacSha256(secret, payloadB64);
  const sigB64 = base64urlEncodeBytes(sig);

  return `${payloadB64}.${sigB64}`;
}

export async function verifyAdminToken(token: string | undefined, secret: string) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, sigB64] = parts;

  // verify signature
  const expectedSig = await hmacSha256(secret, payloadB64);
  let gotSig: Uint8Array;
  try {
    gotSig = base64urlDecodeToBytes(sigB64);
  } catch {
    return false;
  }

  if (!timingSafeEqual(gotSig, expectedSig)) return false;

  // verify expiry
  try {
    const payloadBytes = base64urlDecodeToBytes(payloadB64);
    const payloadJson = td.decode(payloadBytes);
    const payload = JSON.parse(payloadJson) as { exp?: number };

    const exp = Number(payload.exp ?? 0);
    if (!exp) return false;

    return Math.floor(Date.now() / 1000) < exp;
  } catch {
    return false;
  }
}