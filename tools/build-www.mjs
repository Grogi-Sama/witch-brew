// Mağaza paketi için web dosyalarını www/ klasörüne hazırlar (Capacitor webDir).
// - Oyunun çalışması için gereken dosyaları kopyalar (assets/source gibi kaynaklar hariç)
// - JS dosyalarını küçültür ve değişken adlarını karıştırır (kopyalamayı zorlaştırır)
// Kullanım: npm run build   (ardından: npx cap sync)
import { promises as fs } from "node:fs";
import path from "node:path";
import { minify } from "terser";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const out = path.join(root, "www");
const COPY = ["index.html", "manifest.webmanifest", "css", "js", "assets"];
const SKIP = new Set([path.join("assets", "source")]); // üretim kaynakları pakete girmez

async function copy(rel) {
  if (SKIP.has(rel)) return;
  const src = path.join(root, rel), dst = path.join(out, rel);
  const st = await fs.stat(src);
  if (st.isDirectory()) {
    await fs.mkdir(dst, { recursive: true });
    for (const name of await fs.readdir(src)) await copy(path.join(rel, name));
  } else if (rel.endsWith(".js")) {
    const code = await fs.readFile(src, "utf8");
    // Dosyalar RT global nesnesi üzerinden konuşuyor; üst düzey adlar korunur,
    // fonksiyon içleri karıştırılır.
    const res = await minify(code, { compress: true, mangle: true, format: { comments: false } });
    await fs.writeFile(dst, res.code);
  } else {
    await fs.copyFile(src, dst);
  }
}

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
for (const rel of COPY) await copy(rel);
console.log("www/ hazır");
