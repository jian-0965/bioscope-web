const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;

export function normalizeUsername(value: string) {
  return value.trim().normalize("NFKC").toLowerCase();
}

export function getUsernameError(value: string) {
  return USERNAME_PATTERN.test(normalizeUsername(value))
    ? null
    : "账号需为 3–24 个英文字母、数字或下划线。";
}

/**
 * Supabase password authentication requires an email or phone identifier.
 * This deterministic, hashed address is an internal identifier only: users
 * never enter it, it is never displayed, and no email is sent to it.
 */
export async function usernameToAuthEmail(value: string) {
  const username = normalizeUsername(value);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(username),
  );
  const token = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return `user-${token}@accounts.bioscope.local`;
}
