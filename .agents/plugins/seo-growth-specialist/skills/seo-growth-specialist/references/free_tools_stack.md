# Free Tools Stack for SEO & Organic Growth

This guide curates the most effective 100% free tools (and generous free tiers) to analyze, optimize, and scale organic traffic for any website without software licensing costs or paid advertising.

---

## 1. Integrated MCP Tools (Direct Agent Access)

### Google Search Console (GSC)
- **What it does**: Direct production search performance data including user queries, impressions, clicks, CTR, average rankings, XML sitemaps, and URL indexing health.
- **Integration**: Available inside the agent via the `google-search-console` MCP server (`list_sites`, `search_analytics`, `detect_quick_wins`, `index_inspect`, `list_sitemaps`).
- **Use Case**: Automatically detect queries in positions 4-15 to optimize on-page copy and jump into the top 3.

### Google Analytics 4 (GA4)
- **What it does**: User behavioral analytics, acquisition channels (organic, direct, referral, social), session duration, and key conversion events.
- **Integration**: Available inside the agent via the `google-analytics` MCP server (`ga4_run_report`, `ga4_realtime_report`, `ga4_get_client_context`).
- **Use Case**: Track conversion rates and pinpoint high-engagement landing pages.

### Google PageSpeed Insights
- **What it does**: Real-time diagnostic audits for Core Web Vitals (**LCP**, **CLS**, **INP**, **FCP**) across laboratory simulations (Lighthouse) and real-world field data (CrUX) for mobile and desktop.
- **Integration**: Available inside the agent via the `pagespeed-insights` MCP server (`pagespeed_analyze_page`, `pagespeed_diagnose_page`, `pagespeed_get_field_data`, `pagespeed_compare_pages`, `pagespeed_analyze_batch`).
- **Use Case**: Continuous auditing to keep mobile LCP under 2.5s and prevent mobile ranking penalties.

---

## 2. Free Keyword Research & Intent Discovery

### Google Trends
- **URL**: [trends.google.com](https://trends.google.com/)
- **What it does**: Historical seasonality trends, relative search volumes over time, and rising "Breakout" related queries.
- **Use Case**: Plan content release schedules ahead of predictable seasonal demand peaks.

### AnswerThePublic & AlsoAsked (Free Tiers)
- **URL**: [answerthepublic.com](https://answerthepublic.com/) / [alsoasked.com](https://alsoasked.com/)
- **What it does**: Maps real-world question modifiers ("How to...", "What is the best...", "Why does...").
- **Use Case**: Uncover genuine user questions to build high-utility FAQ sections with `FAQPage` schema markup.

### Bing Webmaster Tools
- **URL**: [bing.com/webmasters](https://www.bing.com/webmasters)
- **What it does**: Search indexation for Bing and Microsoft Copilot, with a built-in free Keyword Research tool featuring historical query data and backlink diagnostics. One-click sync from Google Search Console.

---

## 3. Technical SEO, Performance & Schema Validation

### Schema Markup Validator & Rich Results Test
- **URL**: [validator.schema.org](https://validator.schema.org/) / [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- **What it does**: Validates JSON-LD schema syntax and verifies eligibility for Google Rich Snippets in SERPs.

### Screaming Frog SEO Spider (Free up to 500 URLs)
- **URL**: [screamingfrog.co.uk](https://www.screamingfrog.co.uk/seo-spider/)
- **What it does**: Full site crawler to identify broken links (404), redirect chains, duplicate/missing titles and meta descriptions, canonical errors, and oversized assets.

---

## 4. Backlink Analysis & Domain Authority (Free Tiers)

### Ahrefs Free Backlink Checker & Authority Checker
- **URL**: [ahrefs.com/backlink-checker](https://ahrefs.com/backlink-checker) / [ahrefs.com/website-authority-checker](https://ahrefs.com/website-authority-checker)
- **What it does**: Checks incoming backlinks, Domain Rating (DR), and anchor text distributions to monitor link building progress.
