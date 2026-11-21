/**
 * Server-only admin login crypto. Import from API routes / server code only —
 * never from Client Components.
 */
import {
  constants,
  createDecipheriv,
  createPrivateKey,
  createPublicKey,
  generateKeyPairSync,
  privateDecrypt,
  randomUUID,
  type KeyObject,
} from "crypto";

const CHALLENGE_TTL_MS = 2 * 60 * 1000;

type ChallengeEntry = { expires: number };
const challenges = new Map<string, ChallengeEntry>();

let cachedKeys: { privateKey: KeyObject; publicKeyPem: string } | null = null;

function normalizePem(pem: string) {
  return pem.replace(/\\n/g, "\n").trim();
}

/** Load RSA key from env, or generate an ephemeral pair for local/dev. */
export function getAdminLoginKeys() {
  if (cachedKeys) return cachedKeys;

  const pem = process.env.ADMIN_LOGIN_PRIVATE_KEY;
  if (pem) {
    const privateKey = createPrivateKey(normalizePem(pem));
    const publicKeyPem = createPublicKey(privateKey).export({
      type: "spki",
      format: "pem",
    }) as string;
    cachedKeys = { privateKey, publicKeyPem };
    return cachedKeys;
  }

  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
  cachedKeys = {
    privateKey,
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" }) as string,
  };
  return cachedKeys;
}

function pruneChallenges(now = Date.now()) {
  for (const [id, entry] of challenges) {
    if (entry.expires <= now) challenges.delete(id);
  }
}

export function issueLoginChallenge() {
  pruneChallenges();
  const challengeId = randomUUID();
  challenges.set(challengeId, { expires: Date.now() + CHALLENGE_TTL_MS });
  const { publicKeyPem } = getAdminLoginKeys();
  return { challengeId, publicKey: publicKeyPem };
}

/** Consume a challenge (single-use). Returns false if missing/expired/reused. */
export function consumeLoginChallenge(challengeId: string) {
  pruneChallenges();
  const entry = challenges.get(challengeId);
  if (!entry) return false;
  challenges.delete(challengeId);
  if (entry.expires <= Date.now()) return false;
  return true;
}

export type SealedLoginBody = {
  wk: string;
  iv: string;
  ct: string;
};

function b64ToBuf(value: string) {
  return Buffer.from(value, "base64");
}

function hybridOpen(sealed: SealedLoginBody): Buffer {
  const { privateKey } = getAdminLoginKeys();
  const aesKey = privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    b64ToBuf(sealed.wk),
  );

  if (aesKey.length !== 32) {
    throw new Error("Invalid key length");
  }

  const iv = b64ToBuf(sealed.iv);
  const data = b64ToBuf(sealed.ct);
  if (data.length < 17) throw new Error("Invalid ciphertext");

  const authTag = data.subarray(data.length - 16);
  const enc = data.subarray(0, data.length - 16);
  const decipher = createDecipheriv("aes-256-gcm", aesKey, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(enc), decipher.final()]);
}

/**
 * Open double-sealed login request:
 * outer AES envelope → inner credentials + challengeId.
 */
export function openAdminLoginRequest(body: SealedLoginBody): {
  email: string;
  password: string;
  challengeId: string;
} {
  const outerPlain = hybridOpen(body).toString("utf8");
  const envelope = JSON.parse(outerPlain) as {
    challengeId?: string;
    wk?: string;
    iv?: string;
    ct?: string;
  };

  if (!envelope.challengeId || !envelope.wk || !envelope.iv || !envelope.ct) {
    throw new Error("Invalid envelope");
  }

  const innerPlain = hybridOpen({
    wk: envelope.wk,
    iv: envelope.iv,
    ct: envelope.ct,
  }).toString("utf8");

  const parsed = JSON.parse(innerPlain) as { email?: string; password?: string };
  if (!parsed.email || !parsed.password) {
    throw new Error("Invalid payload");
  }

  return {
    email: parsed.email,
    password: parsed.password,
    challengeId: envelope.challengeId,
  };
}
