# Sahara Tyre – Gemini Context

## Project Overview
**Sahara Tyre GIDC Vapi** is Vapi's premier tyre specialist and automotive service center in Vapi GIDC, Gujarat, India, operating since 2005 (18+ years experience, 4.8/5 Google rating, 120+ verified reviews).

**Live Site:** https://sahara-tyre.vercel.app/

## Purpose
This website drives local, in-person visits to the physical workshop. It is NOT an e-commerce store.

**Primary Goal:** Maximize local footfall and inquiries for:
Shop No 07, Amidhara Complex, Char Rasta, near CNG Pump, Phase 1, GIDC, Vapi, Gujarat 396195, India

## Tech Stack & Architecture
- Multi-page static website (82 semantic pages organized into dedicated topical hubs)
- Vanilla CSS + Tailwind CSS utilities with zero layout shift (CLS containment)
- Deployed on Vercel Edge CDN with custom routing, rewrites, and 301 redirects
- Google Analytics 4 (`G-98MGJHRPJ7`) & Google AdSense (`pub-2685457296914833`)
- Comprehensive Schema.org JSON-LD structured data on all pages (`AutoPartsStore`, `AutoRepair`, `LocalBusiness`, `FAQPage`, `BreadcrumbList`, `ItemList`, `Product`)

## Mandatory Pre-Change Protocol: Use ALL Skills
> **CRITICAL DIRECTIVE:** Before proposing or implementing **ANY** changes (HTML, CSS, JS, Schema, SEO, Content, or Config), the AI **MUST ALWAYS load, read, and evaluate against ALL 5 specialized skills**:
> 
> 1. `agents/skills/performance-engineer.md` (Performance targets, Core Web Vitals, asset optimization)
> 2. `agents/skills/seo-engineer.md` (Technical SEO, Schema.org JSON-LD integrity, sitemap, crawlability)
> 3. `agents/skills/Seo-keyword-research-implementation.skill.md` (Search intent, NAP consistency, keyword mapping)
> 4. `agents/skills/ui-ux-engineer.md` (Visual hierarchy, conversion-driven CTA, mobile ergonomics)
> 5. `agents/skills/frontend-engineer.md` (Semantic HTML, zero CLS, layout stability, accessible UI)

## Key Pages & AI Discovery Endpoints

| Resource | Purpose |
| :--- | :--- |
| `index.htm` | Homepage & Master Hub (15 broad local/pricing FAQs, reviews, walk-in CTA) |
| `/services` | Auto Services Directory Hub (3D alignment, balancing, puncture, brakes, suspension, fleet plans) |
| `/services/:slug` | 10 Dedicated Service Pages (wheel-alignment, puncture-repair, balancing, fleet-care, etc.) |
| `/products` | Tyre Catalog & Hub (MRF, CEAT, Apollo, Bridgestone, used tyres, retreads, category gateway) |
| `/vehicles` | Vehicle Category Hub (Overview & gateway to 11 vehicle categories) |
| `/vehicles/truck-tyres` | Truck Tyres (10.00-20, 295/80 R22.5, 11.00 R20 for Tata, Ashok Leyland & BharatBenz) |
| `/vehicles/bus-tyres` | Bus Tyres (295/80 R22.5, 10.00 R20 for sleeper coaches & staff buses) |
| `/vehicles/car-tyres` | Car & SUV Tyres (155/80 R13 to 265/65 R17 with 3D laser wheel alignment) |
| `/vehicles/bike-tyres` | Motorcycle Tyres (2.75-18, 90/90-17, 120/80-18, 140/70-17 with 15-min fitting) |
| `/vehicles/scooter-tyres` | Scooter & EV Tyres (90/100-10, 90/90-12, 100/80-12 for Activa, Access & Ola) |
| `/vehicles/commercial-vehicle-tyres` | Commercial LCV Tyres (145 R12 LT, 7.00-15, 7.50-16 for Tata Ace & Bolero Pickup) |
| `/vehicles/crane-tyres` | Crane Tyres (11.00-20 Crane, 14.00-24 24PR for ACE & Escorts Hydra cranes) |
| `/vehicles/tractor-tyres` | Tractor Tyres (6.00-16, 12.4-28, 13.6-28, 14.9-28 for Mahindra, Swaraj & John Deere) |
| `/vehicles/agricultural-tyres` | Agricultural Tyres (9.00-16 16PR Trailer, 18.4-34 Harvester & tiller implements) |
| `/vehicles/otr-earthmover-tyres` | OTR Earthmover Tyres (17.5-25, 23.5-25, 14.00-24 for loaders, graders & JCB) |
| `/vehicles/industrial-tyres` | Industrial Forklift Tyres (6.00-9, 7.00-12, 8.25-15 solid rubber & cleanroom non-marking) |
| `/condition` | Master Tyre Condition Hub (Overview & side-by-side comparison matrix) |
| `/condition/new-tyres` | Brand New Tyres Hub (MRF, CEAT, Apollo, Bridgestone, Michelin factory warranty) |
| `/condition/used-tyres` | Used / Second-Hand Tyres Hub (5-point safety inspection, 3mm+ tread depth) |
| `/condition/remould-tyres` | Remould / Retread Tyres Hub (Cold precure & hot mould commercial truck tyres, 50% savings) |
| `/guides` | Master Buying & Comparison Decision Guides Hub |
| `/guides/new-vs-used-tyres` | New vs Used Tyres Buying Guide (Price vs lifespan vs safety comparison matrix) |
| `/guides/new-vs-remould-tyres` | New vs Remould Tyres Fleet Guide (Cost-Per-Kilometer CPK & axle placement rules) |
| `/guides/used-vs-remould-tyres` | Used vs Remould Tyres Guide (Commercial budget decision analysis) |
| `/brands` | Authorized Brand Hubs (MRF, CEAT, Apollo, Bridgestone, JK Tyre) |
| `/locations` | Geographic Coverage Hub (Vapi GIDC, Gunjan, Chala, Daman) |
| `/tyres/car` | Passenger Car Sizing Matrix (10 dedicated size pages) |
| `/tyres/truck` | Commercial Truck Sizing Matrix (6 dedicated size pages) |
| `/tyres/bike` | Motorcycle Sizing Matrix (6 dedicated size pages) |
| `/blog` | Automotive Care & Tyre Knowledge Hub (5 technical articles) |
| `/location` | Landmark Navigation (directions from Vapi Station, Daman, Silvassa, parking info) |
| `/about` | Heritage & Trust (18+ years heritage, certified mechanics, satisfaction guarantees) |
| `/privacy` | Privacy Policy (Data protection, Google Analytics & AdSense cookie disclosures) |
| `/terms` | Terms & Conditions (Workshop service agreements, warranties, walk-in policy) |
| `/developer` | Developer Profile & Engineering Portfolio (https://samir-portfolio-dev.vercel.app/) |
| `llms.txt` | Detailed knowledge graph & AEO entity file for LLMs & AI search engines |
| `ai.txt` | AI crawler rules and direct citation protocols |
| `sitemap.xml` | Search engine URL index with rich image metadata |
| `.well-known/ai-plugin.json` | AI model integration manifest |

## Geographic Service Area Hierarchy (27 Core Coverage Locations)
- **1st Priority Local Vapi Neighborhoods (2–8 Min Response):** Char Rasta Vapi, Gunjan, Imran Nagar, Chala, Chanod, Dungra, GIDC Industrial Area (Phases 1–4), Gita Nagar, Balitha, Chharwada, Chhiri, Koparli Road, Silvassa Road, Salvav, Morai, Kanchanagar.
- **2nd Priority Regional & Industrial Hubs (15–35 Min Drive):** Daman, Silvassa (Dadra & Nagar Haveli), Valsad, Pardi, Umbergaon, Bhilad.
- **3rd Priority Scenic Tourist Landmarks & Highway Transit Routes:** Vanganga Lake Garden (Dadra), Arjungad Fort (Bagwada), Daman Ganga Dam (Madhuban), Hirwa Van Garden (Silvassa), Sunrise Point (Khanvel).

## Business Contact & Hours
- **Phone:** +91-9377158216
- **WhatsApp:** https://wa.me/919377158216
- **Email:** shaikh.samir.dev@gmail.com
- **Technical Lead & Developer:** Samir Shaikh ([Profile](https://sahara-tyre.vercel.app/developer) | [Portfolio](https://samir-portfolio-dev.vercel.app/) | [GitHub](https://github.com/samirshaikh-dev) | [LinkedIn](https://www.linkedin.com/in/samirshaikh-dev/))
- **Hours:** Mon–Sat 7:30 AM – 9:00 PM, Sun 7:30 AM – 6:00 PM (100% Walk-ins welcome)
- **Rating:** 4.8/5 (120+ reviews)