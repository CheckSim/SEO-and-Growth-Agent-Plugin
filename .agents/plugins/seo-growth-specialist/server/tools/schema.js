/**
 * Schema.org JSON-LD Offline Validator & Rich Snippets Linter
 * 100% Free, Zero-Dependency Semantic Data Checker
 */

function validateSingleEntity(entity) {
  const errors = [];
  const warnings = [];
  const type = entity['@type'];

  if (!type) {
    errors.push('Proprietà "@type" mancante nell\'entità.');
    return { type: 'Unknown', errors, warnings };
  }

  // Common checks
  if (entity['@context'] && !entity['@context'].includes('schema.org')) {
    warnings.push(`"@context" insolito: "${entity['@context']}". Di solito deve essere "https://schema.org".`);
  }

  switch (type) {
    case 'FAQPage': {
      if (!entity.mainEntity || !Array.isArray(entity.mainEntity) || entity.mainEntity.length === 0) {
        errors.push('FAQPage richiede un array "mainEntity" contenente almeno un elemento Question.');
      } else {
        entity.mainEntity.forEach((q, idx) => {
          if (q['@type'] !== 'Question') {
            errors.push(`mainEntity[${idx}]: "@type" deve essere "Question".`);
          }
          if (!q.name) {
            errors.push(`mainEntity[${idx}]: Proprietà "name" (la domanda) mancante.`);
          }
          if (!q.acceptedAnswer || q.acceptedAnswer['@type'] !== 'Answer') {
            errors.push(`mainEntity[${idx}]: "acceptedAnswer" con "@type": "Answer" mancante.`);
          } else if (!q.acceptedAnswer.text) {
            errors.push(`mainEntity[${idx}]: "acceptedAnswer.text" (la risposta) mancante.`);
          }
        });
      }
      break;
    }

    case 'Product': {
      if (!entity.name) errors.push('Product: Proprietà "name" mancante.');
      if (!entity.image) warnings.push('Product: Proprietà "image" raccomandata per i rich snippet di Google.');
      if (!entity.description) warnings.push('Product: Proprietà "description" raccomandata.');
      if (!entity.offers) {
        errors.push('Product: Proprietà "offers" (Offer o AggregateOffer) mancante.');
      } else {
        const offers = entity.offers;
        if (offers['@type'] === 'Offer') {
          if (offers.price === undefined) errors.push('Offer: Proprietà "price" mancante.');
          if (!offers.priceCurrency) errors.push('Offer: Proprietà "priceCurrency" (es. EUR, USD) mancante.');
        } else if (offers['@type'] === 'AggregateOffer') {
          if (offers.lowPrice === undefined) errors.push('AggregateOffer: "lowPrice" mancante.');
          if (!offers.priceCurrency) errors.push('AggregateOffer: "priceCurrency" mancante.');
        }
      }
      break;
    }

    case 'Article':
    case 'BlogPosting':
    case 'NewsArticle': {
      if (!entity.headline) errors.push(`${type}: Proprietà "headline" mancante.`);
      if (!entity.image) warnings.push(`${type}: Proprietà "image" raccomandata per Google Discover e Top Stories.`);
      if (!entity.datePublished) warnings.push(`${type}: Proprietà "datePublished" raccomandata.`);
      if (!entity.author) warnings.push(`${type}: Proprietà "author" (Person o Organization) raccomandata per EEAT.`);
      break;
    }

    case 'LocalBusiness':
    case 'Restaurant':
    case 'Store':
    case 'Service': {
      if (!entity.name) errors.push(`${type}: Proprietà "name" mancante.`);
      if (!entity.address && type !== 'Service') warnings.push(`${type}: Proprietà "address" raccomandata per Local SEO.`);
      if (!entity.telephone && type !== 'Service') warnings.push(`${type}: Proprietà "telephone" raccomandata.`);
      break;
    }

    case 'HowTo': {
      if (!entity.name) errors.push('HowTo: Proprietà "name" mancante.');
      if (!entity.step || !Array.isArray(entity.step) || entity.step.length === 0) {
        errors.push('HowTo: Array "step" contenente almeno un "HowToStep" mancante.');
      }
      break;
    }

    case 'BreadcrumbList': {
      if (!entity.itemListElement || !Array.isArray(entity.itemListElement)) {
        errors.push('BreadcrumbList: Array "itemListElement" mancante.');
      } else {
        entity.itemListElement.forEach((item, idx) => {
          if (!item.position) errors.push(`itemListElement[${idx}]: Proprietà "position" mancante.`);
          if (!item.name) errors.push(`itemListElement[${idx}]: Proprietà "name" mancante.`);
          if (!item.item && idx < entity.itemListElement.length - 1) {
            warnings.push(`itemListElement[${idx}]: Proprietà "item" (URL) raccomandata per gli elementi intermedi.`);
          }
        });
      }
      break;
    }

    case 'SoftwareApplication': {
      if (!entity.name) errors.push('SoftwareApplication: Proprietà "name" mancante.');
      if (!entity.operatingSystem) warnings.push('SoftwareApplication: Proprietà "operatingSystem" raccomandata.');
      if (!entity.applicationCategory) warnings.push('SoftwareApplication: Proprietà "applicationCategory" raccomandata.');
      break;
    }

    default:
      if (!entity.name && !entity.headline) {
        warnings.push(`Tipo "${type}": Si consiglia di includere la proprietà "name" o "headline".`);
      }
      break;
  }

  return { type, errors, warnings };
}

function validateJsonLdSchema({ jsonLdContent }) {
  let parsed;
  if (typeof jsonLdContent === 'string') {
    try {
      const cleanString = jsonLdContent.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '').trim();
      parsed = JSON.parse(cleanString);
    } catch (err) {
      return {
        isValid: false,
        syntaxValid: false,
        error: `Errore sintattico nel JSON-LD: ${err.message}`,
        richSnippetEligible: false
      };
    }
  } else {
    parsed = jsonLdContent;
  }

  const entities = parsed['@graph'] && Array.isArray(parsed['@graph']) ? parsed['@graph'] : (Array.isArray(parsed) ? parsed : [parsed]);
  const validationResults = entities.map(validateSingleEntity);

  const totalErrors = validationResults.reduce((acc, v) => acc + v.errors.length, 0);
  const totalWarnings = validationResults.reduce((acc, v) => acc + v.warnings.length, 0);
  const isValid = totalErrors === 0;

  return {
    isValid,
    syntaxValid: true,
    entitiesValidatedCount: validationResults.length,
    entities: validationResults,
    totalErrors,
    totalWarnings,
    richSnippetEligible: isValid && totalErrors === 0,
    summary: isValid
      ? `✅ Markup JSON-LD valido e conforme per ${validationResults.map(v => v.type).join(', ')}.`
      : `❌ Rilevati ${totalErrors} errori bloccanti che impediscono la visualizzazione dei Rich Snippet su Google.`
  };
}

module.exports = {
  validateJsonLdSchema
};
