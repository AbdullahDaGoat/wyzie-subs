import { subtle } from 'crypto';
import { H3Event } from 'h3';

// TODO: The idea is that we have another KDF a layer below this so we can create
// master keys and then derive keys from that master key. This way we give the
// public one key and give others different keys compartmentalizing the access. :smart_guy_tapping_head:

type KeyType = {
  kdf: string;
  salt: Buffer;
  key: string;
};

export function verifyApiKey(event: H3Event, query?: string): boolean {
  const apiKey = event.headers.get('API-Token') || query;
  if (!apiKey || !verifySecretKey(getEnvironmentVariable(), apiKey)) {
    throw new Error('API key missing or invalid');
  }
  return true;
}

export function getEnvironmentVariable(): string {
  const envSecret = process.env.API_KEY;
  if (!envSecret)
    throw new Error('Environment variables are not set correctly');
  return envSecret;
}

export async function verifySecretKey(
  secret: string,
  key: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const secretBuffer = encoder.encode(secret);
  const hashBuffer = await subtle.digest('SHA-256', secretBuffer);
  return Buffer.from(hashBuffer).toString('hex') === key;
}

export async function createSecretKey(secret: string): Promise<KeyType> {
  const key = crypto.getRandomValues(new Uint8Array(32)).toString();
  const encoder = new TextEncoder();
  const keyBuffer = encoder.encode(key);
  const salt = await subtle.digest('SHA-256', keyBuffer);

  const secretBuffer = encoder.encode(secret);
  const hashBuffer = await subtle.digest('SHA-256', secretBuffer);
  const kdf = Buffer.from(hashBuffer).toString('hex');

  return { kdf: key, salt: Buffer.from(salt), key: kdf };
}