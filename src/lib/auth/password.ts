import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Safely verifies a plaintext password against a stored bcrypt hash.
 * Always handles errors cleanly and avoids leaking timing information.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (
    !password ||
    !hash ||
    typeof password !== "string" ||
    typeof hash !== "string"
  ) {
    return false;
  }
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}
