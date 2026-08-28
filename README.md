# 🚀 SEO & Growth Specialist — Google Antigravity Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Antigravity Plugin](https://img.shields.io/badge/Antigravity-Plugin-blue.svg)](https://antigravity.google)
[![MCP Protocol](https://img.shields.io/badge/MCP-Protocol-green.svg)](https://modelcontextprotocol.io)
[![Zero Budget](https://img.shields.io/badge/Strategy-Zero--Budget--Growth-brightgreen.svg)](#)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org)

The **SEO & Growth Specialist** is an autonomous, production-ready plugin for **Google Antigravity** that turns your AI assistant into a senior technical SEO, content optimization, growth hacking, and Core Web Vitals performance consultant with **zero advertising budget required**.

By leveraging 3 official Model Context Protocol (MCP) servers, the agent inspects real production data in real time:
1. **Google Search Console** (`google-search-console`): Real search queries, impressions, CTR, average positions, sitemaps, and URL indexing inspection.
2. **Google Analytics 4** (`google-analytics`): Sessions, user acquisition channels (organic, direct, referral, social), conversions, and custom events.
3. **Google PageSpeed Insights** (`pagespeed-insights`): Core Web Vitals (LCP, CLS, INP, FCP) and mobile/desktop performance diagnostics.

> 🇮🇹 *Per la guida completa in lingua italiana, consulta [README_IT.md](./README_IT.md).*

---

## 🧠 How It Works: Intelligent Auto-Discovery

You don't need to hardcode domain names or property IDs. The agent resolves your target website dynamically and automatically:

```mermaid
graph TD
    Start([User asks for an SEO audit or strategy]) --> Step1[1. Interrogate GSC MCP: list_sites]
    Step1 --> CheckSites{How many verified sites?}
    
    CheckSites -->|Exactly 1 site| Auto1[Auto-select site property immediately]
    CheckSites -->|Multiple sites| CheckRepo[2. Inspect Workspace Files & Prompt]
    
    CheckRepo --> MatchFound{Match found in project?}
    MatchFound -->|Yes| Auto2[Auto-select matching site]
    MatchFound -->|No| AskUser[3. Prompt user with interactive list of verified sites]
    
    Auto1 --> DetectStack[4. Auto-detect Tech Stack: Next.js, Astro, WordPress, Django, etc.]
    Auto2 --> DetectStack
    AskUser --> DetectStack
    
    DetectStack --> RunAudit[5. Execute Audit with GSC + GA4 + PageSpeed Insights]
```

1. **Search Console Auto-Selection**: Interrogates `list_sites`. If your Google Service Account has access to 1 site (standard setup), it selects it automatically without prompting you. If you manage multiple properties, it matches against your workspace domain or prompts you with an interactive selection.
2. **GA4 Dynamic Aggregation**: Interrogates `ga4_get_client_context` to confirm the configured GA4 Property ID.
3. **Framework-Aware Recommendations**: Inspects your project files (`package.json`, `robots.txt`, `sitemap.xml`, etc.) to tailor code snippets, metadata tags, and Core Web Vitals fixes to your specific tech stack (e.g. Next.js, Astro, Nuxt, SvelteKit, WordPress, Shopify, Django, Flask, static HTML).

---

## 📁 Plugin Architecture

```text
seo-growth-specialist/
├── plugin.json                 # Antigravity official plugin manifest
├── README.md                   # Official English documentation (GitHub)
├── README_IT.md                # Complete step-by-step Italian guide
├── runner.js                   # Lightweight zero-config dynamic MCP runner
├── credentials.json            # Unified credentials file (GSC + GA4 + PageSpeed) [GITIGNORED]
├── credentials.example.json    # Clean template ready for duplication
├── mcp_config.json             # 100% generic MCP configuration (zero hardcoded secrets)
├── rules/
│   └── AGENTS.md               # Persona, Role, and Data-Driven Principles
├── agents/
│   └── seo.md                  # Custom Agent & Subagent definition for the /agents menu
└── skills/
    └── seo-growth-specialist/
        ├── SKILL.md            # Standard Operating Procedures & Dynamic Context Flow
        └── references/
            ├── free_tools_stack.md           # 100% Free tools & analytics stack
            ├── programmatic_seo_playbook.md  # Scalable programmatic SEO playbook (4 archetypes)
            ├── geo_ai_optimization.md        # Generative Engine Optimization (ChatGPT, Perplexity, Gemini)
            └── growth_experiments_backlog.md # Zero-budget growth experiments backlog (ICE Framework)
```

---

## 📚 4 Built-In Specialized Playbooks

The plugin includes comprehensive, production-tested reference playbooks:

1. **[Programmatic SEO Playbook](./.agents/plugins/seo-growth-specialist/skills/seo-growth-specialist/references/programmatic_seo_playbook.md)**:
   - Covers 4 business archetypes: *Directory / Aggregators*, *E-Commerce & Marketplaces*, *SaaS & Software Tools*, and *Local Business & Lead Gen*.
   - Includes URL structures, anti-thin-content architecture, dynamic FAQ blocks, and Schema.org JSON-LD blueprints.
2. **[GEO & AI Search Optimization Guide](./.agents/plugins/seo-growth-specialist/skills/seo-growth-specialist/references/geo_ai_optimization.md)**:
   - Universal specification and template for `llms.txt` and `llms-full.txt`.
   - Strategies to get quoted as a primary source in **ChatGPT Search**, **Perplexity AI**, **Google Gemini AI Overviews**, and **Microsoft Copilot**.
3. **[Zero-Budget Growth Experiments Backlog](./.agents/plugins/seo-growth-specialist/skills/seo-growth-specialist/references/growth_experiments_backlog.md)**:
   - 6 actionable experiments prioritized using the **ICE Framework** (Impact, Confidence, Ease): Free tool/calculator magnets, viral URL sharing loops, SERP pixel maximizers (FAQPage), embeddable widgets, community-first distribution.
4. **[Free Tools & Diagnostics Stack](./.agents/plugins/seo-growth-specialist/skills/seo-growth-specialist/references/free_tools_stack.md)**:
   - Curated list of 100% free tools for keyword discovery, intent research, technical auditing, and Schema validation.

---

## ⚡ Prerequisites

Before installing, make sure you have:
* **[Google Antigravity](https://antigravity.google)** installed and configured.
* **Node.js (>= 18.0.0)** and `npx` installed on your machine (`node -v`).
* A Google Cloud Project with the free APIs enabled (see Step-by-Step guide below).

---

## 🚀 Installation

### Option A: Project-Level Installation (Recommended for Teams)
Install the plugin directly inside your repository so that every team member or agent in this project has access to it:

```bash
# From the root of your project:
mkdir -p .agents/plugins/
git clone https://github.com/CheckSim/SEO-Agent-Plugin.git .agents/plugins/seo-growth-specialist
```

### Option B: Global Installation (Available Across All Workspaces)
Make the plugin available everywhere on your machine:

```bash
mkdir -p ~/.gemini/config/plugins/
git clone https://github.com/CheckSim/SEO-Agent-Plugin.git ~/.gemini/config/plugins/seo-growth-specialist
```

---

## 🛠️ Step-by-Step Credentials Setup from Scratch

Follow these 4 simple steps to connect Google Search Console, Google Analytics 4, and PageSpeed Insights into a single `credentials.json` file:

---

### Step 1: Google Cloud Platform (GCP) Configuration

1. Open Google Cloud Console: **[console.cloud.google.com](https://console.cloud.google.com/)**
2. Create a **New Project** (e.g., `my-seo-agent`) or select an existing one.
3. **Enable the 3 Required APIs**:
   - Go to **APIs & Services > Library**.
   - Search for and enable each of the following:
     1. **Google Search Console API** (or *Webmaster Tools API*)
     2. **Google Analytics Data API**
     3. **PageSpeed Insights API**
4. **Create a Service Account**:
   - Go to **IAM & Admin > Service Accounts**.
   - Click **+ Create Service Account**.
   - Set a name (e.g., `mcp-agent`) and click **Create and Continue**.
   - Under Role, assign *Viewer* or continue, then click **Done**.
5. **Generate & Download the JSON Key**:
   - In the Service Accounts list, click on your newly created service account.
   - Go to the **Keys** tab.
   - Click **Add Key > Create new key**.
   - Select **JSON** format and click **Create**.
   - A `.json` credentials file will download to your machine.
6. **Create a Google API Key (for PageSpeed Insights)**:
   - Go to **APIs & Services > Credentials**.
   - Click **+ Create Credentials > API Key**.
   - Copy the generated key string (starts with `AIzaSy...`).
   - *(Recommended)*: Click *Restrict Key* and limit its usage exclusively to the *PageSpeed Insights API*.

---

### Step 2: Grant Permissions in Google Search Console

1. Open **[Google Search Console](https://search.google.com/search-console)** and select your website property.
2. In the left sidebar, click **Settings** (⚙️) at the bottom.
3. Click **Users and permissions**.
4. Click **Add user** at the top right.
5. Enter the Service Account email created in Step 1 (found in the downloaded JSON file under `client_email`, e.g., `mcp-agent@my-seo-agent.iam.gserviceaccount.com`).
6. Set Permission to: **Owner** or **Full**.
7. Click **Add**.

---

### Step 3: Grant Permissions & Retrieve GA4 Property ID

1. Open **[Google Analytics](https://analytics.google.com/)** and select your GA4 property.
2. In the lower-left corner, click **Admin** (⚙️).
3. Under the *Property* column, click **Property Access Management**.
4. Click the **+** button in the top right > **Add users**.
5. Enter the Service Account email (`client_email`), assign the **Viewer** role, and click **Add**.
6. **Retrieve your GA4 Property ID**:
   - Still under *Admin*, click **Property Details**.
   - In the top right corner, copy your 9-digit **PROPERTY ID** (e.g., `123456789`).

---

### Step 4: Prepare the Unified `credentials.json` File

1. Place the downloaded Service Account JSON file inside the plugin folder:
   - For project installation: `.agents/plugins/seo-growth-specialist/credentials.json`
   - For global installation: `~/.gemini/config/plugins/seo-growth-specialist/credentials.json`
2. Open `credentials.json` with your code editor and **append the two extra fields at the bottom**:
   - `"ga4_property_id"`: your 9-digit GA4 ID (e.g., `"123456789"`).
   - `"google_api_key"`: your Google Cloud API Key (e.g., `"AIzaSy..."`).

Your finalized `credentials.json` will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-gcp-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "mcp-agent@your-gcp-project-id.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mcp-agent%40your-gcp-project-id.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com",
  "ga4_property_id": "YOUR_GA4_PROPERTY_ID",
  "google_api_key": "YOUR_GOOGLE_CLOUD_API_KEY"
}
```

> [!TIP]
> Standard Google Auth libraries automatically ignore extra fields (`ga4_property_id` and `google_api_key`), while our built-in `runner.js` dynamically extracts them at runtime to configure all 3 MCP servers in parallel without manual environment variables!

---

## 💬 Natural Language Prompt Examples

Once configured, interact with the agent directly in the chat:

* **Keyword Audit & Quick Wins**:
  > *"Analyze our top queries by impressions on Search Console over the last 28 days and identify 5 quick wins in positions 4-15 to bring to top 3."*
* **Core Web Vitals Diagnostics**:
  > *"Run a PageSpeed Insights mobile audit for the homepage and highlight top opportunities to improve LCP under 2.5s."*
* **Traffic Acquisition & Conversions**:
  > *"What are our main traffic acquisition channels on GA4 over the last 14 days and which landing pages have the highest engagement?"*
* **Indexing Check**:
  > *"Inspect the indexing status of `https://mywebsite.com/landing-page` on Google Search Console."*
* **Programmatic SEO Design**:
  > *"Help me design a programmatic landing page template for our e-commerce product category based on our Search Console intent data."*
* **Generative Engine Optimization (GEO)**:
  > *"Generate an optimized `llms.txt` and `llms-full.txt` file for our website based on our core services."*

---

## 🔧 Troubleshooting & FAQ

### 1. Error: `403 Forbidden` on Google Search Console
* **Cause**: The Service Account email is not added as a user in GSC, or lacks sufficient permissions.
* **Fix**: Open GSC > *Settings* > *Users and permissions*, and make sure `client_email` is listed with **Owner** or **Full** permissions.

### 2. Error: `User does not have sufficient permissions` on Google Analytics 4
* **Cause**: The Service Account has not been granted access to the GA4 Property.
* **Fix**: Open GA4 > *Admin* > *Property Access Management*, click `+`, add the `client_email`, and grant the **Viewer** role.

### 3. Error: `Quota Exceeded` or slow response on PageSpeed Insights
* **Cause**: The `google_api_key` field is missing or invalid in `credentials.json`.
* **Fix**: Generate an API Key in Google Cloud Console, enable the *PageSpeed Insights API*, and paste the key string into `"google_api_key"`.

### 4. How do I switch between multiple websites?
* If your Service Account has access to multiple domains in Search Console, simply tell the agent which site you want to analyze (e.g. *"Analyze site2.com"*), or the agent will present the list of available properties.

---

## 🔒 Security & Git Best Practices

> [!CAUTION]
> **NEVER COMMIT `credentials.json` TO GITHUB OR ANY PUBLIC REPOSITORY!**

`credentials.json` contains your private Service Account RSA key. The repository includes a pre-configured `.gitignore` file that automatically excludes `credentials.json`. Always keep your secrets safe.

---

## 📄 License
Released under the [MIT License](LICENSE).
