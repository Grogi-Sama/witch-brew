// Reklam katmanı. Mağaza uygulamasında (Capacitor) gerçek AdMob reklamı gösterir;
// web sürümünde (GitHub Pages) native=false olur ve ui.js sahte reklam ekranını kullanır.
//
// ÖNEMLİ: USE_TEST_ADS true iken Google'ın herkese açık TEST reklam kodları
// kullanılır (para kazandırmaz, hesabı riske atmaz). AdMob hesabı açılıp gerçek
// reklam birimleri oluşturulunca aşağıdaki PROD kodlarını doldur ve false yap.
// Uygulama kimlikleri (…~…) ayrıca AndroidManifest.xml ve iOS Info.plist'te yazılı.
(function () {
  var USE_TEST_ADS = true;
  var IDS = {
    test: {
      android: { interstitial: "ca-app-pub-3940256099942544/1033173712", rewarded: "ca-app-pub-3940256099942544/5224354917" },
      ios:     { interstitial: "ca-app-pub-3940256099942544/4411468910", rewarded: "ca-app-pub-3940256099942544/1712485313" }
    },
    prod: {
      android: { interstitial: "", rewarded: "" },
      ios:     { interstitial: "", rewarded: "" }
    }
  };

  var Cap = window.Capacitor;
  var native = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  var AdMob = native ? Cap.registerPlugin("AdMob") : null;
  var platform = native ? Cap.getPlatform() : "web";
  var unit = native ? IDS[USE_TEST_ADS ? "test" : "prod"][platform] : null;

  var ready = false;                         // initialize + izin akışı bitti mi
  var loaded = { interstitial: false, rewarded: false };
  var privacyRequired = false;               // AB kullanıcısı: ayarlarda "Gizlilik Tercihleri" gösterilmeli

  RT.ads = { native: !!AdMob };

  // Bir reklam gösterimi süresince olay dinler; off() hepsini birden kaldırır
  // (tetiklenmeyen dinleyiciler de silinir, yoksa her reklamda birikirler).
  function listen(map) {
    var handles = [], off = false;
    Object.keys(map).forEach(function (event) {
      AdMob.addListener(event, function (data) { if (!off) map[event](data); })
        .then(function (h) { if (off) h.remove(); else handles.push(h); });
    });
    return function () { off = true; handles.forEach(function (h) { h.remove(); }); handles = []; };
  }

  function preload(kind) {
    if (!ready || loaded[kind]) return;
    var p = kind === "interstitial"
      ? AdMob.prepareInterstitial({ adId: unit.interstitial })
      : AdMob.prepareRewardVideoAd({ adId: unit.rewarded });
    p.then(function () { loaded[kind] = true; })
     .catch(function () { setTimeout(function () { preload(kind); }, 30000); }); // ağ yoksa 30 sn sonra tekrar dene
  }

  // Açılışta: AdMob'u başlat → AB/İngiltere için izin formu (UMP) → iOS'ta
  // izlenme izni (ATT) → reklamları önceden yükle.
  RT.ads.init = function () {
    if (!AdMob) return;
    AdMob.initialize({})
      .then(function () { return AdMob.requestConsentInfo(); })
      .then(function (info) {
        privacyRequired = info && info.privacyOptionsRequirementStatus === "REQUIRED";
        if (info && !info.canRequestAds && info.isConsentFormAvailable) return AdMob.showConsentForm();
      })
      .then(function () {
        if (platform !== "ios") return;
        return AdMob.trackingAuthorizationStatus().then(function (s) {
          if (s.status === "notDetermined") return AdMob.requestTrackingAuthorization();
        });
      })
      .catch(function () {})
      .then(function () { ready = true; preload("interstitial"); preload("rewarded"); });
  };

  // Tam ekran (geçişli) reklam. Reklam hazır değilse oyuncuyu bekletmeden devam eder.
  // done(shown): reklam kapanınca (ya da gösterilemezse) çağrılır.
  RT.ads.interstitial = function (done) {
    if (!ready || !loaded.interstitial) { done(false); preload("interstitial"); return; }
    loaded.interstitial = false;
    var finished = false, off;
    function finish(shown) { if (finished) return; finished = true; off(); done(shown); preload("interstitial"); }
    off = listen({
      interstitialAdDismissed: function () { finish(true); },
      interstitialAdFailedToShow: function () { finish(false); }
    });
    AdMob.showInterstitial().catch(function () { finish(false); });
  };

  // Ödüllü reklam. Ödül yalnızca reklam izlenip kapatılınca verilir.
  // onReward(): ödül ver · onFail(): reklam yok/yarıda kaldı
  RT.ads.rewarded = function (onReward, onFail) {
    if (!ready || !loaded.rewarded) { preload("rewarded"); onFail && onFail(); return; }
    loaded.rewarded = false;
    var earned = false, finished = false, off;
    function finish() {
      if (finished) return; finished = true; off();
      if (earned) onReward(); else if (onFail) onFail();
      preload("rewarded");
    }
    off = listen({
      onRewardedVideoAdReward: function () { earned = true; },
      onRewardedVideoAdDismissed: finish,
      onRewardedVideoAdFailedToShow: finish
    });
    AdMob.showRewardVideoAd().catch(finish);
  };

  // AB kullanıcıları izin tercihlerini her zaman değiştirebilmeli (Google şartı)
  RT.ads.privacyOptionsRequired = function () { return privacyRequired; };
  RT.ads.showPrivacyOptions = function () { if (AdMob) AdMob.showPrivacyOptionsForm().catch(function () {}); };
})();
