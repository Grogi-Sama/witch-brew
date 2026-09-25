# Cadı Kazanı: proje planı (taslak)

Yanglegeyang tarzı üçlü eşleştirme oyunu. Kardeş proje "Triple Match – Blue Ocean"
(`C:\Projects\ReefTrio`, github.com/Grogi-Sama/blue-ocean) ile aynı türde, ama ondan
**bağımsız** bir proje. Blue Ocean'a dokunulmaz.

## Kesinleşenler
- **Tema:** Cadı mutfağı / iksir malzemeleri. 7 yuvalı sepet yerine **7 yuvalı kazan**.
- **Temel oyun mantığı:** Blue Ocean ile aynı. Aynı 3 taşı kazana at, eşleşenler yok olur; kazan dolarsa kaybedilir.
- **Fark:** Oyuncu **Oyna'ya her bastığında reklam izleyecek** (seviye başı tam ekran reklam).

## Tartışılacak kararlar
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
