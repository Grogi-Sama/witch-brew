// Uygulama içi satın alma katmanı (RevenueCat). Mağaza uygulamasında gerçek ödeme;
// web sürümünde native=false olur ve ui.js test modunda (ödemesiz) çalışır.
//
// Ürün kimlikleri Google Play Console ve App Store Connect'te BİREBİR aynı adla
// oluşturulmalı; bir kez oluşturulunca değiştirilemez. RevenueCat panelinde de
// bu ürünler içe aktarılır. API anahtarları RevenueCat → Project → API keys.
(function () {
  var API_KEYS = {
    android: "",   // "goog_…"  (RevenueCat Google Play uygulamasının herkese açık anahtarı)
    ios: ""        // "appl_…"  (RevenueCat App Store uygulamasının herkese açık anahtarı)
  };

  // Oyundaki paket kimliği → mağaza ürün kimliği
  RT.PRODUCTS = {
    pack1: "coins_100", pack2: "coins_330", pack3: "coins_600",
    pack4: "coins_1300", pack5: "coins_2800", pack6: "coins_7500",
    starter: "starter_pack",   // tek seferlik (tüketilmeyen)
    noads: "remove_ads"        // tek seferlik (tüketilmeyen), kalıcı
  };
  var ONE_TIME = { starter_pack: true, remove_ads: true };

  var Cap = window.Capacitor;
  var native = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  var platform = native ? Cap.getPlatform() : "web";
  var Purchases = native && API_KEYS[platform] ? Cap.registerPlugin("Purchases") : null;

  var products = {};   // mağaza ürün kimliği → mağazadan gelen ürün (yerel fiyatla)
  var busy = false;

  RT.iap = { native: !!Purchases };

  // Tek seferlik ürünleri kayda işle (satın alma ya da geri yükleme sonrası).
  // Başlangıç paketi geri yüklenince coin/joker TEKRAR verilmez, yalnızca
  // "alındı" olarak işaretlenir.
  function applyOwned(info) {
    var owned = (info && info.allPurchasedProductIdentifiers) || [];
    var changed = false;
    if (owned.indexOf("remove_ads") !== -1 && !RT.save.noAds) { RT.save.noAds = true; changed = true; }
    if (owned.indexOf("starter_pack") !== -1 && !RT.save.starterBought) { RT.save.starterBought = true; changed = true; }
    if (changed) RT.persist();
    return changed;
  }

  RT.iap.init = function () {
    if (!Purchases) return;
    Purchases.configure({ apiKey: API_KEYS[platform] })
      .then(function () {
        var ids = Object.keys(RT.PRODUCTS).map(function (k) { return RT.PRODUCTS[k]; });
        return Purchases.getProducts({ productIdentifiers: ids, type: "NON_SUBSCRIPTION" });
      })
      .then(function (r) { (r.products || []).forEach(function (p) { products[p.identifier] = p; }); })
      .then(function () { return Purchases.getCustomerInfo(); })
      .then(function (r) { applyOwned(r.customerInfo); })
      .catch(function () {});
  };

  // Mağazanın verdiği yerel fiyat yazısı ("₺79,99", "$5.49"); yoksa null
  RT.iap.price = function (packId) {
    var p = products[RT.PRODUCTS[packId]];
    return p ? p.priceString : null;
  };

  // Satın al. onDone("ok" | "cancelled" | "error" | "unavailable")
  // Ödül, mağaza ödemeyi onayladıktan SONRA verilir (grant).
  RT.iap.buy = function (packId, grant, onDone) {
    var p = products[RT.PRODUCTS[packId]];
    if (!p) { onDone("unavailable"); return; }
    if (busy) return;
    busy = true;
    Purchases.purchaseStoreProduct({ product: p })
      .then(function (r) {
        busy = false;
        grant();
        applyOwned(r.customerInfo);
        onDone("ok");
      })
      .catch(function (e) {
        busy = false;
        onDone(e && e.userCancelled ? "cancelled" : "error");
      });
  };

  // "Satın Alımları Geri Yükle" (Apple zorunlu tutuyor). onDone(bulunduMu, hataMı)
  RT.iap.restore = function (onDone) {
    if (!Purchases) { onDone(false, true); return; }
    Purchases.restorePurchases()
      .then(function (r) {
        var info = r.customerInfo, owned = (info && info.allPurchasedProductIdentifiers) || [];
        applyOwned(info);
        onDone(owned.some(function (id) { return ONE_TIME[id]; }), false);
      })
      .catch(function () { onDone(false, true); });
  };
})();
