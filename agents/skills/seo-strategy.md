---
name: seo-strategy
description: Master strategic framework for technical SEO, answer-engine optimization (AEO), generative-engine optimization (GEO), and machine-readable content syndication for the Sahara Tyre static multi-page site. Prioritizes verified sitemaps, inline JSON-LD, local entity grounding, token-efficient Markdown endpoints, and AI crawler discovery across Google, Bing, ChatGPT, Claude, Perplexity and Google AI Overviews.
---

# Purpose

Establish and enforce an engineering-driven SEO and GEO/AEO strategy for the Sahara Tyre website so the workshop is discovered, cited and visited across traditional search and AI answer engines.

The site is not an e-commerce store. Every discovery asset must support the business goal: local footfall, phone calls, WhatsApp inquiries and walk-in visits to the two Vapi GIDC workshops.

# Scope

### Owns
- **Discovery file architecture**: `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, `ai.txt`, `humans.txt`, `openapi.json`, `.well-known/ai-plugin.json`, `.well-known/security.txt`, `manifest.json`.
- **Machine-readable Markdown endpoints**: Root-level `.md` counterparts for the main HTML hubs, served with `text/markdown` and CORS via `vercel.json` headers.
- **AEO/GEO direct-answer structure**: Question-led headings followed by short standalone answers that LLMs can quote without hallucination.
- **Entity and NAP grounding**: Exact business name, address, phones, coordinates, hours and canonical URLs across HTML, JSON-LD and text endpoints.
- **Structured data strategy**: Inline Schema.org JSON-LD (`AutoPartsStore`, `AutoRepair`, `LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList`, `ItemList`, `Person`).
- **Routing and canonical hygiene**: Clean extensionless URLs, 301 legacy redirects, and `vercel.json` rewrites. Canonical tags must never point at `.htm` paths.
- **Indexing hygiene**: Stable `lastmod` values, sitemap completeness, legacy redirect coverage, and generator drift checks.

### Does not own
- **Core Web Vitals and rendering performance**: Layout stability, asset delivery and bundle weight -> `frontend-engineer` / `performance-engineer`.
- **Keyword research and editorial copy**: Search intent mapping, title/meta wording and content gaps -> `seo-keyword-research-implementation`.
- **Visual hierarchy and conversion design**: CTA placement, trust signals and mobile ergonomics -> `ui-ux-engineer`.

# When This Skill Activates

- Auditing or changing `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, `ai.txt`, `humans.txt`, `openapi.json` or `.well-known/*`.
- Adding or renaming public pages, hubs, service pages, brand pages, locality pages or blog articles.
- Adding or changing canonical URLs, redirects, rewrites or headers in `vercel.json`.
- Creating or updating `.md` counterparts for HTML hubs.
- Adding or editing Schema.org JSON-LD in a page `<head>`.
- Preparing content for AI Overviews, ChatGPT Search, Perplexity, Gemini or Copilot citations.

# Strategic Value Hierarchy

```
HIGH VALUE
  1. Accurate sitemap.xml with stable lastmod (no fabricated dates)
  2. Exact NAP consistency across HTML, JSON-LD and text endpoints
  3. Comprehensive inline JSON-LD on every indexable page
  4. Root-level Markdown endpoints for the 12 main hubs
  5. robots.txt that explicitly allows verified AI crawlers
  6. Clean canonical URLs and complete legacy 301 coverage

MEDIUM VALUE
  7. llms.txt and llms-full.txt knowledge depth
  8. openapi.json and .well-known/ai-plugin.json machine discovery
  9. Internal linking between hubs, services, brands, vehicles and guides
 10. Search Console and Bing Webmaster verification
 11. PWA manifest and app icons
 12. Optional IndexNow submission for Bing/Copilot

PAGES THAT WORK LIKE FILES
 13. Service landing pages with procedure and turnaround facts
 14. Branch pages with phone, hours, coordinates and directions
 15. Comparison guides with decision matrices
 16. FAQ page with visible answers matching FAQPage JSON-LD
 17. Blog articles with direct answers and author attribution

SKIP / ANTI-PATTERNS
  - Meta keywords tags
  - Scaled doorway or auto-generated prompt pages
  - dynamic new Date() timestamps in sitemaps
  - Invented prices, warranties or review counts
  - E-commerce cart, checkout or shipping claims
```

# Static Architecture Map

The repository is hand-authored static HTML with no build step. `vercel.json` maps clean URLs to `.htm` files.

| Discovery asset | Repository location | Public route | Notes |
| :--- | :--- | :--- | :--- |
| Robots policy | `robots.txt` | `/robots.txt` | Allows search and named AI crawlers; references the sitemap. |
| XML sitemap | `sitemap.xml` | `/sitemap.xml` | Static file with a generated tyre region between marker comments. |
| LLM knowledge graph | `llms.txt` | `/llms.txt` | Intentionally long-form entity and technical corpus. |
| Full knowledge base | `llms-full.txt` | `/llms-full.txt` | Must remain equal to or deeper than `llms.txt`. |
| AI directives | `ai.txt` | `/ai.txt` | Crawler permissions and citation rules. |
| Team and stack | `humans.txt` | `/humans.txt` | Humanstxt.org registry and developer attribution. |
| OpenAPI spec | `openapi.json` | `/openapi.json` | Static discovery and knowledge specification with `x-markdown-endpoints`. |
| AI plugin manifest | `.well-known/ai-plugin.json` | `/.well-known/ai-plugin.json` | OpenAI-compatible manifest. |
| Security contact | `.well-known/security.txt` | `/.well-known/security.txt` | RFC 9116 disclosure policy. |
| Web manifest | `manifest.json` | `/manifest.json` | PWA metadata and shortcuts. |
| Markdown hubs | `services.md`, `about.md`, `products.md`, `vehicles.md`, `brands.md`, `condition.md`, `guides.md`, `blog.md`, `branches.md`, `locations.md`, `location.md`, `faq.md` | `/<name>.md` | Served as `text/markdown; charset=utf-8` with CORS. |
| Generated tyre pages | `tools/generate-tyre-pages.mjs` + `data/tyre-sizes.json` | `/tyres/...` | Never hand-edit generated regions. |
| Routing, redirects, headers | `vercel.json` | n/a | Canonicals use clean URLs, never `.htm`. |

# Core Engineering Principles

1. **Authentic `lastmod` integrity**
   - Never stamp every URL with the current date. Use real content dates and the `lastmod` values stored in `data/tyre-sizes.json` for generated tyre pages.
   - When a hub changes materially, update only that page's sitemap date.

2. **Dual-audience indexing (HTML for humans, Markdown for agents)**
   - HTML hubs carry navigation, design, images and conversion CTAs.
   - Root `.md` endpoints carry the same facts in a token-efficient, citation-ready form.
   - Every `.md` file must include `canonical_html`, the canonical URL, NAP facts, a direct answer, structured sections and a citation line.

3. **Direct-answer pattern**
   - Use a heading phrased as the searcher's question, then a one-to-two sentence standalone answer with the key fact, followed by supporting detail.
   - Answers must be true without surrounding context so AI engines can quote them safely.

4. **Entity and NAP consistency**
   - Business name, address, phones, WhatsApp links, hours and coordinates must match `AI_rule.md` verbatim.
   - Never swap the Char Rasta and J-Type Road phone numbers.
   - JSON-LD, visible HTML and `.md` endpoints must agree.

5. **Schema mirrors visible content**
   - Every FAQ in JSON-LD must be visible on the rendered page.
   - Do not add schema for services, prices, ratings or warranties that the page does not show.

6. **Generated-region discipline**
   - The tyre size grids, hub `ItemList` blocks and sitemap tyre URLs live between generator markers.
   - Change `data/tyre-sizes.json`, run `node tools/generate-tyre-pages.mjs`, and verify with `--check`.
   - Do not hand-edit generated output or the marker blocks.

7. **Clean URL canonicals**
   - Canonical tags, sitemap entries and internal links use extensionless URLs such as `/services/wheel-alignment-vapi`.
   - Legacy `.htm` paths are redirect sources only, with `"permanent": true`.

# Decision Framework

### When to add a Markdown counterpart
- Add `/page.md` when an HTML hub contains structured facts that people ask AI assistants about: services, brands, vehicles, conditions, guides, branches, coverage, directions, FAQs, products or company background.
- Keep the Markdown file as a hub-level summary with canonical links to deeper HTML pages. Do not duplicate every detail page.
- Do not create `.md` files for image galleries, legal boilerplate or temporary promotions unless requested.

### When to create a dedicated page vs. a section
- Create a dedicated page when the topic has distinct local intent and deserves its own canonical URL and schema, for example a service, brand, vehicle category or comparison guide.
- Keep the topic as a section when it is supporting detail on an existing page, for example payment methods on the location page.
- Never create a pricing page or online checkout flow. Quote prices by phone or WhatsApp and describe cost drivers, not fixed rates.

### IndexNow vs. Google Search Console
- Google does not accept IndexNow. Use the XML sitemap and Search Console.
- Bing, Yandex and Seznam accept IndexNow. If a key file and dispatcher are added, submit only after deploy and only for changed URLs.

# Implementation Workflow

1. **Audit the baseline**
   - Check `robots.txt` for blocked AI crawlers and sitemap reference.
   - Check `sitemap.xml` for missing live URLs, legacy `.htm` entries and stale dates.
   - Check canonical tags on changed pages.
2. **Update discovery assets**
   - Add or rename pages in `sitemap.xml`, `llms.txt`, `ai.txt`, `openapi.json` and the relevant `.md` files.
   - Register new `.md` endpoints in the `vercel.json` Markdown header group.
3. **Update structured data**
   - Edit the page's inline JSON-LD and mirror the change in visible content.
   - Validate with the Schema.org validator and Google Rich Results Test.
4. **Regenerate tyre pages when data changes**
   - Edit `data/tyre-sizes.json`, run `node tools/generate-tyre-pages.mjs`, then `node tools/generate-tyre-pages.mjs --check`.
5. **Verify**
   - Confirm every `.md` `canonical_html` target resolves through `vercel.json`.
   - Confirm no `pricing.md` or Next.js paths are referenced.
   - Confirm NAP values and both branch phone numbers.

# Common Failure Modes and Guardrails

- **Broken Markdown links**: Listing a `.md` endpoint in `llms.txt`, `ai.txt` or `openapi.json` without creating the file.
- **Canonical leaks**: Canonical tags or sitemap entries pointing at `.htm` paths instead of clean URLs.
- **Schema/content mismatch**: JSON-LD claims that are not visible on the page.
- **Timestamp drift**: Rewriting every sitemap `lastmod` on each deploy.
- **Generated-region edits**: Hand changes that the next generator run overwrites.
- **Depth inversion**: Letting `llms-full.txt` become shorter or shallower than `llms.txt`.
- **NAP drift**: Different phone numbers, hours or addresses across HTML, schema and text endpoints.
- **Missing headers**: `.md` files served as `text/plain` or without CORS because the `vercel.json` group was not updated.
- **Pricing invention**: Adding fixed prices, discounts or warranty promises that the workshop has not approved.

# Interaction With Other Skills

- **`seo-engineer`**: Executes on-page meta tags, canonical tags, crawl audits and structured-data validation; this skill sets the architecture and file roadmap.
- **`seo-keyword-research-implementation`**: Supplies intent-mapped keywords, headings and FAQ phrasing for the direct-answer blocks.
- **`frontend-engineer`**: Implements semantic HTML5, zero-CLS layouts and responsive behavior on the pages this strategy targets.
- **`ui-ux-engineer`**: Designs trust signals, CTA hierarchy and mobile ergonomics that convert discovery into walk-ins.
- **`performance-engineer`**: Protects Core Web Vitals and validates that discovery assets do not add blocking work.

# Expected Output

- A complete and accurate discovery asset set with no broken references.
- Root `.md` endpoints for the 12 main hubs, each with frontmatter, canonical HTML URL, NAP facts, direct answer, structured sections and citation line.
- Inline JSON-LD that matches visible content and validates cleanly.
- Clean-URL canonicals and complete legacy redirect coverage.
- Verified NAP consistency across HTML, JSON-LD, `llms.txt`, `ai.txt`, `openapi.json` and `.md` files.
