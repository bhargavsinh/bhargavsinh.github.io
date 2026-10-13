# BHARGAVSINH SISODIYA - Portfolio V17.0

Three-portal static portfolio on GitHub Pages: **Who's Visiting?** → Books · HR Recruiter · Visitor.

## V17.0 focus

| Area | Delivered |
|------|-----------|
| **Name** | Display name standardised as **BHARGAVSINH SISODIYA** |
| **Policy & Governance** | Policy Center + 8 policy areas (Privacy, Terms, Cookies, Copyright, Content/Editorial, Data Retention, Accessibility, Third-Party) |
| **UX** | Back-to-top, text-size controls (A−/A/A+), reading progress on long pages |
| **Security honesty** | Meta CSP limits documented; Formspree disclosed; static-host constraints unchanged |
| **Intro** | Cinematic **B.M.S.** wordmark intro retained |

## Policy Center

`/Visitor/policy-center.html` — hub for all governance pages. Linked from portal footers.

Policies describe **actual** behaviour only (GitHub Pages, Formspree contact form, no ad trackers by default). No fake cookie consent banner.

## Structure

```
index.html                    Who's Visiting? + B.M.S. intro
Visitor/
  policy-center.html
  cookies-policy.html
  copyright-policy.html
  content-editorial-policy.html
  data-retention-policy.html
  accessibility-statement.html
  third-party-policy.html
  privacy-policy.html · termsofuse.html · …
HR-Recruiter/ · Book-Publications-Reader/
assets/js/site-utils.js       UX helpers
```

## Security (accurate)

Static GitHub Pages cannot provide server-side auth, WAF, or true HTTP `frame-ancestors`. Client helpers (CSP meta, honeypot, external `rel`) are defence-in-depth only.

## Deploy

Push to `bhargavsinh.github.io` `main` → hard-refresh (SW **v17.0**).
