// Ham ekran görüntülerinden mağaza kareleri (1080x1920) ve tanıtım görseli (1024x500) üretir.
// Önce: node tools/store-shots.mjs   Sonra: node tools/store-frames.mjs
// Çıktı: store/play/{tr,en}/01..06.png ve store/play/{tr,en}/feature.png
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

// Mağazadaki sıra = en etkileyiciden başlayarak
const FRAMES = {
  tr: [
    ["board", "Üçünü bul, iksirini kaynat!", "iksirini kaynat!"],
    ["recipe", "Tarifi takip et, kazanını büyüt", "Tarifi"],
    ["match", "Eşleştir, puf diye yok olsun!", "puf"],
    ["hard", "500+ seviye, kademe kademe", "500+"],
    ["jokers", "Sıkışınca büyülü jokerler", "büyülü jokerler"],
    ["menu", "Huzurlu bir cadı kulübesi", "cadı kulübesi"]
  ],
  en: [
    ["board", "Match 3, brew your potion!", "brew your potion!"],
    ["recipe", "Follow the recipe, grow your cauldron", "recipe"],
    ["match", "Match them and watch them go poof!", "poof!"],
    ["hard", "500+ levels to master", "500+"],
    ["jokers", "Stuck? Use magic jokers", "magic jokers"],
    ["menu", "A cozy witch's cottage awaits", "witch's cottage"]
  ]
};

const frameUrl = pathToFileURL(path.join(root, "tools", "store", "frame.html")).href;
const featureUrl = pathToFileURL(path.join(root, "tools", "store", "feature.html")).href;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] });
try {
  for (const lang of Object.keys(FRAMES)) {
    const out = path.join(root, "store", "play", lang);
    fs.mkdirSync(out, { recursive: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
    for (const [i, [scene, title, hl]] of FRAMES[lang].entries()) {
      const img = `../../store/raw/${lang}/${scene}.png`;
      await page.goto(`${frameUrl}?img=${encodeURIComponent(img)}&t=${encodeURIComponent(title)}&h=${encodeURIComponent(hl)}`, { waitUntil: "networkidle0" });
      await page.evaluate(() => document.fonts.ready);
      const file = path.join(out, String(i + 1).padStart(2, "0") + ".png");
      await page.screenshot({ path: file });
      console.log("✓", lang, path.basename(file), scene);
    }
    await page.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });
    await page.goto(`${featureUrl}?lang=${lang}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(out, "feature.png") });
    console.log("✓", lang, "feature.png");
    await page.close();
  }
} finally {
  await browser.close();
}
