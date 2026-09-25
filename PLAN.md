# Cadı Kazanı: proje planı (taslak)

Yanglegeyang tarzı üçlü eşleştirme oyunu. Kardeş proje "Triple Match – Blue Ocean"
(`C:\Projects\ReefTrio`, github.com/Grogi-Sama/blue-ocean) ile aynı türde, ama ondan
**bağımsız** bir proje. Blue Ocean'a dokunulmaz.

## Kesinleşenler
- **Tema:** Cadı mutfağı / iksir malzemeleri. 7 yuvalı sepet yerine **7 yuvalı kazan**.
- **Temel oyun mantığı:** Blue Ocean ile aynı. Aynı 3 taşı kazana at, eşleşenler yok olur; kazan dolarsa kaybedilir.
- **Fark:** Oyuncu **Oyna'ya her bastığında reklam izleyecek** (seviye başı tam ekran reklam).

## Verilen kararlar (2026-09-25)
- **Reklam:** Her Oyna'da tam ekran reklam; ilk 3 seviye hariç, iki reklam arası en az 60 sn. "Tekrar Dene"de ayrıca reklam yok (60 sn kuralı kapsar). Web sürümünde sahte reklam ekranı; gerçek AdMob sadece Capacitor sürümünde.
- **Reklamları Kaldır:** Var, tek seferlik satın alım. Zorunlu reklamları kaldırır; ödüllü reklamlar kalır.
- **Ekonomi:** Jokerler coinle veya ödüllü reklamla alınır (ödüllü reklam, kullanıcının onayladığı ücretsiz kaynak). Coin başka ücretsiz yoldan verilmez.
- **Can (sonradan eklendi, 2026-09-25):** Yumuşak can sistemi: en fazla 5 can, 20 dakikada 1 can dolar, yalnızca kaybedince 1 can gider (seviyeden çıkmak can götürmez). Can: reklamla +1 (sınırsız) veya coinle (eksik can başına 20, tamamı en fazla 50). Cansız oyuncuya Oyna reklamı gösterilmez, can penceresi açılır.
- **Reklamları Kaldır:** Kalıcı, tek seferlik, $5,49 / ₺79,99 (kullanıcı onayladı). Oyna reklamları kalkar; can/joker için ödüllü reklam isteğe bağlı kalır. (1 aylık seçenek konuşuldu; abonelik altyapısı gerektirdiği ve oyuncuyu kızdıracağı için kalıcıda karar kılındı.)
- **İksir tarifi:** Her seviyede sıralı bir tarif (2-3 malzeme, her biri 1 üçleme). Sırası gelen malzeme eşleşince tarif ilerler; tamamlanınca bu seviye için kazana +1 yuva. Ekonomiye (coin/joker) dokunmaz.
- **Joker adı:** "Taşı Kaldır" → "Kepçeyle Al" (EN "Scoop Out"); ilk 3 malzemeyi kazandan yukarı alır.
- **İmza mekanik:** İksir tarifi, bonus hedef (zorunlu değil). Zorunlu tarif seviyeleri ileride eklenebilir.
- **Başlangıç:** Blue Ocean kodunun kopyası (git geçmişi olmadan). Can ve takvim sökülür; kazan teması ve tarif eklenir. Blue Ocean'a dokunulmaz.
- **İsim:** EN "Triple Match – Witch's Brew" / TR "Üçlü Eşleştirme – Cadı Kazanı". Tekrarlayan içerik riskine karşı görsel dil ve tarif mekaniği belirgin farklı olmalı.
- **GitHub:** Ayrı repo `witch-brew`. Push, kullanıcı onay verince yapılır.

## Tartışılacak kararlar (ilk taslak)
Her maddedeki ⭐, Claude'un önerisi.

1. **Reklam sıklığı**
   - Her Oyna'da, istisnasız.
   - ⭐ Her Oyna'da, ama ilk 3 seviye hariç ve iki reklam arasında en az 60 saniye.
   - "Tekrar Dene"de de reklam çıksın mı?
   - ⭐ Tek seferlik **"Reklamları Kaldır"** satın alımı olsun mu?
2. **Can / coin sistemi**
   - ⭐ A) Can sistemi yok, sınırsız oyna. Gelir reklamdan ve "Reklamları Kaldır"dan gelir; jokerler coinle veya reklamla alınır.
   - B) Blue Ocean'daki gibi can + coin + takvim, üstüne seviye reklamı.
3. **İsim**
   - ⭐ EN: "Triple Match – Witch's Brew" / TR: "Üçlü Eşleştirme – Cadı Kazanı" (seri gibi).
   - Not: Aynı geliştiriciden çok benzer iki oyun, Google'ın "tekrarlayan içerik" kuralına takılabilir. Görsel dil ve en az bir mekanik belirgin şekilde farklı olmalı.
4. **İmza mekanik**
   - ⭐ İksir tarifi: Her seviyede üstte bir tarif var (ör. 2× mantar, 1× yarasa kanadı üçlemesi yap). Tamamlanınca bonus.
   - Büyülü taş: Parlayan taş eşleşince yanındaki bir taşı açığa çıkarır.
   - Mekanik farkı yok, sadece tema değişir. En hızlısı, ama tekrarlayan içerik riski artar.
5. **Başlangıç noktası**
   - ⭐ Blue Ocean kodunun bir kopyasıyla başla. Can, coin, mağaza, eğitim, ses ve TR/EN hazır gelir. Ardından tema, görseller ve farklı mekanikler eklenir.
   - Sıfırdan başla.
6. **GitHub:** Ayrı repo (ör. `witch-brew`). Push, kullanıcı onay verince yapılır.

## Blue Ocean'dan taşınabilecek bilgiler
- Teknoloji: düz HTML/CSS/JS, mağaza için daha sonra Capacitor.
- Görseller Gemini Nano Banana ile üretiliyor. Şeffaf WebP sprite sheet olarak geliyor ve `tools/slice_sheet.py` ile kesiliyor.
- Fiyatlar mağazada ülke ülke giriliyor: Türkiye için TL, diğer ülkeler için USD (Blue Ocean'da USD fiyatları standart basamağın ~%10 üstünde).
