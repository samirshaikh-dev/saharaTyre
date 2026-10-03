# Sahara Tyre – AI Agent Rules & Operational Directives

> **File:** `AI_rule.md`  
> **Target:** All AI Coding Assistants, LLMs, and Subagents operating on the Sahara Tyre repository.

---

## 1. Core Purpose & Business Context

- **Business Identity:** Sahara Tyre GIDC Vapi is an established automotive workshop and tyre specialist in Vapi GIDC, Gujarat, India (operating since 2005, 4.8★ Google rating, 120+ verified reviews).
- **Physical Workshop:** Shop No 07, Amidhara Complex, Char Rasta, near CNG Pump, Phase 1, GIDC, Vapi, Gujarat 396195, India.
- **Primary Objective:** Drive local footfall, phone calls, WhatsApp inquiries, and in-person workshop visits.
- **Critical Constraint:** This is **NOT** an e-commerce platform. Never introduce shopping cart flows, online payment gateways, or shipping checkout modules unless explicitly directed.

---

## 2. Strict NAP & Entity Consistency (Zero Tolerance)

All AI agents must preserve 100% exact consistency across all HTML pages, schema JSON-LD, and text endpoints:

| Property | Canonical Value |
| :--- | :--- |
| **Business Name** | `Sahara Tyre` / `Sahara Tyre GIDC Vapi` |
| **Address** | `Shop No 07, Amidhara Complex, Char Rasta, near CNG Pump, Phase 1, GIDC, Vapi, Gujarat 396195` |
| **Primary Phone** | `+91-9377158216` |
| **WhatsApp Link** | `https://wa.me/919377158216` |
| **Email** | `shaikh.samir.dev@gmail.com` |
| **Geo Coordinates** | Latitude: `20.362324`, Longitude: `72.919686` |
| **Google Maps URL** | `https://www.google.com/maps/place/Sahara+Tyres+GIDC+Vapi/@20.362324,72.919686,17z/data=!4m6!3m5!1s0x3be0ce38d9016497:0x625d1494863f31eb!8m2!3d20.3622289!4d72.9202642!16s%2Fg%2F1q6j839vs?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D` |
| **Business Hours** | Mon–Sat: `7:30 AM – 9:00 PM`, Sun: `7:30 AM – 6:00 PM` |
| **Website URL** | `https://sahara-tyre.vercel.app/` |

---

## 3. Architecture & Code Modification Guidelines

### Page Structure
The repository is structured as a multi-page static site with dedicated topical hubs (82 pages total):
- `index.htm` – Homepage, master local FAQs, trust signals & main CTA.
- `/services` (`services/index.htm`) – Auto services directory hub & 10 dedicated service pages (`wheel-alignment-vapi`, `puncture-repair-vapi`, `wheel-balancing-vapi`, etc.).
- `/products` (`products.htm`) – Radial tyre catalog (MRF, CEAT, Apollo, Bridgestone, Michelin), used tyres, retreads & category gateway.
- `/vehicles` (`vehicles/index.htm`) – Master vehicle directory & 11 dedicated vehicle pages:
  - `truck-tyres`, `bus-tyres`, `car-tyres`, `bike-tyres`, `scooter-tyres`, `commercial-vehicle-tyres`, `crane-tyres`, `tractor-tyres`, `agricultural-tyres`, `otr-earthmover-tyres`, `industrial-tyres`.
- `/condition` (`condition/index.htm`) – Master Tyre Condition Hub:
  - `new-tyres`, `used-tyres`, `remould-tyres`.
- `/guides` (`guides/index.htm`) – Master Decision & Comparison Buying Guides Hub:
  - `new-vs-used-tyres`, `new-vs-remould-tyres`, `used-vs-remould-tyres`.
- `/brands` (`brands/index.htm`) – Authorized tyre brand hubs:
  - `mrf-tyres-vapi`, `ceat-tyres-vapi`, `apollo-tyres-vapi`, `bridgestone-tyres-vapi`, `jk-tyres-vapi`.
- `/locations` (`locations/index.htm`) – Local coverage hubs:
  - `tyre-shop-vapi-gidc`, `tyre-shop-gunjan`, `tyre-shop-chala`, `tyre-shop-daman`.
- `/tyres` (`tyres/car/index.htm`, `tyres/truck/index.htm`, `tyres/bike/index.htm`) – Specific tyre size matrices (10 car sizes, 6 truck sizes, 6 bike sizes).
- `/blog` (`blog/index.htm`) – Automotive educational articles.
- `/location` (`location.htm`) – Route directions, landmark navigation, parking & transit info.
- `/about` (`about.htm`) – 18+ years heritage, technician expertise, guarantees.
- `/privacy` (`privacy.htm`) – Privacy policy, analytics & AdSense compliance disclosures.
- `/terms` (`terms.htm`) – Terms and conditions, warranty policies & workshop agreements.
- `/faq` (`faq.htm`) – Frequently Asked Questions (24 categorized FAQs, live search, 7 category filter pills, zero-CLS CSS-grid accordions, Schema.org FAQPage).
- `/developer` (`developer.htm`) – Technical developer profile, Core Web Vitals engineering & portfolio of Samir Shaikh.

### Frontend Principles
1. **Semantic HTML5:** Maintain clean, accessible semantic elements (`<header>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<nav>`).
2. **Performance & CLS:** 
   - All `<img>` tags must have explicit `width`, `height`, and `loading="lazy"` (except LCP images which should have `fetchpriority="high"` and no lazy loading).
   - Ensure zero layout shift (CLS < 0.05).
3. **Styling:** Vanilla CSS combined with Tailwind CSS classes. Do not introduce bloated external UI dependencies without necessity.
4. **Mobile First:** Over 80% of local automotive search traffic is mobile. Test all UI modifications for touch targets (minimum 48x48px) and responsive viewports (320px–1440px+).

---

## 4. Technical SEO & Schema.org JSON-LD Integrity

1. **Schema Protection:** Never delete or corrupt existing JSON-LD schemas (`AutoPartsStore`, `LocalBusiness`, `FAQPage`, `BreadcrumbList`, `ItemList`).
2. **Synchronized Updates:** When modifying services, phone numbers, prices, or business hours in the visible HTML, update the matching JSON-LD script blocks in the `<head>` of all relevant pages.
3. **AI Search & AEO Assets:** Keep `llms.txt` (1,013 lines), `llms-full.txt` (1,050 lines), `ai.txt`, `robots.txt`, `humans.txt`, `.well-known/ai-plugin.json`, `openapi.json`, and `sitemap.xml` fully synchronized with any structural site changes.

---

## 5. Mandatory Skill Pre-Flight Protocol (Use ALL Skills)

Before proposing or executing **ANY** modification to code, content, layout, styling, SEO, or configurations, AI agents **MUST ALWAYS load and evaluate against ALL 5 specialized skills**:

1. `agents/skills/performance-engineer.md` — Core Web Vitals, asset delivery, performance budgets.
2. `agents/skills/seo-engineer.md` — Technical SEO, Schema.org JSON-LD integrity, sitemap, indexing.
3. `agents/skills/Seo-keyword-research-implementation.skill.md` — Keyword intent, NAP consistency, cannibalization prevention.
4. `agents/skills/ui-ux-engineer.md` — Visual hierarchy, mobile conversions, CTA design, trust badges.
5. `agents/skills/frontend-engineer.md` — Semantic HTML5, zero CLS containment, responsive CSS.

---

## 6. Safety, Verification & Git Discipline

- **No Hallucinated Pricing / Guarantees:** Do not make up promotional discounts or fictitious warranty terms not backed by shop policy.
- **Validate Before Completion:** Verify that HTML markup is valid, links work, and no broken tags or syntax errors are introduced.
- **Preserve Documentation:** Respect comments, metadata tags, Google Analytics tags (`G-98MGJHRPJ7`), and AdSense script tags (`pub-2685457296914833`).
