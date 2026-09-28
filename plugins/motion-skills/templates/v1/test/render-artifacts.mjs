import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const look of ['riso', 'enamel']) {
  const page = await browser.newPage({ viewport: { width: 320, height: 180 } });
  const url = new URL(pathToFileURL(path.join(root, 'index.html')));
  url.search = new URLSearchParams({ mode: 'preview', width: '320', height: '180', duration: '2', bpm: '120', look, time: '.8' });
  await page.goto(url.href); await page.locator('canvas').screenshot({ path: path.join(root, 'artifacts', `smoke-${look}.png`) }); await page.close();
}
await browser.close();
console.log('rendered artifacts/smoke-riso.png and artifacts/smoke-enamel.png');
