# Website file structure — Bhargavsinh Sisodiya portfolio

Version: V20.4.2

## Root (main shell)

| File | Role |
|------|------|
| `index.html` | Home |
| `vanshavali.html` | Genealogy intro |
| `resume.html` | Resume entry |
| `archives.html` | Archives hub |
| `contact.html` | Contact |
| `portals.html` | **Portal Bridge** (links all three portals) |
| `sitemap.html` | Full sitemap |
| `changelog.html` | Changelog |
| `404.html` / `offline.html` | Error / offline |

## Portals (three towers)

```
Visitor/                      Public heritage & policy
  Visitindex.html
  about.html, vanshavali.html, blog.html, ...
  privacy-policy.html, termsofuse.html, ...

HR-Recruiter/                 Professional / recruiter
  HRRindex.html
  resume.html, projects.html, ghostwriting.html, ...

Book-Publications-Reader/     Books & research library
  BPindex.html
  satyanisodh.html, astitva-garima.html, otherlinks.html, ...
```

## Shared assets

```
assets/
  css/     retro-2000s.css, protect-l4.css, site.css, ...
  js/      protect-l4.js, retro-apply.js, retro-features.js, theme.js, ...
  partials/
    header-home.html | header-visitor.html | header-hr.html | header-books.html
    footer-home.html | footer-visitor.html | footer-hr.html | footer-books.html
  images/brand/
```

## Main menu (all pages)

Home · Vanshavali · Resume · Archives · Contact · **Portals**

Secondary (drawer): About · Projects · Publications · Research · Sitemap  
Portal strip: Visitor · HR Recruiter · Books · ★ Bridge

## Rule

Do not move portal HTML out of their folders — URLs and SEO depend on these paths.
Shared chrome lives in `assets/partials/` and is loaded per shell.
