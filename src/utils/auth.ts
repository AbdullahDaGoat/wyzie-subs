import { subtle } from 'crypto';
import { H3Event } from 'h3';

// API Key Creation
//   We have a 256 char “master key” which we pass through a KDF then it gives us a “api key” which we can use while requesting the subs.wyzie api. 

// API Key Validation
//   1. We get a request
//   2. We check the header for “api-key” value if it’s not present then we automatically through 401
//   3. We check the validity of the “api key” by passing it back through the KDF
//   4. The KDF either returns true or false showing the validity of the key
//   5. We block them or allow them to use the api

type KeyType = {
  kdf: string;
  salt: Buffer;
  key: string;
};

export function verifyApiKey(event: H3Event, query?: string): boolean {
  const apiKey = event.headers.get('API-Key') || query;
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