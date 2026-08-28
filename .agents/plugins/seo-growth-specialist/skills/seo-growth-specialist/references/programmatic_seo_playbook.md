# Universal Programmatic SEO Playbook

**Programmatic SEO (pSEO)** is the most scalable methodology for ranking across hundreds or thousands of transactional long-tail search queries by generating fast, data-rich, structured landing pages without risking thin or duplicate content penalties.

---

## 1. The 4 Core Business Archetypes of Programmatic SEO

Identify the archetype that fits your project model:

### Archetype 1: Directories, Comparators & Aggregators
* **Formula**: `[Entity A] × [Entity B]` or `[Service] in [Location]`
* **URL Examples**:
  - `/compare/[product-a]-vs-[product-b]`
  - `/routes/[origin-city]-to-[destination-city]`
  - `/pet-friendly-hotels/[state]/[city]`
  - `/pricing/[provider-a]-vs-[provider-b]`
* **Value Core**: Objective comparative data (pricing, specifications, user reviews, availability).

### Archetype 2: E-Commerce & Marketplaces
* **Formula**: `[Category] × [Attribute / Occasion / Audience]`
* **URL Examples**:
  - `/products/[category]-for-[occasion]` (e.g., *running-shoes-for-marathons*)
  - `/gifts/[recipient]-[price-range]` (e.g., *gifts-for-architects-under-50*)
  - `/clothing/[material]/[style]` (e.g., *cashmere-sweaters-oversized*)
* **Value Core**: Pre-filtered collections with in-stock products, customer ratings, and immediate checkout.

### Archetype 3: SaaS, Web Apps & Online Tools
* **Formula**: `[Format A] to [Format B]` or `[Integration] + [App]` or `Alternative to [Brand]`
* **URL Examples**:
  - `/convert/[input-format]-to-[output-format]` (e.g., *convert-csv-to-json*)
  - `/integrations/[tool-1]-with-[tool-2]` (e.g., *integrate-notion-with-slack*)
  - `/alternatives-to/[competitor-software]`
  - `/templates/[template-type]-for-[profession]` (e.g., *invoice-template-for-freelancers*)
* **Value Core**: Working interactive tool/calculator embedded on-page, direct template download, or feature-by-feature matrix.

### Archetype 4: Local Business & Lead Generation
* **Formula**: `[Specialized Service] in [City / Neighborhood]`
* **URL Examples**:
  - `/services/[service-type]/[city]` (e.g., *emergency-plumbing/austin-downtown*)
  - `/consulting/[legal-area]/[region]` (e.g., *employment-lawyer/chicago*)
* **Value Core**: Response times, service coverage radius, direct contact points, and localized testimonials.

---

## 2. Anatomy of a High-Performing Programmatic Page

To ensure sustainable rankings and prevent search engines from classifying generated pages as low-quality automated content, every page must feature:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Dynamic Header & Summary (H1 + Key Metric Badges)        │
├─────────────────────────────────────────────────────────────┤
│ 2. Core Value Engine (Comparison Table / Tool / Products)   │
├─────────────────────────────────────────────────────────────┤
│ 3. Differentiated Content (Data-driven conditional blocks)  │
├─────────────────────────────────────────────────────────────┤
│ 4. Contextual FAQ Section with JSON-LD FAQPage Schema       │
├─────────────────────────────────────────────────────────────┤
│ 5. Hub & Spoke Bidirectional Internal Linking Grid          │
└─────────────────────────────────────────────────────────────┘
```

1. **Dynamic Header & Assertive Summary**:
   - Clear `H1` precisely targeting the exact search query intent.
   - Summary box with concrete metrics (average cost, processing time, availability, ratings).
2. **Dynamic Core Value Engine**:
   - Live data table, comparison matrix, or pre-filtered inventory. Fresh, accurate data.
3. **Conditional Differentiated Content**:
   - Dynamic copy rendered conditionally (e.g., if `price < 50` render "Budget-Friendly Pick" block; if `availability == 0` render direct alternatives).
4. **Contextual FAQs**:
   - 3-5 genuine user questions generated from real search trends and page variables.
5. **Hub & Spoke Internal Linking**:
   - Bidirectional links to peer pages (e.g., *Nearby Cities*, *Similar Alternatives*, *Related Formats*) and parent category hubs.

---

## 3. Universal JSON-LD Structured Data Schemas

### E-Commerce & Products (`Product` + `AggregateOffer`)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{ page.title }}",
  "description": "{{ page.meta_description }}",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "{{ page.min_price }}",
    "highPrice": "{{ page.max_price }}",
    "priceCurrency": "USD",
    "offerCount": "{{ page.item_count }}"
  }
}
</script>
```

### Local Business / Services (`LocalBusiness` or `Service`)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "{{ page.service_name }}",
  "areaServed": {
    "@type": "City",
    "name": "{{ page.city_name }}"
  },
  "provider": {
    "@type": "LocalBusiness",
    "name": "{{ site.brand_name }}",
    "url": "{{ site.url }}"
  }
}
</script>
```

### Contextual FAQ Schema (`FAQPage`)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{ faq.question_1 }}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{ faq.answer_1 }}"
      }
    }
  ]
}
</script>
```
