/** Opaque wire fields only — nothing readable in DevTools payload. */
export type SealedLoginRequest = {
  wk: string;
  iv: string;
  ct: string;
};

function bufToB64(buf: ArrayBuffer | Uint8Array) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

async function importPublicKey(pem: string) {
  const cleaned = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");
  const raw = Uint8Array.from(atob(cleaned), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "spki",
    raw.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["wrapKey"],
  );
}

async function hybridSeal(
  publicKey: CryptoKey,
  plaintext: Uint8Array,
): Promise<SealedLoginRequest> {
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "wrapKey"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const sealed = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    plaintext,
  );
  const wrapped = await crypto.subtle.wrapKey("raw", aesKey, publicKey, {
    name: "RSA-OAEP",
  });
  return {
    wk: bufToB64(wrapped),
    iv: bufToB64(iv),
    ct: bufToB64(sealed),
  };
}

/**
 * Double-encrypt admin login for the wire:
 * 1) AES-GCM credentials + RSA-wrapped key (inner)
 * 2) AES-GCM entire envelope (challengeId + inner) + RSA-wrapped key (outer)
 * Network payload is only { wk, iv, ct }.
 */
export async function sealAdminLoginRequest(
  publicKeyPem: string,
  challengeId: string,
  credentials: { email: string; password: string },
): Promise<SealedLoginRequest> {
  const publicKey = await importPublicKey(publicKeyPem);
  const encoder = new TextEncoder();

  const inner = await hybridSeal(publicKey, encoder.encode(JSON.stringify(credentials)));

  const envelope = encoder.encode(
    JSON.stringify({
      challengeId,
      wk: inner.wk,
      iv: inner.iv,
      ct: inner.ct,
    }),
  );

  return hybridSeal(publicKey, envelope);
}
