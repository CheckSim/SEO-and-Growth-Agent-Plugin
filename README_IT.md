# 🚀 SEO & Growth Specialist — Plugin per Google Antigravity

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Antigravity Plugin](https://img.shields.io/badge/Antigravity-Plugin-blue.svg)](https://antigravity.google)
[![MCP Protocol](https://img.shields.io/badge/MCP-Protocol-green.svg)](https://modelcontextprotocol.io)
[![Zero Budget](https://img.shields.io/badge/Strategia-Zero--Budget--Growth-brightgreen.svg)](#)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org)

Il **SEO & Growth Specialist** è un plugin autonomo e pronto all'uso per **Google Antigravity** che trasforma il tuo assistente AI in un consulente senior di SEO tecnica, ottimizzazione dei contenuti, growth hacking e monitoraggio delle performance Core Web Vitals a **costo zero (zero budget ADV)**.

Grazie all'integrazione di 4 server MCP (Model Context Protocol), l'agente analizza dati reali e copre l'intero funnel di crescita organica:
1. **Google Search Console** (`google-search-console`): Query reali digitate dagli utenti, impression, click, CTR, posizionamenti medi, sitemap e stato di indicizzazione.
2. **Google Analytics 4** (`google-analytics`): Sessioni, canali di acquisizione (organico, direct, referral, social), conversioni ed eventi personalizzati.
3. **Google PageSpeed Insights** (`pagespeed-insights`): Core Web Vitals (LCP, CLS, INP, FCP) e diagnosi prestazionale mobile/desktop.
4. **All-in-One Growth & Technical Suite** (`seo-growth-tools`):
   - **Google & Bing Suggest**: Espansione di keyword ad albero e intent cluster illimitati (100% gratuito, zero chiavi).
   - **Live Site Crawler & Page Auditor**: Verifica codici HTTP da sitemap, broken links (404), struttura H1-H3, meta tag e canonical.
   - **Schema.org JSON-LD Validator**: Validazione offline di sintassi e idoneità ai Google Rich Snippet.
   - **Instant Indexing (IndexNow)**: Notifica istantanea di nuovi URL a Bing, Yandex e crawler AI.
   - **Live SERP & Competitor Intelligence**: Posizionamenti top 10 su Google, box People Also Ask (PAA) e scraping profondo dei competitor.
   - **Generative Engine Optimization (GEO)**: Linter per file `llms.txt` e benchmark citazioni AI (Perplexity / Gemini).
   - **Community Intent Monitor**: Monitoraggio discussioni su Reddit e Hacker News per distribuzione organica a budget zero.

---

## 🧠 Come Funziona: Risoluzione Dinamica & Auto-Discovery

Non è necessario impostare domini o ID hardcodati nel codice. L'agente individua e gestisce il sito target in modo autonomo:

```mermaid
graph TD
    Start([Utente richiede un'analisi SEO o di crescita]) --> Step1[1. Interroga MCP GSC: list_sites]
    Step1 --> CheckSites{Quanti siti verificati trova?}
    
    CheckSites -->|Esattamente 1 sito| Auto1[Auto-selezione immediata della proprietà]
    CheckSites -->|Più di 1 sito| CheckRepo[2. Ispezione File del Workspace & Prompt]
    
    CheckRepo --> MatchFound{Trovato match nel progetto?}
    MatchFound -->|Sì| Auto2[Auto-selezione del sito corrispondente]
    MatchFound -->|No| AskUser[3. Mostra elenco interattivo dei siti verificati]
    
    Auto1 --> DetectStack[4. Rilevamento Tech Stack: Next.js, Astro, WordPress, Django, ecc.]
    Auto2 --> DetectStack
    AskUser --> DetectStack
    
    DetectStack --> RunAudit[5. Esecuzione Audit con GSC + GA4 + PageSpeed + Live Crawler + Intent Tools]
```

1. **Auto-Selezione Search Console**: Interroga `list_sites`. Se il tuo account ha accesso a un solo sito (scenario standard), lo seleziona all'istante. In presenza di più domini, effettua il match con il progetto aperto o ti propone la scelta.
2. **Aggancio Automatico GA4**: Verifica tramite `ga4_get_client_context` il Property ID configurato.
3. **Ottimizzazioni Adattive per il tuo Framework**: Analizza i file di configurazione locali (`package.json`, `robots.txt`, `sitemap.xml`) per adattare codice, meta tag e fix di Core Web Vitals al tuo stack specifico (Next.js, Astro, Nuxt, SvelteKit, WordPress, Shopify, Django, Flask, HTML statico).

---

## 📁 Struttura del Plugin

```text
SEO-and-Growth-Agent-Plugin/
├── package.json                # Gestione script (setup, test) e dipendenze root
├── setup.js                    # Script universale di auto-setup intelligente
├── credentials.example.json    # Template di esempio pronto all'uso
├── README.md                   # Documentazione ufficiale in inglese (GitHub)
├── README_IT.md                # Questa guida completa in italiano
├── LICENSE                     # Licenza open-source MIT
└── .agents/
    └── plugins/
        └── seo-growth-specialist/
            ├── plugin.json                 # Manifest formale del plugin per Antigravity
            ├── package.json                # Dipendenze e script interni del plugin
            ├── setup.js                    # Script di setup per installazione standalone
            ├── runner.js                   # Runner dinamico ibrido a zero-config per server MCP
            ├── credentials.json            # File UNICO di credenziali (GSC + GA4 + PageSpeed) [NON COMMETTERE]
            ├── credentials.example.json    # Template di backup per esportazione
            ├── mcp_config.json             # Configurazione generica dei 4 server MCP
            ├── rules/
            │   └── AGENTS.md               # Definizione del Ruolo, Persona e Principi Data-Driven
            ├── agents/
            │   └── seo.md                  # Definizione Custom Agent & Subagent per il menu /agents
            ├── server/                     # MCP Server nativo "seo-growth-tools" (Node.js puro)
            │   ├── index.js
            │   └── tools/ (suggest, indexnow, crawler, schema, serp, geo, community)
            ├── skills/
            │   └── seo-growth-specialist/  # Procedure Operative Standard & 4 Playbook
            └── test/
                └── suite.test.js           # Suite di test unitari automatizzati (5 test)
```

---

## 📚 4 Playbook Specialistici Inclusi

Il plugin include guide strategiche di riferimento immediatamente consultabili dall'agente:

1. **[Playbook Programmatic SEO](./.agents/plugins/seo-growth-specialist/skills/seo-growth-specialist/references/programmatic_seo_playbook.md)**:
   - Copre 4 grandi archetipi di business: *Directory & Comparatori*, *E-Commerce & Marketplace*, *SaaS & Web App*, e *Local Business & Lead Gen*.
   - Architettura URL, prevenzione del thin content, FAQ dinamiche e blueprint Schema.org JSON-LD.
2. **[Guida GEO & AI Search Optimization](./.agents/plugins/seo-growth-specialist/skills/seo-growth-specialist/references/geo_ai_optimization.md)**:
   - Standard universale per la creazione e manutenzione di `llms.txt` e `llms-full.txt`.
   - Tecniche di densità informativa per essere citati come fonte primaria da **ChatGPT Search**, **Perplexity**, **Google Gemini AI Overviews** e **Copilot**.
3. **[Backlog Esperimenti di Crescita a Costo Zero](./.agents/plugins/seo-growth-specialist/skills/seo-growth-specialist/references/growth_experiments_backlog.md)**:
   - 6 esperimenti prioritizzati con il framework **ICE** (Impatto, Confidenza, Facilità): calcolatori gratuiti, viral loop di condivisione URL, rich snippet FAQ, widget embeddabili e community distribution.
4. **[Stack di Strumenti Gratuiti](./.agents/plugins/seo-growth-specialist/skills/seo-growth-specialist/references/free_tools_stack.md)**:
   - Selezione dei migliori tool a costo zero per keyword discovery, crawling e validazione dati strutturati.

---

## ⚡ Prerequisiti

Prima di iniziare, assicurati di avere:
* **[Google Antigravity](https://antigravity.google)** installato e configurato.
* **Node.js (>= 18.0.0)** e `npx` installati sulla macchina (`node -v`).
* Un progetto Google Cloud con le API gratuite abilitate (vedi guida sotto).

---

## 🚀 Installazione Rapida in 60 Secondi

### Opzione A: Installazione nel Singolo Progetto (Consigliata per Team)
Installa il plugin direttamente nel repository del tuo sito affinché sia condiviso con tutti i collaboratori:

```bash
# Dalla cartella radice del tuo progetto:
mkdir -p .agents/plugins/
git clone https://github.com/CheckSim/SEO-and-Growth-Agent-Plugin.git .agents/plugins/seo-growth-specialist
cd .agents/plugins/seo-growth-specialist
npm run setup
```

### Opzione B: Installazione Globale (Disponibile in Tutti i Progetti)
Rendi il plugin accessibile per qualsiasi workspace o progetto aperto su Antigravity:

```bash
mkdir -p ~/.gemini/config/plugins/
git clone https://github.com/CheckSim/SEO-and-Growth-Agent-Plugin.git ~/.gemini/config/plugins/seo-growth-specialist
cd ~/.gemini/config/plugins/seo-growth-specialist
npm run setup
```

> [!TIP]
> **Cosa fa automaticamente `npm run setup`?**
> 1. Verifica che la configurazione MCP interna al plugin sia pronta e self-contained per Antigravity.
> 2. Se `credentials.json` non è presente, lo crea automaticamente dal template `credentials.example.json`.
> 3. Imposta i corretti permessi di esecuzione (`chmod 755`) su `runner.js`.
> 4. Pulisce in automatico eventuali configurazioni legacy duplicate per evitare processi doppi.
> 5. Esegue la suite di test unitari automatizzati certificando che l'engine sia al 100% operativo.

---

## 🛠️ Guida Passo-Passo alla Configurazione Credenziali

Segui questi 4 semplici passaggi per collegare Search Console, GA4 e PageSpeed in un unico file `credentials.json`:

---

### Passo 1: Configurazione su Google Cloud Platform (GCP)

1. Vai sulla console di Google Cloud: **[console.cloud.google.com](https://console.cloud.google.com/)**
2. Crea un **Nuovo Progetto** (es. `mio-agente-seo`) o seleziona un progetto esistente.
3. **Abilita le 3 API Necessarie**:
   - Vai su **API e servizi > Libreria**.
   - Cerca ed abilita ciascuna di queste API:
     1. **Google Search Console API** (o *Webmaster Tools API*)
     2. **Google Analytics Data API**
     3. **PageSpeed Insights API**
4. **Crea il Service Account**:
   - Vai su **IAM e amministrazione > Account di servizio**.
   - Clicca su **+ Crea account di servizio**.
   - Assegna un nome (es. `mcp-agent`) e clicca su **Crea e continua**.
   - Nel passaggio dei ruoli seleziona *Visualizzatore* (Viewer) o procedi oltre, poi clicca su **Fine**.
5. **Genera e Scarica la Chiave JSON**:
   - Nella lista degli account di servizio, clicca sull'account appena creato.
   - Vai nella scheda **Chiavi**.
   - Clicca su **Aggiungi chiave > Crea nuova chiave**.
   - Seleziona il formato **JSON** e clicca su **Crea**.
   - Verrà scaricato un file `.json` sul tuo computer.
6. **Crea l'API Key (per PageSpeed Insights)**:
   - Vai su **API e servizi > Credenziali**.
   - Clicca su **+ Crea credenziali > Chiave API**.
   - Copia la stringa generata (inizia con `AIzaSy...`).
   - *(Consigliato per sicurezza)*: Clicca su *Limita chiave* e consenti l'uso esclusivo per la *PageSpeed Insights API*.

---

### Passo 2: Assegna i Permessi su Google Search Console

1. Vai su **[Google Search Console](https://search.google.com/search-console)** e seleziona la proprietà del tuo sito web.
2. Nel menu a sinistra, clicca su **Impostazioni** (⚙️) in basso.
3. Clicca su **Utenti e autorizzazioni**.
4. Clicca su **Aggiungi utente** in alto a destra.
5. Inserisci l'email del Service Account creato al Passo 1 (trovata nel file JSON scaricato alla voce `client_email`, es: `mcp-agent@mio-agente-seo.iam.gserviceaccount.com`).
6. Seleziona l'autorizzazione: **Proprietario** (Owner) o **Completo** (Full).
7. Clicca su **Aggiungi**.

---

### Passo 3: Assegna i Permessi e Recupera il GA4 Property ID

1. Vai su **[Google Analytics](https://analytics.google.com/)** e seleziona la proprietà GA4 del tuo sito.
2. In basso a sinistra clicca sull'icona dell'ingranaggio (**Amministrazione**).
3. Nella colonna della *Proprietà*, clicca su **Gestione dell'accesso alla proprietà**.
4. Clicca sul pulsante **+** in alto a destra > **Aggiungi utenti**.
5. Inserisci l'email del Service Account (`client_email`) e assegna il ruolo **Visualizzatore** (Viewer). Clicca su **Aggiungi**.
6. **Trova il GA4 Property ID**:
   - Sempre in *Amministrazione*, clicca su **Dettagli della proprietà**.
   - In alto a destra troverai il tuo **ID PROPRIETÀ** (un numero di 9 cifre, es. `123456789`). Copialo.

---

### Passo 4: Configurazione del File Unico `credentials.json`

1. Se hai già eseguito `npm run setup`, il file `credentials.json` è già stato creato per te a partire dal template. Altrimenti, posiziona o copia il file dentro la cartella del plugin:
   - Per installazione nel progetto: `.agents/plugins/seo-growth-specialist/credentials.json`
   - Per installazione globale: `~/.gemini/config/plugins/seo-growth-specialist/credentials.json`
2. Apri `credentials.json` con un editor di testo, incolla la chiave Service Account scaricata da Google Cloud e **aggiungi in fondo i due campi extra**:
   - `"ga4_property_id"`: con il tuo ID numerico di GA4 (es. `"123456789"`).
   - `"google_api_key"`: con la tua API Key (es. `"AIzaSy..."`).

Il tuo file finale `credentials.json` risulterà così:

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
> Le librerie ufficiali di Google Auth ignorano automaticamente i campi aggiuntivi (`ga4_property_id` e `google_api_key`), mentre il nostro `runner.js` interno li leggerà dinamicamente all'avvio per configurare tutti e 3 i server MCP in parallelo senza bisogno di variabili d'ambiente manuali!

---

## 💬 Esempi di Utilizzo in Linguaggio Naturale

Una volta configurato, dialoga con l'agente direttamente in chat naturale:

* **Audit Keyword & Quick Wins**:
  > *"Analizza le query con più impression dell'ultimo mese su Search Console e trova 5 quick wins in posizione 4-15 da portare in top 3."*
* **Diagnosi Core Web Vitals**:
  > *"Esegui un'analisi PageSpeed Insights su mobile per l'homepage e suggerisci le ottimizzazioni prioritarie per migliorare l'LCP sotto i 2.5s."*
* **Analisi Sorgenti & Conversioni**:
  > *"Quali sono le principali sorgenti di traffico su GA4 nelle ultime 2 settimane e quali landing page hanno il tasso di engagement più alto?"*
* **Ispezione Indicizzazione**:
  > *"Verifica lo stato di indicizzazione dell'URL `https://miosito.it/landing-page` su Google Search Console."*
* **Progettazione Programmatic SEO**:
  > *"Aiutami a progettare una struttura di landing page programmatiche per la categoria prodotti del nostro e-commerce basandoti sui dati di Search Console."*
* **Ottimizzazione Generative AI (GEO)**:
  > *"Genera un file `llms.txt` e `llms-full.txt` ottimizzato per il nostro sito web partendo dai servizi descritti nel progetto."*

---

## 🔧 Risoluzione Problemi & Domande Frequenti (FAQ)

### 1. Errore: `403 Forbidden` su Google Search Console
* **Causa**: L'email del Service Account non è stata inserita tra gli utenti di GSC o non ha permessi sufficienti.
* **Soluzione**: Apri GSC > *Impostazioni* > *Utenti e autorizzazioni*, e verifica che `client_email` sia presente con ruolo **Proprietario** o **Completo**.

### 2. Errore: `User does not have sufficient permissions` su Google Analytics 4
* **Causa**: Il Service Account non è autorizzato sulla proprietà GA4.
* **Soluzione**: Apri GA4 > *Amministrazione* > *Gestione dell'accesso alla proprietà*, clicca `+`, aggiungi `client_email` e assegna il ruolo **Visualizzatore**.

### 3. Errore: `Quota Exceeded` o tempi lunghi su PageSpeed Insights
* **Causa**: Il campo `google_api_key` non è presente o la chiave API non è valida in `credentials.json`.
* **Soluzione**: Crea un'API Key in Google Cloud Console, abilita la *PageSpeed Insights API* e inseriscila nel campo `"google_api_key"`.

### 4. Come passo da un sito all'altro se gestisco più domini?
* Se il tuo account ha accesso a più siti su Search Console, puoi specificare direttamente nel prompt quale dominio analizzare (es. *"Fai un audit di miosito2.com"*), oppure l'agente ti mostrerà l'elenco dei siti disponibili chiedendoti quale analizzare.

---

## 🔒 Sicurezza e Best Practice Git

> [!CAUTION]
> **NON COMMITTARE MAI IL FILE `credentials.json` SU GITHUB O SU REPOSITORY PUBBLICI!**

Il file `credentials.json` contiene la chiave privata RSA del tuo Service Account. Il repository include un file `.gitignore` già configurato che esclude automaticamente `credentials.json`. Mantieni sempre al sicuro i tuoi segreti.

---

## 📄 Licenza
Rilasciato sotto licenza [MIT](LICENSE).
