// Renderiza as camadas de overlay (atrás/frente) em PNG com transparência, via Chromium (Playwright).
// Uso: node scripts/03_render_overlay.mjs [--from t] [--to t] [--at t1,t2,...] [--out dir] [--no-marker] [--workers N]
import { createRequire } from 'module'; const { chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i < 0 ? d : (process.argv[i + 1] ?? true) };
const FPS = 30, TOTAL = Number(arg('total', 152.3));
const out = path.resolve(arg('out', path.join(root, 'work/overlay')));
const at = arg('at', null);
const noMarker = process.argv.includes('--no-marker');
const workers = Number(arg('workers', 3));
fs.mkdirSync(out + '/behind', { recursive: true }); fs.mkdirSync(out + '/front', { recursive: true });
let frames;
if (at) frames = at.split(',').map(s => Math.round(Number(s) * FPS));
else { const f0 = Math.round(Number(arg('from', 0)) * FPS), f1 = Math.round(Number(arg('to', TOTAL)) * FPS); frames = []; for (let f = f0; f <= f1; f++) frames.push(f); }
const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--font-render-hinting=none', '--disable-lcd-text'] });
const chunks = Array.from({ length: workers }, () => []);
const per = Math.ceil(frames.length / workers); frames.forEach((f, i) => chunks[Math.min(workers - 1, Math.floor(i / per))].push(f));
const results = new Map();
async function work(list) {
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('PAGEERROR', e.message)); page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()) });
  await page.goto('file://' + root + '/overlay/index.html'); await page.evaluate(() => window.ready);
  if (noMarker) await page.addStyleTag({ content: '.marker{display:none!important}' });
  let prev = { behind: '', front: '' }, prevFile = { behind: null, front: null };
  for (const f of list) {
    const t = f / FPS;
    const sig = await page.evaluate(t => window.renderAt(t), t);
    await page.evaluate(() => Promise.all([...document.images].map(i => i.decode ? i.decode().catch(() => {}) : 0)));
    const rec = {};
    for (const layer of ['behind', 'front']) {
      if (!sig[layer]) { rec[layer] = null; prev[layer] = ''; prevFile[layer] = null; continue }
      if (sig[layer] === prev[layer] && prevFile[layer]) { rec[layer] = prevFile[layer]; continue }
      await page.evaluate(n => window.setLayer(n), layer);
      const file = `${layer}/${String(f).padStart(5, '0')}.png`;
      await page.screenshot({ path: path.join(out, file), omitBackground: true, type: 'png' });
      rec[layer] = file; prev[layer] = sig[layer]; prevFile[layer] = file;
    }
    results.set(f, rec);
  }
  await ctx.close();
}
const t0 = Date.now();
await Promise.all(chunks.map(work));
await browser.close();
const manifest = {}; [...results.keys()].sort((a, b) => a - b).forEach(f => manifest[f] = results.get(f));
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest));
const nb = new Set(Object.values(manifest).map(r => r.behind).filter(Boolean)).size, nf = new Set(Object.values(manifest).map(r => r.front).filter(Boolean)).size;
console.log(`frames=${frames.length} únicos behind=${nb} front=${nf} tempo=${((Date.now() - t0) / 1000).toFixed(0)}s`);
