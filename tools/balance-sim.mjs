// Seviye dengesi simülasyonu: js/level.js'i tarayıcı olmadan çalıştırır ve her
// seviyeyi joker kullanmayan basit bir "bot oyuncu" ile N kez oynatır.
// Kullanım: node tools/balance-sim.mjs [N=40] [seviyeler: 1,2,3 | 1-600:25]
// Bot ortalamanın altında bir oyuncudur; gerçek oyuncu jokerlerle daha iyi oynar.
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const src = fs.readFileSync(path.join(root, "js", "level.js"), "utf8");
const RT = { save: { level: 1 } };
const ctx = { RT, Image: function () {}, Math, console };
vm.createContext(ctx);
vm.runInContext(src, ctx);

// Oyundaki gibi: kazan 7 yuva, tarif tamamlanınca +1
export function play(level) {
  const b = RT.buildLevel(level);
  let tiles = b.tiles.map(t => ({ ...t }));
  let tray = [], max = 7;
  const types = [...new Set(tiles.map(t => t.type))];
  const steps = RT.shuffle(types.slice()).slice(0, level >= 10 ? 3 : 2);
  let done = 0;
  for (;;) {
    if (!tiles.length && !tray.length) return true;
    const open = tiles.filter(t => !RT.isCovered(t, tiles));
    if (!open.length) return false;
    const cnt = {}; tray.forEach(t => cnt[t] = (cnt[t] || 0) + 1);
    const oc = {}; open.forEach(t => oc[t.type] = (oc[t.type] || 0) + 1);
    const pick = open.find(t => cnt[t.type] === 2)
      || open.filter(t => cnt[t.type] === 1).sort((a, c) => oc[c.type] - oc[a.type])[0]
      || (tray.length < max - 2 && open.find(t => oc[t.type] >= 3))
      || open.find(t => t.type === steps[done])
      || open.slice().sort((a, c) => oc[c.type] - oc[a.type])[0];
    tiles.splice(tiles.indexOf(pick), 1); tray.push(pick.type);
    if (tray.filter(t => t === pick.type).length === 3) {
      tray = tray.filter(t => t !== pick.type);
      if (done < steps.length && steps[done] === pick.type && ++done === steps.length) max++;
    } else if (tray.length >= max) return false;
  }
}

function parseLevels(arg) {
  if (!arg) return [1, 2, 3, 5, 8, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600];
  if (arg.includes("-")) {
    const [a, rest] = arg.split("-"); const [b, step] = rest.split(":");
    const out = []; for (let n = +a; n <= +b; n += +(step || 1)) out.push(n); return out;
  }
  return arg.split(",").map(Number);
}

const N = +(process.argv[2] || 40);
const levels = parseLevels(process.argv[3]);
for (const L of levels) {
  let w = 0; for (let i = 0; i < N; i++) if (play(L)) w++;
  const c = RT.levelConfig(L);
  const tag = c.hard ? " HARD" : c.easy ? " easy" : "";
  console.log(`L${String(L).padStart(4)}: %${String(Math.round(100 * w / N)).padStart(3)} | tür ${c.types}, taş ${c.main + c.stack * 2}, kat ${c.layers}, deste ${c.stack}${tag}`);
}
