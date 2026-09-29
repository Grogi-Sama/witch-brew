# Mağaza yayını: yapılacaklar

Yayıncı: **Omnipop Games** (OMNİ MDC TEKNOLOJİ SANAYİ VE TİCARET A.Ş.)
Uygulama kimliği: `com.omnipopgames.witchbrew` (ilk yüklemeden sonra değiştirilemez)
Sıra: önce Android, sonra iOS.

## Senin yapacakların
- [~] **D-U-N-S numarası**: Apple kaydı üzerinden 29.09.2026'da başvuruldu, D&B'den dönüş bekleniyor (5-30 gün). Yazım: `OMNI MDC TEKNOLOJI SANAYI VE TICARET ANONIM SIRKETI`
- [x] **omnipopgames.com** ve **.com.tr** alan adları (hosting.com.tr), DNS Cloudflare'de
- [x] Şirket e-postası **info@omnipopgames.com** (Zoho, SPF/DKIM/DMARC)
- [ ] **Google Play Console** kurum hesabı (25 $, bir kez)
- [~] **Apple Developer Program** kurum hesabı (99 $/yıl): kişisel bilgiler ve D-U-N-S talebi girildi; numara gelince kayda devam
- [ ] **AdMob** hesabı (şirket adına, ödeme/vergi bilgileri)
- [ ] **RevenueCat** hesabı (ücretsiz) → proje "Witch's Brew" → Google Play ve App Store uygulamalarını bağla
- [ ] **Android Studio** kurulumu (Windows) — emülatör ve derleme için
- [ ] AdMob'da uygulamayı "henüz mağazada değil" olarak ekle → Android ve iOS için
      birer **Geçiş (Interstitial)** ve **Ödüllü (Rewarded)** reklam birimi oluştur → kodları Claude'a ver
- [ ] AdMob → Gizlilik ve mesajlaşma: **GDPR (AB/İngiltere) mesajı** ve iOS için **IDFA açıklama mesajı** oluştur

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

## Claude'un yaptıkları / yapacakları
- [x] Capacitor kurulumu, Android projesi, ikonlar ve açılış ekranı
- [x] AdMob entegrasyonu (şu an Google TEST reklamları), izin formu (UMP), iOS izlenme izni (ATT)
- [x] Kayıtların cihazın kalıcı depolamasına yazılması
- [x] Mağaza paketinde JS küçültme/karıştırma (`npm run build`)
- [x] Satın alma altyapısı: RevenueCat (coin paketleri, başlangıç paketi, Reklamları Kaldır, Satın Alımları Geri Yükle)
- [ ] RevenueCat API anahtarlarını `js/iap.js` içine yazmak (hesap açılınca)
- [x] Şirket sitesi + TR/EN gizlilik politikası: https://omnipopgames.com/privacy (kaynak: C:\Projects\omnipopgames.com, Cloudflare Workers statik)
- [ ] `app-ads.txt` (AdMob yayıncı kimliği gelince) + canonical etiketi için siteyi yeniden yükle
- [ ] Gerçek AdMob kodlarına geçiş (`js/ads.js` USE_TEST_ADS=false, AndroidManifest / Info.plist uygulama kimlikleri)
- [ ] İmzalı sürüm paketi (AAB) ve Play Console'a yükleme adımları
- [x] Mağaza görselleri (Google Play): `store/play/{tr,en}/01-06.png` (1080×1920) ve `feature.png` (1024×500)
      Yeniden üretmek için: yerel sunucu açıkken `node tools/store-shots.mjs && node tools/store-frames.mjs`
- [ ] Mağaza sayfası metinleri: TR/EN kısa ve uzun açıklama, anahtar kelimeler
- [ ] App Store görselleri (iPhone 6.9": 1320×2868) — iOS aşamasında
- [ ] iOS projesi (Mac'te), App Store Connect, inceleme notu (Blue Ocean'dan farklar)
- [ ] "Test modu" yazılarının kaldırılması

## Komutlar
```
npm run build      # www/ klasörünü hazırlar (küçültülmüş)
npm run sync       # build + native projelere kopyala
npm run android    # build + Android Studio'da aç
```
