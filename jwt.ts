import { create, verify } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

type CryptoKeyGenParams = [
  { name: string; hash: string },
  boolean,
  KeyUsage[],
];

const cryptoArgs: CryptoKeyGenParams = [
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
];

async function keyToSecret(key: CryptoKey) {
  const exportedKey = await crypto.subtle.exportKey("jwk", key);
  return exportedKey.k!;
}

async function secretToKey(secret: string) {
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    ...cryptoArgs,
  );
}

export async function generateSecret() {
  const key = await crypto.subtle.generateKey(...cryptoArgs) as CryptoKey;
  return keyToSecret(key);
}

// deno-lint-ignore no-explicit-any
export async function signJwt(data: any, secret: string) {
  const key = await secretToKey(secret);
  return create(
    {
      alg: "HS512",
      typ: "JWT",
    },
    { exp: Math.floor(Date.now() / 1000) + 60 * 60, ...data },
    key,
  );
}

export async function verifyJwt(jwt: string, secret: string) {
  const key = await secretToKey(secret);
  return verify(jwt, key);
}
