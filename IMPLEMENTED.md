# 1000 Kalem V1.0 — Başlangıç denetimi

## UI / ürün
- Aydınlık premium tema, kitaplık ve tamamlanan kitap arşivi.
- Kitap kartlarında konu, tür, yazar sayısı, ilerleme ve kullanıcının katılım durumu.
- Katkı öncesi son cümle; cümle alanı hemen altında.
- Taslak kaydı, karakter sayacı, önizleme ve son onay.
- Katkı sonrası tam kitap okuma.
- Katkılarım, cümle paylaşımı, kitap paylaşımı.
- Kitap tamamlama bildirimi (demo yerel kaydı; üretim SQL bildirimi).
- İçerik bildirme akışı.
- PWA manifest, ikon, service worker.

## Teknik / güvenlik
- Demo kullanıcı kimliği nickname'den ayrı ve kalıcı UUID.
- Üretim şemasında Supabase Auth profili ve case-insensitive nickname unique index.
- Kitap başına tek katkı için iki unique constraint.
- Transaction + `SELECT ... FOR UPDATE` ile kitap bazında sıralı gönderim.
- Eski son cümle ID'sine göre stale submission koruması.
- RLS ile katkı öncesi son cümle, katkı sonrası tam kitap erişimi.
- Doğrudan client DML kapalı; RPC üzerinden gönderim/rapor/kitap yönetimi.
- Server-side metin kontrolleri ve rate limit tabloları.
- Admin-only kitap oluşturma, kitap durum yönetimi ve moderasyon.
- Kitap tamamlandığında katkıcılara veritabanı bildirimi.

## Çalıştırılmamış / canlıya geçiş için gerekenler
- Supabase SQL şeması bir Supabase projesinde henüz çalıştırılmadı.
- HTML arayüzü örnek Supabase istemcisine henüz bağlanmadı.
- Gerçek e-posta OTP oturumu, CAPTCHA/Turnstile, edge/IP rate limiting, yedekleme, loglama, KVKK ve telif belgeleri canlıya çıkmadan tamamlanmalı.


## V1.0 kararları
- Cümle sınırı 200 karakter.
- İlk cümleyi yönetici belirler ve kitap oluşturulurken girilmesi zorunludur.
- Devam eden kitapta katkı öncesi yalnızca son cümle; katkı sonrası tam metin görünür.
- Tamamlanan kitaplar herkese açık arşivdir.
- Görünen kullanıcı kimliği takma addır; üretim hesabı doğrulanmış Auth UUID ile tanımlanır.
- Bildirim, istatistik, arşiv ve paylaşım ilk yayın kapsamındadır.

Detaylar: `PRODUCT_REQUIREMENTS.md`; iş listesi: `DEVELOPMENT_BACKLOG.md`.
