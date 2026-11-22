// Shared API base for pages whose JS calls the AMSO backend (conferences,
// manuscripts archive, admin). This file must load before any script that
// uses window.AMSO_API_BASE.
//
// The backend (D1 database + R2 storage) lives on Cloudflare Pages. When
// these static HTML files are served from there directly, this could be ""
// (relative /api/... works fine). But they're also uploaded as-is to
// amso.unilag.edu.ng, a plain static file host with no backend of its own —
// from there, the JS needs the full address to reach the real API. Pointing
// everywhere at the absolute Cloudflare URL keeps one codebase correct in
// both places, rather than needing an environment-specific build step.
window.AMSO_API_BASE = "https://amso-website-project.pages.dev";
