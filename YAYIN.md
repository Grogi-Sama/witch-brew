# Mağaza yayını: yapılacaklar

Yayıncı: **Omnipop Games** (OMNİ MDC TEKNOLOJİ SANAYİ VE TİCARET A.Ş.)
Uygulama kimliği: `com.omnipopgames.witchbrew` (ilk yüklemeden sonra değiştirilemez)
Sıra: önce Android, sonra iOS.

## Senin yapacakların
- [ ] **D-U-N-S numarası** (şirket için; ücretsiz, 1-2 hafta sürebilir) — iki mağaza da istiyor
- [ ] **omnipopgames.com** alan adı (otomatik yenileme açık)
- [ ] **Google Play Console** kurum hesabı (25 $, bir kez)
- [ ] **Apple Developer Program** kurum hesabı (99 $/yıl)
- [ ] **AdMob** hesabı (şirket adına, ödeme/vergi bilgileri)
- [ ] **RevenueCat** hesabı (ücretsiz) → proje "Witch's Brew" → Google Play ve App Store uygulamalarını bağla

## Mağaza ürün kimlikleri (iki mağazada da BİREBİR bu adlarla, değiştirilemez)
| Kimlik | Tür | Oyunda | Fiyat (USD / TL) |
|---|---|---|---|
| `coins_100` | Tüketilebilir | 100 altın | 1,09 / 19,99 |
| `coins_330` | Tüketilebilir | 330 altın | 3,29 / 49,99 |
| `coins_600` | Tüketilebilir | 600 altın | 5,49 / 79,99 |
| `coins_1300` | Tüketilebilir | 1.300 altın | 10,99 / 149,99 |
| `coins_2800` | Tüketilebilir | 2.800 altın | 21,99 / 279,99 |
| `coins_7500` | Tüketilebilir | 7.500 altın | 54,99 / 649,99 |
| `starter_pack` | Tüketilmeyen (tek sefer) | 250 altın + her jokerden 3 | 2,19 / 34,99 |
| `remove_ads` | Tüketilmeyen (kalıcı) | Oyna reklamlarını kaldırır | 5,49 / 79,99 |
- [ ] **Android Studio** kurulumu (Windows) — emülatör ve derleme için
- [ ] AdMob'da uygulamayı "henüz mağazada değil" olarak ekle → Android ve iOS için
      birer **Geçiş (Interstitial)** ve **Ödüllü (Rewarded)** reklam birimi oluştur → kodları Claude'a ver
- [ ] AdMob → Gizlilik ve mesajlaşma: **GDPR (AB/İngiltere) mesajı** ve iOS için **IDFA açıklama mesajı** oluştur

## Claude'un yaptıkları / yapacakları
- [x] Capacitor kurulumu, Android projesi, ikonlar ve açılış ekranı
- [x] AdMob entegrasyonu (şu an Google TEST reklamları), izin formu (UMP), iOS izlenme izni (ATT)
- [x] Kayıtların cihazın kalıcı depolamasına yazılması
- [x] Mağaza paketinde JS küçültme/karıştırma (`npm run build`)
- [x] Satın alma altyapısı: RevenueCat (coin paketleri, başlangıç paketi, Reklamları Kaldır, Satın Alımları Geri Yükle)
- [ ] RevenueCat API anahtarlarını `js/iap.js` içine yazmak (hesap açılınca)
- [ ] Gizlilik politikası (TR/EN) + `app-ads.txt` → omnipopgames.com
- [ ] Gerçek AdMob kodlarına geçiş (`js/ads.js` USE_TEST_ADS=false, AndroidManifest / Info.plist uygulama kimlikleri)
- [ ] İmzalı sürüm paketi (AAB) ve Play Console'a yükleme adımları
- [ ] Mağaza sayfası: TR/EN açıklamalar, ekran görüntüleri, 1024×500 tanıtım görseli
- [ ] iOS projesi (Mac'te), App Store Connect, inceleme notu (Blue Ocean'dan farklar)
- [ ] "Test modu" yazılarının kaldırılması

## Komutlar
```
npm run build      # www/ klasörünü hazırlar (küçültülmüş)
npm run sync       # build + native projelere kopyala
npm run android    # build + Android Studio'da aç
```
