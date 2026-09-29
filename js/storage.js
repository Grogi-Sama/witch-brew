// Kalıcı veriler: can, coin, joker stoku, seviye, ayarlar.
// Yumuşak can sistemi: en fazla 5 can, yalnızca kaybedince gider (bkz. PLAN.md).
// Şimdilik her şey bu cihazın localStorage'ında tutulur. Mağazaya çıkarken
// coin/satın alma bilgisi mutlaka sunucu tarafına (hesap sistemine) taşınmalı —
// localStorage kullanıcı tarafından kolayca değiştirilebilir.
(function () {
  var KEY = "witchbrew_save_v1";

  // ---- Ekonomi ayarları (tek yerden değiştirilebilsin diye burada) ----
  RT.CONFIG = {
    LIVES_MAX: 5,
    LIFE_REGEN_MS: 20 * 60 * 1000,   // her 20 dakikada 1 can
    START_COINS: 0,                   // coin: yalnızca gerçek para (ücretsiz kaynak: ödüllü reklamla joker/devam)
    START_JOKERS: 2,                  // her jokerden başlangıç stoku
    // Fiyatlar (referans: 100 coin ≈ 0,99 $)
    JOKER_PRICE: 25,                  // 1 joker (ya da 1 ödüllü reklam)
    LIFE_PRICE: 20,                   // eksik can başına; tüm canları doldurma en fazla REFILL_PRICE
    REFILL_PRICE: 50,
    CONTINUE_PRICE: 30,               // kazan dolunca coinle devam (reklam alternatifi)
    AD_SKIP_SEC: 5,                   // sahte reklamda "Reklamı Geç" butonu bu kadar saniye sonra çıkar
    // Oyna'ya basınca çıkan tam ekran reklam (bkz. PLAN.md):
    AD_FREE_LEVELS: 3,                // ilk 3 seviye reklamsız
    AD_COOLDOWN_MS: 60 * 1000,        // iki reklam arası en az 60 sn (ödüllü reklamlar da sayılır)
    // Tek seferlik "Reklamları Kaldır": zorunlu reklamları kaldırır, ödüllüler kalır
    REMOVE_ADS: { id: "noads", usd: 5.49, try: 79.99 },
    TRAY_SIZE: 7,
    BANK_MAX: 6,                      // bekleme alanında en fazla 6 taş (= 2 kez Kepçeyle Al)
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
      lives: RT.CONFIG.LIVES_MAX,
      lastRegen: Date.now(),
      coins: RT.CONFIG.START_COINS,
      jokers: {
        undo: RT.CONFIG.START_JOKERS, remove: RT.CONFIG.START_JOKERS,
        shuffle: RT.CONFIG.START_JOKERS, expand: RT.CONFIG.START_JOKERS
      },
      level: 1,
      tutorialSeen: false,
      discovered: 16,                        // "Yeni malzeme" penceresinde gösterilmiş taş sayısı
      starterBought: false,                  // başlangıç paketi alındı mı (tek seferlik)
      noAds: false,                          // "Reklamları Kaldır" satın alındı mı
      lastAdAt: 0,                           // son reklamın bittiği an (ms)
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

  // Gizlilik politikası adresi (mağaza sayfalarında da aynısı yazılacak)
  RT.PRIVACY_URL = "https://omnipopgames.com/privacy";

  RT.save = load();
  if (RT.save.lives > RT.CONFIG.LIVES_MAX) RT.save.lives = RT.CONFIG.LIVES_MAX;
  // Uygulamada kayıt ayrıca cihazın kalıcı depolamasına (Capacitor Preferences)
  // yazılır: iOS, WebView'in localStorage'ını yer açmak için silebiliyor.
  var Cap = window.Capacitor;
  var Prefs = Cap && Cap.isNativePlatform && Cap.isNativePlatform() ? Cap.registerPlugin("Preferences") : null;
  RT.persist = function () {
    var json = JSON.stringify(RT.save);
    try { localStorage.setItem(KEY, json); } catch (e) {}
    if (Prefs) Prefs.set({ key: KEY, value: json }).catch(function () {});
  };
  // localStorage silinmişse kalıcı depodaki kaydı geri yükle
  if (Prefs) {
    var hadLocal = false;
    try { hadLocal = !!localStorage.getItem(KEY); } catch (e) {}
    Prefs.get({ key: KEY }).then(function (r) {
      if (r && r.value && !hadLocal) {
        try { localStorage.setItem(KEY, r.value); location.reload(); } catch (e) {}
      } else if (hadLocal && !(r && r.value)) {
        RT.persist(); // ilk açılış: mevcut kaydı kalıcı depoya da yaz
      }
    }).catch(function () {});
  }

  // ---- Can sistemi ----
  // Can tam değilse her LIFE_REGEN_MS'de bir can dolar. Uygulama kapalıyken
  // geçen süre de sayılır (lastRegen'den bu yana geçen süreye bakılır).
  RT.tickLives = function () {
    var s = RT.save, C = RT.CONFIG;
    if (s.lives >= C.LIVES_MAX) { s.lastRegen = Date.now(); return; }
    var gained = Math.floor((Date.now() - s.lastRegen) / C.LIFE_REGEN_MS);
    if (gained > 0) {
      s.lives = Math.min(C.LIVES_MAX, s.lives + gained);
      s.lastRegen += gained * C.LIFE_REGEN_MS;
      if (s.lives >= C.LIVES_MAX) s.lastRegen = Date.now();
      RT.persist();
    }
  };

  RT.msToNextLife = function () {
    if (RT.save.lives >= RT.CONFIG.LIVES_MAX) return 0;
    return Math.max(0, RT.save.lastRegen + RT.CONFIG.LIFE_REGEN_MS - Date.now());
  };

  RT.addLives = function (n) {
    var wasFull = RT.save.lives >= RT.CONFIG.LIVES_MAX;
    RT.save.lives = Math.min(RT.CONFIG.LIVES_MAX, RT.save.lives + n);
    if (RT.save.lives >= RT.CONFIG.LIVES_MAX || wasFull) RT.save.lastRegen = Date.now();
    RT.persist();
  };

  RT.spendLife = function () {
    if (RT.save.lives >= RT.CONFIG.LIVES_MAX) RT.save.lastRegen = Date.now();
    RT.save.lives = Math.max(0, RT.save.lives - 1);
    RT.persist();
  };

  // Eksik canları doldurmanın coin fiyatı (can doluysa 0)
  RT.refillPrice = function () {
    var missing = RT.CONFIG.LIVES_MAX - RT.save.lives;
    return Math.min(RT.CONFIG.REFILL_PRICE, Math.max(0, missing) * RT.CONFIG.LIFE_PRICE);
  };

  RT.formatTime = function (ms) {
    var t = Math.ceil(ms / 1000), m = Math.floor(t / 60), s = t % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  };

  // ---- Reklam kuralı ----
  // Oyna'da tam ekran reklam: satın alınmamışsa, seviye > 3 ise ve son reklamdan
  // bu yana en az 60 sn geçtiyse. "Tekrar Dene" hiç reklam göstermez (ui.js).
  RT.needsInterstitial = function (level) {
    var s = RT.save, C = RT.CONFIG;
    return !s.noAds && level > C.AD_FREE_LEVELS && Date.now() - s.lastAdAt >= C.AD_COOLDOWN_MS;
  };
  RT.markAdShown = function () { RT.save.lastAdAt = Date.now(); RT.persist(); };

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
