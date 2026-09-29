// Mağaza ekran görüntüleri: oyunu yerel Chrome'da 1080x1920 (360x640 @3x) açar,
// sahneleri oyunun kendi fonksiyonlarıyla kurar ve ham görüntüleri kaydeder.
// Ön koşul: yerel sunucu çalışıyor olmalı (tools/serve.ps1, port 8793).
// Kullanım: node tools/store-shots.mjs            → store/raw/{tr,en}/*.png
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const GAME_URL = "http://localhost:8793/";
const KEY = "witchbrew_save_v1";

function save(level, lang, extra = {}) {
  return {
    coins: 250, jokers: { undo: 3, remove: 2, shuffle: 2, expand: 1 }, level, tutorialSeen: true,
    discovered: 48, starterBought: false, noAds: true, lastAdAt: 0, lives: 5, lastRegen: Date.now(),
    settings: { musicVol: 0, sfxVol: 0, lang }, ...extra
  };
}

// Sayfa içinde çalışan yardımcılar
const HELPERS = `
  window.__sleep = ms => new Promise(r => setTimeout(r, ms));
  window.__src = e => e.querySelector('img').getAttribute('src');
  window.__open = () => [...document.querySelectorAll('#board .tile:not(.covered)')];
  window.__tray = () => [...document.querySelectorAll('#tray .tile img')].map(i => i.getAttribute('src'));
  window.__tap = async el => { el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); await __sleep(320); };
  window.__play = async () => { document.querySelector('[data-action=play]').click(); await __sleep(500);
    if (!document.getElementById('modal').hidden) { document.querySelector('[data-m=go]')?.click(); await __sleep(500); } };
  // Kazanda aynı türden 'k' tane olacak şekilde, tamamlamadan taş seç
  window.__pickPairs = async (pairs) => {
    for (let p = 0; p < pairs; p++) {
      const cnt = {}; __open().forEach(e => cnt[__src(e)] = (cnt[__src(e)] || 0) + 1);
      const inTray = new Set(__tray());
      const t = Object.keys(cnt).find(k => cnt[k] >= 2 && !inTray.has(k));
      if (!t) break;
      for (let i = 0; i < 2; i++) { const el = __open().find(e => __src(e) === t); if (el) await __tap(el); }
    }
  };
  // Tarifte sıradaki malzemeyi tamamlamaya çalış (en fazla 'moves' hamle)
  window.__advanceRecipe = async (target, moves) => {
    for (let m = 0; m < moves; m++) {
      if (document.querySelectorAll('#recipe .r-step.done').length >= target) return true;
      const next = document.querySelector('#recipe .r-step.next img')?.getAttribute('src');
      const tr = __tray(); const c = {}; tr.forEach(t => c[t] = (c[t] || 0) + 1);
      const open = __open();
      const el = open.find(e => __src(e) === next) || open.find(e => c[__src(e)] === 2) || open.find(e => c[__src(e)] === 1) || open[0];
      if (!el || tr.length >= 5) return false;
      await __tap(el);
    }
    return document.querySelectorAll('#recipe .r-step.done').length >= target;
  };
`;

const SCENES = {
  // 1) Oyun tahtası: kalabalık tahta, kazanda iki çift
  board: { level: 12, run: async () => { await __play(); await __pickPairs(2); } },
  // 2) İksir tarifi: bir adımı tamamlanmış tarif
  recipe: { level: 34, run: async () => { await __play(); await __advanceRecipe(1, 40); await __pickPairs(1); },
    // tarifte en az bir ✓ olsun, kazan kırmızı uyarı vermesin
    ok: () => document.querySelectorAll('#recipe .r-step.done').length >= 1 && !document.getElementById('tray').classList.contains('danger') },
  // 3) Eşleşme anı: üçüncü taş kazana düşerken mor duman
  match: { level: 18, run: async () => {
    await __play();
    const cnt = {}; __open().forEach(e => cnt[__src(e)] = (cnt[__src(e)] || 0) + 1);
    const t = Object.keys(cnt).find(k => cnt[k] >= 3);
    if (t) { for (let i = 0; i < 3; i++) { const el = __open().find(e => __src(e) === t); el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); await __sleep(i < 2 ? 320 : 330); } }
  } },
  // 4) Jokerler: Kepçeyle Al ile yukarıda bekleyen taşlar + kazanda taşlar
  jokers: { level: 26, run: async () => {
    await __play();
    const open = __open(); const seen = new Set();
    for (const e of open) { if (seen.size >= 3) break; const s = __src(e); if (!seen.has(s)) { seen.add(s); await __tap(e); } }
    document.querySelector('[data-joker=remove]').click(); await __sleep(300);
    await __pickPairs(1);
  } },
  // 5) Zor seviye (500+ seviye vurgusu)
  hard: { level: 60, run: async () => { await __play(); await __pickPairs(1); await __sleep(150); } },
  // 6) Ana menü
  menu: { level: 128, run: async () => { await __sleep(600); } },
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--mute-audio", "--autoplay-policy=no-user-gesture-required"] });
try {
  for (const lang of ["tr", "en"]) {
    const dir = path.join(root, "store", "raw", lang);
    fs.mkdirSync(dir, { recursive: true });
    for (const [name, scene] of Object.entries(SCENES)) {
      const page = await browser.newPage();
      await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
      await page.evaluateOnNewDocument((k, v) => { localStorage.setItem(k, v); }, KEY, JSON.stringify(save(scene.level, lang)));
      // Seviyeler rastgele dizildiği için sahnenin şartı tutana kadar yeniden dene
      for (let attempt = 1; attempt <= 15; attempt++) {
        await page.goto(GAME_URL, { waitUntil: "networkidle0" });
        await page.evaluate(HELPERS);
        await page.evaluate(`(${scene.run.toString()})()`);
        if (!scene.ok || await page.evaluate(`(${scene.ok.toString()})()`)) break;
      }
      await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
      const file = path.join(dir, name + ".png");
      await page.screenshot({ path: file });
      console.log("✓", lang, name);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
