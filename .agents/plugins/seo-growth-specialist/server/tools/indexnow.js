/**
 * IndexNow Engine (Bing, Yandex, Seznam, AI Crawlers)
 * Fast URL indexation notifier & key generator
 */

const https = require('https');
const crypto = require('crypto');

function generateKey(host) {
  const cleanHost = String(host || 'example.com').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const key = crypto.randomBytes(16).toString('hex');
  return {
    key,
    host: cleanHost,
    fileName: `${key}.txt`,
    fileContent: key,
    verificationUrl: `https://${cleanHost}/${key}.txt`,
    instructions: `Salva il file "${key}.txt" contenente la stringa "${key}" nella cartella root/public del tuo sito (${cleanHost}).`
  };
}

async function submitUrls({ host, key, urlList, keyLocation }) {
  const cleanHost = String(host).replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const urls = Array.isArray(urlList) ? urlList : [urlList];
  
  const payload = {
    host: cleanHost,
    key: key || crypto.randomBytes(16).toString('hex'),
    urlList: urls
  };

  if (keyLocation) {
    payload.keyLocation = keyLocation;
  }

  const payloadString = JSON.stringify(payload);

  const sendToIndexNow = (hostname) => {
    return new Promise((resolve) => {
      const req = https.request({
        hostname,
        path: '/indexnow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payloadString)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          resolve({
            endpoint: hostname,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            success: res.statusCode === 200 || res.statusCode === 202
          });
        });
      });

      req.on('error', (err) => {
        resolve({
          endpoint: hostname,
          error: err.message,
          success: false
        });
      });

      req.setTimeout(8000, () => {
        req.destroy();
        resolve({
          endpoint: hostname,
          error: 'Timeout',
          success: false
        });
      });

      req.write(payloadString);
      req.end();
    });
  };

  const results = await Promise.all([
    sendToIndexNow('api.indexnow.org'),
    sendToIndexNow('www.bing.com')
  ]);

  const anySuccess = results.some(r => r.success);

  return {
    host: cleanHost,
    submittedUrlsCount: urls.length,
    urlsSubmitted: urls,
    endpoints: results,
    overallStatus: anySuccess ? 'ACCEPTED' : 'FAILED',
    message: anySuccess 
      ? `Inviati con successo ${urls.length} URL a IndexNow per indicizzazione istantanea.`
      : `Invio fallito o in attesa di verifica della chiave su https://${cleanHost}/${payload.key}.txt`
  };
}

module.exports = {
  generateKey,
  submitUrls
};
