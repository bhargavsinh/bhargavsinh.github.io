# BHARGAVSINH SISODIYA — Digital Estate (V18.1.0)

Static site for GitHub Pages. No framework, no CDN scripts. Blueprint: "V18.0 Digital Estate Transformation, Master Blueprint V1.1".

## Layout
- `site/` — deployable output (upload contents to the repo root; `.nojekyll` included).
- `_build/` — generator: `build.py`, `content/` (verbatim page fragments), `data/*.json` (hub content), `assets/`, `legacy.json` (old URL redirects), `lastmod.json`, `sw.template.js`, `check.py`.

## Rebuild
    pip install beautifulsoup4 lxml
    python3 -I _build/build.py site
    python3 -I _build/check.py site <reference_dir>   # text fidelity + missing refs

## Editing content
- Hubs (About, Projects, Publications, Research, Home): edit `_build/data/*.json`, rebuild. Fields set to `null` (project category/stack/status/live/source) are intentionally empty — **new content needs owner approval** before being filled.
- Portal pages: edit fragments in `_build/content/`.
- Bump `VERSION`/`TODAY` in `build.py` for each release (cache names and asset versions derive from it).

## Rollback
Keep the previous release zip (e.g. 17.2.5 / 18.0.1). Rollback = replace repo contents with that zip's files and push; the service worker (versioned cache) updates on next visit, users see an "update available" toast.

## Release checklist
1. Build, run `check.py` (0 text diffs, 0 missing refs).
2. Test at 360/390/412 px: no horizontal scroll.
3. Run Lighthouse (not run in the build sandbox) on `/`, `/about/`, `/publications/`, `/contact/`.
4. Verify sitemap.xml (canonical URLs only, real lastmod), robots.txt (policy unchanged), `.well-known/security.txt`.
5. Zip as release backup.

## Notes and limits
- GitHub Pages cannot set HTTP headers: CSP is a `<meta>` (without `frame-ancestors`); HSTS/X-Frame-Options need a CDN/proxy. Do not add `includeSubDomains` HSTS without auditing all subdomains.
- Fonts: Rasa (Gujarati), Noto Sans Devanagari (Hindi) load non-blocking from Google Fonts; self-hosting needs the font files added to `assets/fonts` and a CSS `@font-face` plus CSP `font-src 'self'`.
- Private contact details (phone/address) are not used in new hubs; legacy pages keep original text per content-preservation rule — review and approve removal if desired.
- Service worker file name remains `sw.js` (cache-safe, network-first navigation).
