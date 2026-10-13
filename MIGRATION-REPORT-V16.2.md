# V16.2 Migration Report

## Portal assignment

### Book-Publications-Reader/
| File | Role |
|------|------|
| BPindex.html | Portal home |
| otherlinks.html | Publications catalogue |
| satyanisodh.html | Book: સત્યની શોધ |
| bookreadingpolicy.html | Reading policy |
| pushtimarg.html | Pushtimarg resources |
| pushtimarg-ma-gruh-seva.html | Article |
| pushtidoctor.html | Essay |

### HR-Recruiter/
| File | Role |
|------|------|
| HRRindex.html | Portal home |
| resume.html | Professional resume |
| projects.html | Projects hub |
| pwriter.html | AI prompt tool |
| ghostwriting.html | Ghostwriting services |

### Visitor/
| File | Role |
|------|------|
| Visitindex.html | Portal home |
| about.html | Biography |
| blog.html | Articles hub |
| vanshavali.html | Genealogy |
| Mewad_history_blog.html | Heritage essay |
| ananadviharbhavan.html | Heritage project |
| contact.html | Contact |
| privacy-policy.html | Legal |
| termsofuse.html | Legal |
| disclaimer.html | Legal |
| grievance.html | Legal |

## Root redirects
Legacy paths at repository root (`/blog.html`, `/resume.html`, …) redirect via meta-refresh + JS to the new portal locations for backward compatibility.

## Path updates
- All portal pages use `../assets/...` for shared CSS/JS/images
- Internal links rewritten to portal-relative or cross-portal paths
- `portal-page-shell.js` injects portal-specific nav + Switch Portal

## Design system
- Root: portal-selector.css (black Who's Visiting?)
- Portals: portal-common.css (dark cinematic, accent variants)
- Legacy Tailwind gold remapped via theme overrides

## Preserved
- All original content text and Gujarati copy
- Forms, embeds (genealogy), publication links
- PWA manifest + service worker (v16.2)
- Metadata / verification files at root

## Verification
- Root selector: 3 profiles, correct destinations
- Portal homes: 200, Switch Portal works
- Content pages: shell injects, assets load
- Legacy redirects: 200 → portal page
- Cross-portal article links resolve correctly
