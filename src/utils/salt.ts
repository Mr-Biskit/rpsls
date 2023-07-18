import { bytesToBigint } from "viem";
import crypto from "crypto";

export function generateSalt() {
  const randomBytes = crypto.randomBytes(32);
  const salt = bytesToBigint(randomBytes);
  console.log(`Generated salt ${salt}`);
  return salt;
}
