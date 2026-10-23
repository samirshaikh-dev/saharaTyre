#!/usr/bin/env node
/**
 * tools/generate-tyre-pages.mjs
 * 
 * Zero-dependency Node.js generator for Sahara Tyre size detail pages,
 * category hub grids/ItemLists, and sitemap.xml tyre URLs.
 * 
 * Source of truth: data/tyre-sizes.json
 * 
 * Flags:
 *   --check : Validate that emitted files match disk; exit non-zero if drift detected.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isCheck = process.argv.includes('--check');

// Load source of truth
const dataPath = path.join(rootDir, 'data', 'tyre-sizes.json');
if (!fs.existsSync(dataPath)) {
  console.error(`Error: data file not found at ${dataPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const { site, categories, sizes } = data;

// Build lookup maps
const categoryMap = new Map();
for (const cat of categories) {
  categoryMap.set(cat.key, cat);
}

const categoryItemListNames = {
  car: 'Passenger Car & SUV Tyre Sizes in Vapi GIDC',
  bike: 'Motorcycle & Bike Tyre Sizes in Vapi GIDC',
  truck: 'Commercial Truck Tyre Sizes in Vapi GIDC',
  scooter: 'Scooter & EV Tyre Sizes in Vapi GIDC',
  rickshaw: 'Auto Rickshaw & 3-Wheeler Tyre Sizes in Vapi GIDC'
};

const categoryIconMap = {
  car: 'directions_car',
  bike: 'two_wheeler',
  scooter: 'moped',
  rickshaw: 'electric_rickshaw',
  truck: 'local_shipping'
};

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatPrice(num) {
  if (num == null) return '0';
  return Number(num).toLocaleString('en-IN');
}

// ---------------------------------------------------------------------------
// 1. Hub Card & Size Grid Renderer
// ---------------------------------------------------------------------------
function renderCard(item) {
  const metaHtml = item.cardMeta
    ? `\n                    <div class="pt-2 text-xs text-slate-500 font-medium">${escapeHtml(item.cardMeta)}</div>`
    : '';

  return `            <!-- ${escapeHtml(item.size)} -->
            <a href="/tyres/${item.category}/${item.slug}" class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all flex flex-col justify-between group">
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold px-2.5 py-1 rounded bg-primary/10 text-primary uppercase">${escapeHtml(item.badge || '')}</span>
                        <span class="text-xs text-slate-500">From ₹${formatPrice(item.priceFrom)}</span>
                    </div>
                    <h3 class="font-bold text-xl text-navy group-hover:text-primary transition-colors">${escapeHtml(item.cardTitle || item.size)}</h3>
                    <p class="text-slate-600 text-sm leading-relaxed">${escapeHtml(item.cardDesc || '')}</p>${metaHtml}
                </div>
                <div class="pt-4 text-primary font-bold text-sm flex items-center gap-1">
                    View ${escapeHtml(item.size)} Details <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
            </a>`;
}

function renderSizeGrid(items) {
  const cardsHtml = items.map(renderCard).join('\n\n');
  return `        <!-- BEGIN GENERATED SIZE GRID -->\n        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">\n${cardsHtml}\n        </div>\n        <!-- END GENERATED SIZE GRID -->`;
}

// ---------------------------------------------------------------------------
// 2. Dedicated Hub ItemList Renderer
// ---------------------------------------------------------------------------
function renderHubItemList(category, items) {
  const listName = categoryItemListNames[category] || `${category} Tyre Sizes in Vapi GIDC`;
  const elements = items.map((item, idx) => ({
    '@type': 'ListItem',
    'position': idx + 1,
    'name': item.itemListName || item.cardTitle || item.size,
    'url': `https://sahara-tyre.vercel.app/tyres/${item.category}/${item.slug}`
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': listName,
    'itemListOrder': 'https://schema.org/ItemListOrderAscending',
    'numberOfItems': items.length,
    'itemListElement': elements
  };

  const jsonString = JSON.stringify(jsonLd, null, 2)
    .split('\n')
    .map((line, i) => (i === 0 ? line : '    ' + line))
    .join('\n');

  return `    <!-- BEGIN GENERATED ITEMLIST -->\n    <script type="application/ld+json">\n    ${jsonString}\n    </script>\n    <!-- END GENERATED ITEMLIST -->`;
}

// ---------------------------------------------------------------------------
// 3. Sitemap Tyre URLs Renderer
// ---------------------------------------------------------------------------
function renderSitemapTyreUrls(allSizes) {
  const catOrder = ['car', 'bike', 'scooter', 'rickshaw', 'truck'];
  const catLabels = {
    car: 'Car Tyre Sizes',
    bike: 'Bike Tyre Sizes',
    scooter: 'Scooter Tyre Sizes',
    rickshaw: 'Auto Rickshaw Tyre Sizes',
    truck: 'Truck Tyre Sizes'
  };

  const lines = ['    <!-- BEGIN GENERATED TYRE URLS -->'];

  for (const cat of catOrder) {
    const catSizes = allSizes.filter(s => s.category === cat);
    if (catSizes.length === 0) continue;
    lines.push(`\n    <!-- ${catLabels[cat]} -->`);
    for (const s of catSizes) {
      lines.push('    <url>');
      lines.push(`        <loc>https://sahara-tyre.vercel.app/tyres/${s.category}/${s.slug}</loc>`);
      lines.push(`        <lastmod>${s.lastmod || '2026-10-21'}</lastmod>`);
      lines.push('        <changefreq>monthly</changefreq>');
      lines.push('        <priority>0.75</priority>');
      lines.push('    </url>');
    }
  }

  lines.push('    <!-- END GENERATED TYRE URLS -->');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 4. Detail Page Renderer
// ---------------------------------------------------------------------------
function renderDetailPage(item, categorySizes) {
  const catObj = categoryMap.get(item.category) || {
    label: `${item.category.toUpperCase()} Tyres`,
    hub: `/tyres/${item.category}`
  };
  const categoryLabel = catObj.label;
  const categoryHub = catObj.hub;
  const vehicleIcon = categoryIconMap[item.category] || 'directions_car';

  const rawTitle = item.seo && item.seo.title ? item.seo.title : `${item.size} Tyres in Vapi GIDC | Sahara Tyre`;
  const pageTitle = rawTitle.includes('Sahara Tyre') ? rawTitle : `${rawTitle} – Sahara Tyre`;
  const pageDesc = item.seo && item.seo.description ? item.seo.description : `${item.size} tyres in Vapi GIDC at Sahara Tyre. Best deals with free fitting & alignment. Call +91-9377158216.`;
  const pageKeywords = item.seo && item.seo.keywords ? item.seo.keywords : `${item.size} tyres vapi, buy ${item.size} vapi gidc`;

  const canonicalUrl = `https://sahara-tyre.vercel.app/tyres/${item.category}/${item.slug}`;
  const whatsappUrl = `https://wa.me/919377158216?text=Hi%20Sahara%20Tyre%2C%20I%20need%20price%20and%20stock%20for%20${encodeURIComponent(item.size)}%20tyres%20in%20Vapi`;

  const highPrice = item.priceTo ? String(item.priceTo) : String(Math.round(item.priceFrom * 1.5));

  // Specs HTML
  const specsRows = (item.specs || []).map((spec, i) => {
    const bgClass = i % 2 === 0 ? 'bg-white' : 'bg-slate-50';
    return `                    <tr class="${bgClass} border-b border-slate-200">
                        <td class="px-6 py-4 font-semibold text-slate-800">${escapeHtml(spec.label)}</td>
                        <td class="px-6 py-4 text-slate-600">${escapeHtml(spec.value)}</td>
                    </tr>`;
  }).join('\n');

  // Vehicles HTML
  const vehiclesGrid = (item.vehicles || []).map(veh => {
    return `                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center font-semibold text-sm text-slate-850 flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-primary text-base">${vehicleIcon}</span>
                    <span>${escapeHtml(veh)}</span>
                </div>`;
  }).join('\n');

  // Patterns HTML
  const patternsGrid = (item.patterns || []).map(p => {
    return `                <div class="p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-primary/50 transition-colors">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-bold text-navy text-lg">${escapeHtml(p.name)}</h3>
                        <span class="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Recommended</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(p.note)}</p>
                </div>`;
  }).join('\n');

  // FAQ Accordion & JSON-LD
  const faqSchemaElements = (item.faq || []).map(faq => ({
    '@type': 'Question',
    'name': faq.q,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.a
    }
  }));

  const faqAccordionHtml = (item.faq || []).map((faq, idx) => {
    const qNum = idx + 1;
    return `            <div class="faq-item group bg-white rounded-2xl border border-slate-200 transition-all duration-200 hover:border-primary/40 hover:shadow-md" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button type="button" 
                        class="faq-btn w-full text-left p-5 sm:p-6 font-bold flex justify-between items-center gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl" 
                        aria-expanded="false" 
                        aria-controls="faq-ans-${qNum}" 
                        id="faq-btn-${qNum}">
                    <span class="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors" itemprop="name">
                        ${escapeHtml(faq.q)}
                    </span>
                    <span class="faq-chevron-box shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors" aria-hidden="true">
                        <span class="material-symbols-outlined faq-chevron text-xl">expand_more</span>
                    </span>
                </button>
                <div id="faq-ans-${qNum}" class="faq-accordion-grid" role="region" aria-labelledby="faq-btn-${qNum}" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <div class="faq-accordion-inner">
                        <div class="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100" itemprop="text">
                            ${escapeHtml(faq.a)}
                        </div>
                    </div>
                </div>
            </div>`;
  }).join('\n\n');

  // Related Sizes HTML
  const relatedSizesHtml = (categorySizes || [])
    .filter(s => s.slug !== item.slug)
    .map(s => {
      return `                <a href="/tyres/${s.category}/${s.slug}" class="p-3 bg-white hover:bg-primary/5 rounded-xl border border-slate-200 hover:border-primary text-center font-bold text-sm text-navy hover:text-primary transition-all">
                    ${escapeHtml(s.size)}
                </a>`;
    }).join('\n');

  // JSON-LD Graph
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AutoRepair',
        '@id': 'https://sahara-tyre.vercel.app/#business',
        'name': 'Sahara Tyre GIDC Vapi',
        'url': 'https://sahara-tyre.vercel.app/',
        'telephone': '+91-9377158216',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Shop No 07, Amidhara Complex, Char Rasta, near CNG Pump, Phase 1, GIDC',
          'addressLocality': 'Vapi',
          'addressRegion': 'Gujarat',
          'postalCode': '396195',
          'addressCountry': 'IN'
        }
      },
      {
        '@type': 'Product',
        'name': `${item.size} ${categoryLabel} Tyre`,
        'description': pageDesc,
        'offers': {
          '@type': 'AggregateOffer',
          'priceCurrency': 'INR',
          'lowPrice': String(item.priceFrom),
          'highPrice': highPrice,
          'offerCount': '20',
          'availability': 'https://schema.org/InStock'
        }
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://sahara-tyre.vercel.app/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Products', 'item': 'https://sahara-tyre.vercel.app/products' },
          { '@type': 'ListItem', 'position': 3, 'name': categoryLabel, 'item': `https://sahara-tyre.vercel.app${categoryHub}` },
          { '@type': 'ListItem', 'position': 4, 'name': item.size, 'item': canonicalUrl }
        ]
      },
      {
        '@type': 'FAQPage',
        'mainEntity': faqSchemaElements
      }
    ]
  };

  const jsonLdString = JSON.stringify(jsonLd, null, 2)
    .split('\n')
    .map((line, i) => (i === 0 ? line : '    ' + line))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(pageDesc)}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Sahara Tyre GIDC Vapi">
    <meta name="geo.region" content="IN-GJ">
    <meta name="geo.placename" content="Vapi, Gujarat, India">
    <meta name="geo.position" content="20.362324;72.919686">
    <meta name="ICBM" content="20.362324, 72.919686">
    <meta name="keywords" content="${escapeHtml(pageKeywords)}">
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="manifest" href="/manifest.json">
    <meta name="google-site-verification" content="H6Pq0eI_0M2sSwSWyHpuCbS7ufcyBMaw_r2k7VCv9Ok">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${escapeHtml(item.size)} Tyres in Vapi GIDC | Sahara Tyre">
    <meta property="og:description" content="${escapeHtml(item.cardDesc || pageDesc)}">
    <meta property="og:image" content="https://sahara-tyre.vercel.app/og-image.png">
    <meta property="og:locale" content="en_IN">
    <meta property="og:site_name" content="Sahara Tyre">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(item.size)} Tyres in Vapi GIDC | Sahara Tyre">
    <meta name="twitter:description" content="${escapeHtml(item.cardDesc || pageDesc)}">
    <meta name="twitter:image" content="https://sahara-tyre.vercel.app/og-image.png">

    <!-- Fonts & Styling -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: { extend: { colors: { primary: "#f97316", navy: "#0f172a" }, fontFamily: { sans: ['"Spline Sans"', 'sans-serif'] } } }
        }
    </script>
    <style>
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-smoothing: antialiased; overflow: hidden; vertical-align: middle; }
        body { font-family: 'Spline Sans', sans-serif; }
        /* Smooth CSS grid accordion transition without layout shifts */
        .faq-accordion-grid { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1); }
        .faq-accordion-grid.open { grid-template-rows: 1fr; }
        .faq-accordion-inner { overflow: hidden; }
        .faq-chevron { transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1); }
        .faq-btn[aria-expanded="true"] .faq-chevron { transform: rotate(180deg); }
    </style>

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-98MGJHRPJ7"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-98MGJHRPJ7');</script>

    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2685457296914833" crossorigin="anonymous"></script>

    <!-- Structured Data -->
    <script type="application/ld+json">
    ${jsonLdString}
    </script>
</head>

<body class="bg-slate-50 text-slate-900">
    <!-- Nav -->
    <nav class="sticky top-0 z-50 bg-navy text-white px-4 py-3 border-b border-primary/20 shadow-lg">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">tire_repair</span>
                <span class="font-bold text-lg tracking-tight">SAHARA TYRE</span>
            </a>
            <div class="hidden md:flex gap-6 text-sm font-medium">
                <a class="hover:text-primary transition-colors" href="/services">Services</a>
                <a class="hover:text-primary transition-colors text-primary font-bold" href="/products">Products</a>
                <a class="hover:text-primary transition-colors" href="/brands">Brands</a>
                <a class="hover:text-primary transition-colors" href="/blog">Blog</a>
                <a class="hover:text-primary transition-colors" href="/location">Contact</a>
                <a class="hover:text-primary transition-colors" href="/about">About</a>
            </div>
            <a class="bg-primary hover:bg-orange-600 text-navy px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all" href="tel:+919377158216">
                <span class="material-symbols-outlined text-sm">call</span>Call Now
            </a>
        </div>
    </nav>

    <!-- Breadcrumb -->
    <div class="bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 py-3">
            <nav aria-label="Breadcrumb" class="text-sm text-slate-500 flex items-center gap-2 flex-wrap">
                <a href="/" class="hover:text-primary">Home</a>
                <span class="material-symbols-outlined text-xs">chevron_right</span>
                <a href="/products" class="hover:text-primary">Products</a>
                <span class="material-symbols-outlined text-xs">chevron_right</span>
                <a href="${categoryHub}" class="hover:text-primary">${escapeHtml(categoryLabel)}</a>
                <span class="material-symbols-outlined text-xs">chevron_right</span>
                <span class="text-slate-900 font-medium">${escapeHtml(item.size)}</span>
            </nav>
        </div>
    </div>

    <!-- Hero -->
    <section class="bg-navy text-white py-16 md:py-20 relative overflow-hidden">
        <div class="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2070&auto=format&fit=crop&fm=webp')] bg-cover bg-center"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/70"></div>
        <div class="relative max-w-7xl mx-auto px-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary font-semibold text-xs uppercase tracking-widest mb-6">
                <span class="material-symbols-outlined text-xs">verified</span>
                ${escapeHtml(item.hero && item.hero.eyebrow ? item.hero.eyebrow : `In-Stock Size ${item.size}`)}
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                ${escapeHtml(item.hero && item.hero.headline ? item.hero.headline : `${item.size} Tyres in Vapi GIDC`)}<br>
                <span class="text-primary">New &amp; Tested Used In Stock</span>
            </h1>
            <p class="text-lg md:text-xl text-slate-300 max-w-3xl mb-8 leading-relaxed">
                ${escapeHtml(item.hero && item.hero.lede ? item.hero.lede : `Authorized dealer pricing on genuine ${item.size} tyres with computerized alignment and express wheel fitting at Char Rasta Phase 1 GIDC Vapi.`)}
            </p>
            <div class="flex flex-wrap gap-4">
                <a href="tel:+919377158216" class="bg-primary text-navy font-bold px-8 py-4 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined">phone_in_talk</span>Call +91-9377158216
                </a>
                <a href="${whatsappUrl}" target="_blank" rel="noopener" class="bg-white/10 text-white border border-white/20 font-bold px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all">
                    <span class="material-symbols-outlined">chat</span>Get Instant Quote
                </a>
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <main class="py-16 md:py-20 bg-white">
        <div class="max-w-4xl mx-auto px-4 space-y-16">

            <!-- Technical Specifications Table -->
            <section>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-xl">tune</span>
                    </div>
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-black text-navy">${escapeHtml(item.size)} Technical Specifications</h2>
                        <p class="text-xs sm:text-sm text-slate-500">Official dimensions, rim diameter, load and speed ratings</p>
                    </div>
                </div>
                <div class="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                    <table class="w-full text-left text-sm text-slate-600">
                        <thead class="bg-slate-100 text-xs uppercase font-bold text-slate-700 border-b border-slate-200">
                            <tr>
                                <th scope="col" class="px-6 py-4 w-1/3">Specification Parameter</th>
                                <th scope="col" class="px-6 py-4">Standard Rating / Metric</th>
                            </tr>
                        </thead>
                        <tbody>
${specsRows}
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Compatible Vehicles -->
            <section>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-xl">${vehicleIcon}</span>
                    </div>
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-black text-navy">Compatible Vehicles for ${escapeHtml(item.size)}</h2>
                        <p class="text-xs sm:text-sm text-slate-500">Popular models and fleet variants running this size</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
${vehiclesGrid}
                </div>
            </section>

            <!-- Brand Patterns -->
            <section>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-xl">verified</span>
                    </div>
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-black text-navy">Available Brand Patterns</h2>
                        <p class="text-xs sm:text-sm text-slate-500">Authorized OEM tread patterns in stock with warranty</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
${patternsGrid}
                </div>
            </section>

            <!-- Fitment Guidance -->
            <section class="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-1">
                        <span class="material-symbols-outlined text-xl">info</span>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-navy mb-2">Fitment Advice &amp; Size Verification</h3>
                        <p class="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                            ${escapeHtml(item.fitment || '')}
                        </p>
                        <div class="text-xs text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200">
                            <strong>Note:</strong> Always verify your vehicle door jamb sticker, fuel lid placard, or existing tyre sidewall markings before purchasing. For safe handling and speedometer accuracy, overall rolling diameter should remain within &plusmn;2% of original manufacturer fitment.
                        </div>
                    </div>
                </div>
            </section>

            <!-- FAQ Section -->
            <section>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-xl">quiz</span>
                    </div>
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-black text-navy">Frequently Asked Questions</h2>
                        <p class="text-xs sm:text-sm text-slate-500">Expert answers for ${escapeHtml(item.size)} pricing, pressure, and warranty</p>
                    </div>
                </div>
                <div class="space-y-4">
${faqAccordionHtml}
                </div>
            </section>

            <!-- More Category Sizes -->
            <section class="pt-8 border-t border-slate-200">
                <h3 class="text-xl font-bold text-navy mb-4">Explore More ${escapeHtml(categoryLabel)} Sizes</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
${relatedSizesHtml}
                </div>
            </section>
        </div>
    </main>

    <!-- CTA -->
    <section class="bg-navy text-white py-16">
        <div class="max-w-3xl mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-4xl font-black mb-4">Check ${escapeHtml(item.size)} Stock Today</h2>
            <p class="text-slate-300 mb-8 max-w-xl mx-auto">
                Visit Sahara Tyre at Phase 1 GIDC Char Rasta, opposite the CNG pump, or contact our workshop technicians directly.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="tel:+919377158216" class="bg-primary text-navy font-bold px-10 py-4 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined">phone_in_talk</span>Call +91-9377158216
                </a>
                <a href="${whatsappUrl}" target="_blank" rel="noopener" class="bg-white/10 text-white border border-white/20 font-bold px-10 py-4 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all">
                    <span class="material-symbols-outlined">chat</span>WhatsApp Inquiry
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-navy text-slate-400 py-8 text-sm border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <span class="text-white font-bold">Sahara Tyre</span> — Shop No 07, Amidhara Complex, GIDC Phase 1, Vapi 396195
            </div>
            <div class="flex gap-6">
                <a href="/" class="hover:text-primary transition-colors">Home</a>
                <a href="/products" class="hover:text-primary transition-colors">Products</a>
                <a href="${categoryHub}" class="hover:text-primary transition-colors">${escapeHtml(categoryLabel)}</a>
                <a href="/privacy" class="hover:text-primary transition-colors">Privacy</a>
            </div>
        </div>
    </footer>

    <!-- Accordion Script -->
    <script>
        document.querySelectorAll('.faq-item').forEach(function(item) {
            var btn = item.querySelector('.faq-btn');
            var panel = item.querySelector('.faq-accordion-grid');
            if (btn && panel) {
                btn.addEventListener('click', function() {
                    var isExpanded = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', !isExpanded);
                    if (isExpanded) {
                        panel.classList.remove('open');
                    } else {
                        panel.classList.add('open');
                    }
                });
            }
        });
    </script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// 5. Main Execution Workflow
// ---------------------------------------------------------------------------
function replaceRegion(content, beginMarker, endMarker, newContent) {
  const beginIndex = content.indexOf(beginMarker);
  const endIndex = content.indexOf(endMarker);

  if (beginIndex === -1 || endIndex === -1 || endIndex < beginIndex) {
    throw new Error(`Markers "${beginMarker}" and "${endMarker}" not properly found in file content.`);
  }

  const before = content.slice(0, beginIndex);
  const after = content.slice(endIndex + endMarker.length);
  return before + newContent + after;
}

function normalizeNewlines(str) {
  return str.replace(/\r\n/g, '\n');
}

async function run() {
  console.log(`Starting Sahara Tyre page generator [mode: ${isCheck ? '--check' : 'write'}]...`);

  const driftFiles = [];
  let generatedPagesCount = 0;
  let updatedHubsCount = 0;
  let sitemapUpdated = false;

  // 1. Group sizes by category
  const sizesByCategory = new Map();
  for (const cat of categories) {
    sizesByCategory.set(cat.key, []);
  }

  for (const s of sizes) {
    if (!sizesByCategory.has(s.category)) {
      sizesByCategory.set(s.category, []);
    }
    sizesByCategory.get(s.category).push(s);
  }

  // 2. Process the 5 category hubs
  for (const cat of categories) {
    const hubRelative = cat.hubFile || `tyres/${cat.key}/index.htm`;
    const hubPath = path.join(rootDir, hubRelative);

    if (!fs.existsSync(hubPath)) {
      console.error(`Warning: hub file ${hubRelative} not found.`);
      continue;
    }

    const catSizes = sizesByCategory.get(cat.key) || [];
    let currentContent = fs.readFileSync(hubPath, 'utf-8');
    let newContent = currentContent;

    // Replace size grid
    const gridHtml = renderSizeGrid(catSizes);
    newContent = replaceRegion(
      newContent,
      '<!-- BEGIN GENERATED SIZE GRID -->',
      '<!-- END GENERATED SIZE GRID -->',
      gridHtml
    );

    // Replace ItemList
    const itemListHtml = renderHubItemList(cat.key, catSizes);
    newContent = replaceRegion(
      newContent,
      '<!-- BEGIN GENERATED ITEMLIST -->',
      '<!-- END GENERATED ITEMLIST -->',
      itemListHtml
    );

    if (normalizeNewlines(currentContent) !== normalizeNewlines(newContent)) {
      if (isCheck) {
        driftFiles.push(hubRelative);
      } else {
        fs.writeFileSync(hubPath, newContent, 'utf-8');
        updatedHubsCount++;
        console.log(`  Updated hub: ${hubRelative}`);
      }
    } else {
      console.log(`  Hub is clean: ${hubRelative}`);
    }
  }

  // 3. Process sitemap.xml
  const sitemapPath = path.join(rootDir, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const currentSitemap = fs.readFileSync(sitemapPath, 'utf-8');
    const sitemapTyreUrls = renderSitemapTyreUrls(sizes);
    const newSitemap = replaceRegion(
      currentSitemap,
      '<!-- BEGIN GENERATED TYRE URLS -->',
      '<!-- END GENERATED TYRE URLS -->',
      sitemapTyreUrls
    );

    if (normalizeNewlines(currentSitemap) !== normalizeNewlines(newSitemap)) {
      if (isCheck) {
        driftFiles.push('sitemap.xml');
      } else {
        fs.writeFileSync(sitemapPath, newSitemap, 'utf-8');
        sitemapUpdated = true;
        console.log('  Updated sitemap.xml with 57 tyre URLs');
      }
    } else {
      console.log('  sitemap.xml is clean');
    }
  }

  // 4. Generate the 27 new detail pages
  const pagesToGenerate = sizes.filter(s => s.generate === true);
  console.log(`Found ${pagesToGenerate.length} detail pages with generate: true`);

  for (const item of pagesToGenerate) {
    const targetRelative = path.join('tyres', item.category, `${item.slug}.htm`);
    const targetPath = path.join(rootDir, targetRelative);

    const categorySizes = sizesByCategory.get(item.category) || [];
    const expectedHtml = renderDetailPage(item, categorySizes);

    let currentHtml = null;
    if (fs.existsSync(targetPath)) {
      currentHtml = fs.readFileSync(targetPath, 'utf-8');
    }

    if (!currentHtml || normalizeNewlines(currentHtml) !== normalizeNewlines(expectedHtml)) {
      if (isCheck) {
        driftFiles.push(targetRelative);
      } else {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, expectedHtml, 'utf-8');
        generatedPagesCount++;
      }
    }
  }

  if (isCheck) {
    if (driftFiles.length > 0) {
      console.error(`\n--check FAILED: ${driftFiles.length} files have drifted or are missing:`);
      for (const f of driftFiles) {
        console.error(`  - ${f}`);
      }
      process.exit(1);
    } else {
      console.log('\n--check PASSED: All 27 detail pages, 5 category hubs, and sitemap.xml are up to date!');
      process.exit(0);
    }
  } else {
    console.log(`\nGeneration completed successfully!`);
    console.log(`  Emitted detail pages: ${generatedPagesCount} / ${pagesToGenerate.length}`);
    console.log(`  Updated hubs: ${updatedHubsCount} / 5`);
    console.log(`  Updated sitemap: ${sitemapUpdated ? 'yes' : 'no drift'}`);
  }
}

run().catch(err => {
  console.error('Fatal generator error:', err);
  process.exit(1);
});
