# BHARGAVSINH SISODIYA - Portfolio V17.3

Three-portal static portfolio on GitHub Pages: **Who's Visiting?** → Books · HR Recruiter · Visitor.

## V17.3 focus

| Area | Delivered |
|------|-----------|
| **Visual system** | Consistent Netflix Red (`#E50914`) + White + Gray on pure Black |
| **Logo** | `newlogo.png` as real brand mark in all portal headers + selector |
| **Content protection** | Selection/copy/right-click deterrence, image drag block, print attribution |
| **PWA** | V17.3 cache, richer precache, update toast (“New version available”) |
| **Reading UX** | Progress bar, back-to-top, improved long-form typography helpers |
| **Accessibility** | Skip-to-content, visible red focus rings, reduced-motion respected |
| **SEO** | OG/Twitter cards, WebSite JSON-LD on home |

## Structure

```
index.html                    Who's Visiting? + B.M.S. intro
Book-Publications-Reader/     Literary portal
HR-Recruiter/                 Professional portal
Visitor/                      Public portfolio + Policy Center
assets/css/v17.3-enhancements.css
assets/js/v17.3-ux.js
sw.js                         Service worker (v17.3)
```

## Deploy

Push to `bhargavsinh.github.io` `main` → hard-refresh (SW **v17.3**).
