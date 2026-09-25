// Türkçe / İngilizce metinler. HTML'de data-i18n="anahtar" olan her eleman
// dil değişince otomatik güncellenir; JS tarafında RT.t("anahtar") kullanılır.
window.RT = window.RT || {};

RT.STRINGS = {
  tr: {
    // Oyunun adı dile göre değişir (mağaza adlarıyla aynı)
    gameTitle: "Üçlü Eşleştirme – Cadı Kazanı",
    titleTop: "Üçlü Eşleştirme", titleMain: "Cadı Kazanı",
    gameSubtitle: "Üçünü bul, iksirini kaynat!",
    level: "Seviye",
    play: "Oyna",
    tutorial: "Eğitim",
    settings: "Ayarlar",
    shop: "Mağaza",
    jUndo: "Geri Al", jRemove: "Kepçeyle Al", jShuffle: "Karıştır", jExpand: "Genişlet",
    music: "Müzik", sound: "Ses Efektleri", language: "Dil",
    on: "Açık", off: "Kapalı", close: "Kapat",
    winTitle: "Harika!", winText: "İksir fokur fokur kaynıyor!",
    nextLevel: "Sonraki Seviye", mainMenu: "Ana Menü",
    loseTitle: "Kazan Taştı!", loseText: "İksir patladı, 1 can kaybettin. Bir daha dene!",
    retry: "Tekrar Dene",
    discoverTitle: "Yeni Malzemeler!", discoverText: "Bu malzemeler artık kazanına girebilir.", discoverGo: "Harika, Oyna!",
    continueTitle: "Kazan Doldu!", continueText: "Reklam izle, son 3 malzeme tahtaya geri dönsün ve devam et.",
    continueAd: "İzle ve Devam Et", giveUp: "Vazgeç",
    pauseTitle: "Duraklatıldı", resume: "Devam Et",
    quitLevel: "Seviyeden Çık",
    noLivesTitle: "Canın Kalmadı", noLivesText: "Yeni can: {t}",
    watchAd: "Reklam İzle (+1 ❤️)",
    livesTitle: "Canlar", livesFull: "Canların dolu, iyi oyunlar!", refillCoins: "Canları Doldur ({c} 🪙)",
    oneLifeCoins: "+1 ❤️ ({c} 🪙)", adDone: "+1 can kazandın!",
    adPlaying: "Reklam oynatılıyor…",
    notEnoughCoins: "Yeterli altının yok!",
    shopTitle: "Cadı Altını", shopNote: "Test modu: gerçek ödeme yapılmaz.",
    buy: "Satın Al", bought: "+{n} 🪙 eklendi (test)",
    pack1: "Bir Tutam Altın", pack2: "Altın Kesesi", pack3: "Altın Küpü",
    pack4: "Dolu Kazan", pack5: "Cadı Sandığı", pack6: "Baş Cadının Hazinesi",
    badgePopular: "En Popüler", badgeBest: "En İyi Değer",
    starterTitle: "Başlangıç Paketi", starterJokers: "her jokerden {n}", starterOnce: "Yalnızca bir kez!",
    starterBought: "Başlangıç paketi eklendi (test)",
    continueCoins: "{c} 🪙 ile Devam Et",
    jokerEmptyTitle: "Joker Bitti", jokerEmptyText: "{name} jokerinden 1 adet al?",
    buyFor: "{c} 🪙 ile Al",
    watchAdJoker: "Reklam İzle (+1 joker)", jokerAdDone: "+1 joker kazandın!", yourCoins: "Bakiyen:",
    noAdsTitle: "Reklamları Kaldır", noAdsText: "Oyna'ya basınca çıkan reklamlar bir daha çıkmaz.",
    noAdsBought: "Reklamlar kaldırıldı (test)", noAdsOwned: "Reklamsız ✓",
    adFullTitle: "Tam ekran reklam", adFullNote: "Test: gerçek reklam mağaza sürümünde gösterilecek.",
    adTag: "REKLAM", adSkipIn: "Reklamı geç ({s})", adSkip: "Reklamı Geç",
    nothingToUndo: "Geri alınacak hamle yok",
    trayEmpty: "Kazan boş",
    alreadyExpanded: "Kazan bu seviyede zaten genişletildi",
    bankFull: "Bekleme alanı dolu",
    // Eğitim
    tNext: "İlerle", tStart: "Başla!", tSkip: "Geç",
    t1Title: "Hoş Geldin!", t1Text: "Aynı 3 malzemeyi bul ve kazana at. Üç tane biriktiğinde eriyip yok olurlar.",
    t2Title: "Kazana Dikkat", t2Text: "Kazanda 7 yer var. Eşleşme olmadan dolarsa kazan taşar ve kaybedersin!",
    t3Title: "Katmanlar", t3Text: "Soluk malzemelerin üstünde başka malzeme var. Önce üsttekileri topla.",
    t4Title: "Jokerler", t4Text: "Zorlandığında jokerler yardımına koşar:",
    t4Undo: "Son hamleni geri alır.",
    t4Remove: "Kazandaki ilk 3 malzemeyi kepçeyle yukarı alır; eşleri gelene kadar orada kilitli bekler.",
    t4Shuffle: "Tahtadaki taşları karıştırır.",
    t4Expand: "Bu seviye için kazana 1 yer ekler.",
    t5Title: "Hazırsın!", t5Text: "Her seviye biraz daha zorlaşır. Sonu yok — bakalım ne kadar ilerleyeceksin?"
  },
  en: {
    gameTitle: "Triple Match – Witch's Brew",
    titleTop: "Triple Match", titleMain: "Witch's Brew",
    gameSubtitle: "Find three, brew your potion!",
    level: "Level",
    play: "Play",
    tutorial: "Tutorial",
    settings: "Settings",
    shop: "Shop",
    jUndo: "Undo", jRemove: "Scoop Out", jShuffle: "Shuffle", jExpand: "Expand",
    music: "Music", sound: "Sound Effects", language: "Language",
    on: "On", off: "Off", close: "Close",
    winTitle: "Great!", winText: "Your potion is bubbling!",
    nextLevel: "Next Level", mainMenu: "Main Menu",
    loseTitle: "Cauldron Overflow!", loseText: "Your potion blew up and you lost a life. Try again!",
    retry: "Try Again",
    discoverTitle: "New Ingredients!", discoverText: "These ingredients can now go into your cauldron.", discoverGo: "Awesome, Play!",
    continueTitle: "Cauldron Full!", continueText: "Watch an ad to send your last 3 ingredients back to the board and keep going.",
    continueAd: "Watch & Continue", giveUp: "Give Up",
    pauseTitle: "Paused", resume: "Resume",
    quitLevel: "Quit Level",
    noLivesTitle: "Out of Lives", noLivesText: "Next life: {t}",
    watchAd: "Watch Ad (+1 ❤️)",
    livesTitle: "Lives", livesFull: "Your lives are full, have fun!", refillCoins: "Refill Lives ({c} 🪙)",
    oneLifeCoins: "+1 ❤️ ({c} 🪙)", adDone: "+1 life earned!",
    adPlaying: "Ad playing…",
    notEnoughCoins: "Not enough gold!",
    shopTitle: "Witch Gold", shopNote: "Test mode: no real payment.",
    buy: "Buy", bought: "+{n} 🪙 added (test)",
    pack1: "Pinch of Gold", pack2: "Gold Pouch", pack3: "Gold Pot",
    pack4: "Full Cauldron", pack5: "Witch's Chest", pack6: "Grand Witch's Hoard",
    badgePopular: "Most Popular", badgeBest: "Best Value",
    starterTitle: "Starter Pack", starterJokers: "{n} of each joker", starterOnce: "One time only!",
    starterBought: "Starter pack added (test)",
    continueCoins: "Continue for {c} 🪙",
    jokerEmptyTitle: "Out of Joker", jokerEmptyText: "Buy 1 {name} joker?",
    buyFor: "Buy for {c} 🪙",
    watchAdJoker: "Watch Ad (+1 joker)", jokerAdDone: "+1 joker earned!", yourCoins: "Balance:",
    noAdsTitle: "Remove Ads", noAdsText: "No more ads when you press Play.",
    noAdsBought: "Ads removed (test)", noAdsOwned: "Ad-free ✓",
    adFullTitle: "Full-screen ad", adFullNote: "Test: real ads appear in the store version.",
    adTag: "AD", adSkipIn: "Skip ad ({s})", adSkip: "Skip Ad",
    nothingToUndo: "Nothing to undo",
    trayEmpty: "Cauldron is empty",
    alreadyExpanded: "Cauldron already expanded this level",
    bankFull: "Holding area is full",
    tNext: "Next", tStart: "Start!", tSkip: "Skip",
    t1Title: "Welcome!", t1Text: "Find 3 matching ingredients and tap them into the cauldron. Three of a kind melt away.",
    t2Title: "Watch the Cauldron", t2Text: "The cauldron has 7 slots. If it fills up without a match, it overflows and you lose!",
    t3Title: "Layers", t3Text: "Faded ingredients are covered by others. Clear the top ones first.",
    t4Title: "Jokers", t4Text: "When you're stuck, jokers help out:",
    t4Undo: "Takes back your last move.",
    t4Remove: "Scoops the first 3 ingredients out of the cauldron; they wait locked above until their matches arrive.",
    t4Shuffle: "Shuffles the tiles on the board.",
    t4Expand: "Adds 1 cauldron slot for this level.",
    t5Title: "You're Ready!", t5Text: "Each level gets a bit harder. It never ends — how far can you go?"
  }
};

RT.lang = "tr";

RT.t = function (key, vars) {
  var s = (RT.STRINGS[RT.lang] && RT.STRINGS[RT.lang][key]) || RT.STRINGS.tr[key] || key;
  if (vars) for (var k in vars) s = s.replace("{" + k + "}", vars[k]);
  return s;
};

RT.applyI18n = function (root) {
  (root || document).querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = RT.t(el.getAttribute("data-i18n"));
  });
  document.documentElement.lang = RT.lang;
  document.title = RT.t("gameTitle");
};
