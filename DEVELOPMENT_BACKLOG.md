# 1000 Kalem — V1.0 Geliştirme Panosu

## Aşama 0 — Ürün kararları (tamamlandı)
- [x] Cümle sınırı: 200 karakter.
- [x] İlk cümleyi yönetici belirler.
- [x] Devam eden kitapta tam metin yalnızca katkı veren kullanıcıya açık.
- [x] Görünen kimlik yalnızca takma ad.
- [x] Kitap başına tek katkı, kitap başına 1000 cümle.
- [x] Bildirim, istatistik, arşiv ve paylaşım ilk sürüm kapsamına alındı.

## Aşama 1 — Mevcut prototip ve mimari denetimi
- [x] MVP 2.0 kaynak paketi alındı ve dosyaları incelendi.
- [x] Önceki prototipin yerel demo olduğu ve canlı backend'e bağlı olmadığı doğrulandı.
- [x] Ürün gereksinimleri ve yayın kabul kriterleri yazıldı.
- [ ] Frontend bileşenlerini modüllere ayırma kararı ve refactor planı.
- [ ] Supabase SQL'i gerçek projede çalıştırma ve PostgreSQL testleri.
- [ ] RLS politikalarını anon/member/admin rollerinde otomatik test etme.
- [ ] Gerçek Auth akışını uçtan uca test etme.

## Aşama 2 — Üretim frontend'i
- [ ] Build sistemi ve ortam değişkenleri.
- [ ] Supabase Auth OTP/Magic Link ekranı.
- [ ] Takma ad uygunluk kontrolü ve profil yönetimi.
- [ ] Kitaplık, arama, filtre ve kitap detay sayfaları.
- [ ] Katkı akışı: son cümle, taslak, 200 karakter, önizleme, RPC gönderimi.
- [ ] Katkı sonrası tam metin ve sayfalama/okuma deneyimi.
- [ ] Katkılarım ve kullanıcı istatistikleri.
- [ ] Bildirim merkezi ve tercihleri.
- [ ] Tamamlanan kitap arşivi.
- [ ] Paylaşım URL'leri ve sosyal meta etiketleri.
- [ ] Hata, yükleniyor, boş ve çevrimdışı durumları.

## Aşama 3 — Yönetici paneli ve moderasyon
- [ ] Admin role/route guard.
- [ ] Kitap oluşturma formu; ilk cümle zorunlu.
- [ ] Kapak görseli Storage yüklemesi.
- [ ] Kitap durum yönetimi.
- [ ] Şikâyet kuyruğu ve moderasyon geçmişi.
- [ ] Kullanıcı kısıtlama/engelleme.
- [ ] Yönetici istatistikleri.

## Aşama 4 — Backend ve bildirimlerin tamamlanması
- [ ] SQL şemasını güncel gereksinimlere göre revize etme.
- [ ] Nickname benzersizliği için güvenli kullanılabilirlik kontrolü.
- [ ] Kitap slug ve paylaşım meta verisi.
- [ ] Tamamlanma bildirimi ve e-posta tercihi.
- [ ] Yeni kitap duyurusu tercihi.
- [ ] Rate limit ve CAPTCHA/Turnstile.
- [ ] Yedekleme, izleme ve hata alarmı.

## Aşama 5 — Kalite, güvenlik ve erişilebilirlik
- [ ] 999/1000/1001 sınır testleri.
- [ ] Aynı anda çoklu katkı testi.
- [ ] RLS veri sızıntısı testleri.
- [ ] Admin/member yetki testleri.
- [ ] XSS, injection, spam ve kişisel veri kontrolleri.
- [ ] Mobil ve masaüstü tarayıcı testleri.
- [ ] Klavye erişimi, ekran okuyucu ve kontrast testleri.
- [ ] Yedekten geri yükleme provası.

## Aşama 6 — Yayına hazırlık
- [ ] Domain, DNS, HTTPS ve hosting.
- [ ] Üretim Supabase projesi ve Auth redirect ayarları.
- [ ] KVKK, gizlilik, kullanım koşulları ve telif metinleri.
- [ ] SEO, sitemap, robots ve Open Graph görselleri.
- [ ] İzleme, hata raporlama ve iletişim kanalı.
- [ ] Son kabul testleri ve kontrollü yayın.

## Dış bağımlılıklar

Üretim entegrasyonuna geçmek için proje sahibinden Supabase proje URL'si ve anon/publishable key gerekir. `service_role` anahtarı istenmez ve tarayıcıya konulmaz. Domain/hosting ve hukuki metin incelemesi ayrıca sağlanmalıdır.
