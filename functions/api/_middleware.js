// CORS for the whole /api/* surface, so these endpoints can be called
// cross-origin — e.g. from amso.unilag.edu.ng (a plain static file host)
// while the actual database/storage backend lives here on Cloudflare Pages.
//
// Access-Control-Allow-Origin: * is deliberate and safe here: every endpoint
// is either public-read or gated by the ADMIN_TOKEN query param (not a
// cookie/session), so there's no credential for a third-party origin to
// steal by riding along with a request.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
