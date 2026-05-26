/**
 * Constant-time string comparison so we don't leak timing info on the admin
 * password check.
 */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verifies HTTP Basic auth against the configured admin password. Username is
 * ignored — only the password matters.
 */
export function checkAdminAuth(request: Request, expectedPassword: string): boolean {
  const header = request.headers.get("Authorization");
  if (!header || !header.toLowerCase().startsWith("basic ")) return false;
  try {
    const decoded = atob(header.slice("basic ".length).trim());
    const colon = decoded.indexOf(":");
    if (colon < 0) return false;
    const password = decoded.slice(colon + 1);
    return constantTimeEquals(password, expectedPassword);
  } catch {
    return false;
  }
}

export function unauthorized(): Response {
  return new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Padel Social Club admin"' },
  });
}
