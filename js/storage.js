// Kalıcı veriler: coin, joker stoku, seviye, ayarlar.
// Can sistemi yok: oyuncu sınırsız oynar (bkz. PLAN.md).
// Şimdilik her şey bu cihazın localStorage'ında tutulur. Mağazaya çıkarken
// coin/satın alma bilgisi mutlaka sunucu tarafına (hesap sistemine) taşınmalı —
// localStorage kullanıcı tarafından kolayca değiştirilebilir.
(function () {
  var KEY = "witchbrew_save_v1";

  // ---- Ekonomi ayarları (tek yerden değiştirilebilsin diye burada) ----
  RT.CONFIG = {
    START_COINS: 0,                   // coin: yalnızca gerçek para (ücretsiz kaynak: ödüllü reklamla joker/devam)
    START_JOKERS: 2,                  // her jokerden başlangıç stoku
    // Fiyatlar (referans: 100 coin ≈ 0,99 $)
    JOKER_PRICE: 25,                  // 1 joker (ya da 1 ödüllü reklam)
    CONTINUE_PRICE: 30,               // kazan dolunca coinle devam (reklam alternatifi)
    AD_SKIP_SEC: 5,                   // sahte reklamda "Reklamı Geç" butonu bu kadar saniye sonra çıkar
    TRAY_SIZE: 7,
    BANK_MAX: 6,                      // bekleme alanında en fazla 6 taş (= 2 kez Taşı Kaldır)
    // Coin paketleri. Fiyatlar mağazada ülke ülke girilir; oyun yayında fiyat
    // yazısını mağazadan alır. Buradaki try/usd yalnızca web test sürümü için.
    COIN_PACKS: [
      { id: "pack1", coins: 100,  bonus: 0,  usd: 1.09,  try: 19.99 },
      { id: "pack2", coins: 330,  bonus: 10, usd: 3.29,  try: 49.99 },
      { id: "pack3", coins: 600,  bonus: 20, usd: 5.49,  try: 79.99 },
      { id: "pack4", coins: 1300, bonus: 30, usd: 10.99, try: 149.99, badge: "popular" },
      { id: "pack5", coins: 2800, bonus: 40, usd: 21.99, try: 279.99 },
      { id: "pack6", coins: 7500, bonus: 50, usd: 54.99, try: 649.99, badge: "best" }
    ],
    // Tek seferlik başlangıç paketi: coin + her jokerden 3 adet
    STARTER_PACK: { id: "starter", coins: 250, jokers: 3, usd: 2.19, try: 34.99 }
  };

  function defaults() {
    return {
      coins: RT.CONFIG.START_COINS,
      jokers: {
        undo: RT.CONFIG.START_JOKERS, remove: RT.CONFIG.START_JOKERS,
        shuffle: RT.CONFIG.START_JOKERS, expand: RT.CONFIG.START_JOKERS
      },
      level: 1,
      tutorialSeen: false,
      discovered: 16,                        // "Yeni malzeme" penceresinde gösterilmiş taş sayısı
      starterBought: false,                  // başlangıç paketi alındı mı (tek seferlik)
      settings: { musicVol: 50, sfxVol: 80, lang: null } // ses seviyeleri 0-100
    };
  }

  function load() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    var def = defaults();
    if (!d) return def;
    // Yeni alanlar eklendiğinde eski kayıtlar bozulmasın
    for (var k in def) if (d[k] === undefined) d[k] = def[k];
    for (var j in def.jokers) if (d.jokers[j] === undefined) d.jokers[j] = def.jokers[j];
    for (var s in def.settings) if (d.settings[s] === undefined) d.settings[s] = def.settings[s];
    return d;
  }

  RT.save = load();
  RT.persist = function () {
    try { localStorage.setItem(KEY, JSON.stringify(RT.save)); } catch (e) {}
  };

  RT.spendCoins = function (n) {
    if (RT.save.coins < n) return false;
    RT.save.coins -= n;
    RT.persist();
    return true;
  };

  // Web test sürümünde bölge tahmini: saat dilimi İstanbul ise TL, değilse USD.
  // (Yayında fiyat ve para birimini mağaza, oyuncunun hesap ülkesine göre verir.)
  RT.region = (function () {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone === "Europe/Istanbul" ? "TR" : "INTL"; }
    catch (e) { return "INTL"; }
  })();
  RT.priceLabel = function (pack) {
    return RT.region === "TR"
      ? new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(pack.try)
      : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(pack.usd);
  };
})();
