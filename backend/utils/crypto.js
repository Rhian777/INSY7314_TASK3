// backend/utils/crypto.js
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// AES-256-GCM expects 32 byte key
const KEY = Buffer.from(process.env.AES_KEY_BASE64, "base64"); // set env AES_KEY_BASE64

if (!KEY || KEY.length !== 32) {
  throw new Error("AES key must be 32 bytes (base64). Set AES_KEY_BASE64 environment variable.");
}

export function encryptField(plainText) {
  const iv = crypto.randomBytes(12); // recommended 12 bytes for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv, { authTagLength: 16 });
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // store as base64 iv:tag:cipher
  return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptField(stored) {
  const [ivB64, tagB64, cipherB64] = stored.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(cipherB64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
