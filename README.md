# 1000 Kalem — V1.0 geliştirme temeli

Bu paket, 1000 Kalem V1.0 için Supabase bağlantısının ilk uygulama aşamasını, kullanıcı arayüzünü, PWA kabuğunu ve Supabase/PostgreSQL şemasını içerir. Kesin ürün kararları `PRODUCT_REQUIREMENTS.md` dosyasındadır; görev panosu `DEVELOPMENT_BACKLOG.md` içindedir.

## Pakette neler var?

- `index.html` — yenilenmiş, mobil uyumlu kullanıcı arayüzü ve Supabase uygulama kabuğu.
- `manifest.webmanifest`, `sw.js`, `icon.svg` — HTTPS üzerinde kurulabilir PWA kabuğu ve statik dosya önbelleği.
- `supabase/schema.sql` — Auth profilleri, kitaplar, cümleler, katkılar, RLS, RPC, raporlar, yönetici işlemleri ve tamamlanma bildirimleri.
- `supabase/client.example.js` — Supabase JS v2 istemci örneği.
- `live-app.js` — Proje URL ve publishable key ile yapılandırılmış gerçek istemci akışı.
- `DEPLOY_LIVE.md` — Bu aşamanın kapsamı ve yayına hazırlık notları.

## Onaylanan V1.0 ürün kuralları

- Her kitap 1000 cümledir; başlangıç cümlesini yalnızca yönetici belirler.
- Her kullanıcı kitap başına bir kez katkı yapabilir.
- Katkı öncesi devam eden kitapta yalnızca son yayımlanmış cümle görünür; katkı sonrası tam metin açılır.
- Tamamlanan kitaplar herkese açık arşive taşınır.
- Cümle uzunluğu en fazla 200 karakterdir.
- Görünen kimlik takma addır; üretimde hesap güvenliği için e-posta Magic Link/Magic Link arka planda kullanılır ve e-posta yayımlanmaz.
- Bildirim, istatistik, arşiv ve paylaşım V1.0 kapsamındadır.

## Kullanıcı tarafında uygulananlar

1. Nickname değişse bile demo kullanıcı UUID'si sabit kalır; katkı geçmişi nickname'e değil profile ID'ye bağlanır.
2. Kitap kartlarında tür, açıklama, yazar sayısı, cümle sayısı, kalan katkı ve ilerleme görünür.
3. Katkı öncesi yalnızca son cümle gösterilir.
4. Cümle alanı doğrudan son cümlenin altında bulunur.
5. Taslak aynı cihazda kitap bazında otomatik kaydedilir.
6. Karakter sayacı, boş gönderim engeli ve önizleme/onay adımı vardır.
7. Katkıdan sonra kitabın tamamı açılır.
8. Katkılarım sayfası, cümle paylaşımı ve kitap bağlantısı paylaşımı eklendi.
9. Tamamlanan kitaplar için ayrı arşiv görünümü eklendi.
10. İçerik bildirme akışı ve yerel demo bildirimi eklendi.
11. Kitap tamamlandığında demo kullanıcısına yerel bildirim kaydı eklenir; SQL tarafında tüm katkıcılara bildirim üretilir.
12. Mobil düzen, klavye odak stilleri, aria etiketleri ve reduced-motion desteği iyileştirildi.

## Senior Developer açısından ele alınan 10 kritik konu

1. **Değişmeyen kullanıcı kimliği:** Demo sürümünde UUID; üretimde Supabase Auth user UUID.
2. **Nickname benzersizliği:** Veritabanında büyük/küçük harf duyarsız unique index.
3. **Kitap başına tek katkı:** `contributions(book_id,user_id)` unique kısıtı ve `sentences(book_id,author_id)` unique kısıtı.
4. **Eşzamanlı gönderim:** `submit_sentence()` kitap satırını `FOR UPDATE` ile kilitler ve sırayı sunucu tarafında belirler.
5. **Eski cümleye cevap verme koruması:** İstemcinin gönderdiği beklenen son cümle ID'si sunucudaki son ID ile karşılaştırılır.
6. **Geçmişin gizliliği:** RLS politikası katkı öncesi sadece son cümleyi, katkı sonrası tüm cümleleri gösterir. Tamamlanan kitaplar arşivde okunabilir.
7. **Doğrudan yazma kapalı:** İstemcilerin cümle/katkı/rapor/kitap tablolarına doğrudan DML yetkileri kaldırılır; yazma RPC üzerinden yapılır.
8. **Girdi doğrulama:** Uzunluk, boş metin, satır sonu, bağlantı ve tekrarlanan karakter kontrolleri sunucu fonksiyonunda uygulanır.
9. **Moderasyon ve kötüye kullanım:** Tekil kullanıcı/cümle bildirimi, saatlik 10 rapor sınırı, 10 dakikada 5 katkı sınırı, temel küfür/kişisel veri/bağlantı kontrolleri, yönetici rapor inceleme ve cümle gizleme fonksiyonları eklendi.
10. **Kitap yönetimi ve bildirim:** Kitap oluşturma ve moderasyon admin RPC'leriyle sınırlandırıldı; kitap tamamlandığında katkıcılara bildirim oluşturulur.

## Uygulamayı yerel ortamda nasıl açılır?

Bu sürümde `index.html`, `live-app.js` modülünü yükler ve Supabase JS v2 üzerinden gerçek projeye bağlanır. Ziyaretçi kitaplığı ve son cümleleri oturum açmadan görüntüleyebilir; katkı ve bildirim için e-posta Magic Link girişi gerekir. Kitap oluşturma RPC'si yalnızca `admin` rolüyle kullanılabilir.

Yerel test için proje klasöründe `python -m http.server 8000` çalıştırıp `http://localhost:8000` adresini aç. `file://` üzerinden açma; ESM modülü ve Supabase bağlantısı için HTTP/HTTPS gerekir.

Supabase projesinde SQL şeması uygulanmış ve ilk yönetici rolü verilmiş durumda. Bununla birlikte OTP e-posta şablonu, redirect URL, SMTP ve gerçek tarayıcıda iki kullanıcı uçtan uca testleri ayrıca tamamlanmalıdır. Ayrıntılar `DEPLOY_LIVE.md` içindedir.

**Güvenlik:** İstemcide yalnızca publishable/anon anahtar bulunur. `service_role` veya secret key hiçbir zaman tarayıcıya konulmaz.
## Kimlik konusunda ürün kararı

Nickname, kitapta görünen yazar adıdır; güvenli hesap kimliği değildir. Kullanıcının farklı cihazlarda aynı katkı hakkını korumak için e-posta Magic Link/Magic Link gibi doğrulanmış oturum gerekir. Kullanıcı ilk ekranda takma adını seçebilir; doğrulama arka planda e-posta ile yapılır. Sadece nickname ile üretim kimliği sağlanamaz.

## Bilinen sınırlar / yayından önce kalan işler

- İlk Supabase entegrasyon akışı eklendi; gerçek SMTP/OTP ve çok kullanıcılı uçtan uca testler henüz tamamlanmadı.
- SQL tarafında temel rapor rate limit'i vardır; CAPTCHA, IP/edge rate limit ve abuse monitoring ayrıca kurulmalıdır.
- Otomatik kelime filtresi temel bir denylist'tir ve tüm hakaretleri/bağlamı yakalayamaz; rapor ve insan moderasyonu gerekir.
- Otomatik yedekleme ve hata izleme Supabase proje ayarlarından etkinleştirilmelidir.
- PWA kabuğu var; push bildirimleri ve çevrimdışı katkı gönderimi yoktur.
- Kullanım koşulları, telif/lisans ve KVKK metinleri hukuki incelemeden geçmelidir.


## Geliştirme durumu

Bu sürüm, Supabase'e bağlanan ilk uygulama entegrasyonudur; henüz tüm platform özellikleri tamamlanmış veya production-ready olarak kabul edilmemektedir.
