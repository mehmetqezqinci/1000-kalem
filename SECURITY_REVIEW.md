# 1000 Kalem — İlk Güvenlik ve Mimari Denetimi

## Kontrol edilen mevcut parçalar

- `index.html`: tarayıcıda çalışan yerel demo; kalıcı gerçek hesap veya çok kullanıcılı veri kaynağı değildir.
- `supabase/schema.sql`: Auth profili, kitap/cümle/katkı tabloları, RLS ve RPC taslağı.
- `supabase/client.example.js`: Supabase JS v2 örnek istemcisi; henüz ana arayüze bağlanmamıştır.

## Düzeltilen nokta

RLS cümle politikası, anonim ziyaretçi için `has_contributed()` ve `latest_published_sentence_number()` yardımcı fonksiyonlarını çağırıyor. Bu iki fonksiyonun yalnızca `authenticated` rolüne açık olması, anonim ziyaretçinin devam eden kitabın son cümlesini okuyamamasına yol açabilirdi. Fonksiyonlar sınırlı veri döndüren `SECURITY DEFINER` yardımcıları olarak `anon` ve `authenticated` rollerine açıkça verildi. Gerçek Supabase projesinde anonim erişim testi zorunludur.

Yönetici kitap oluşturma RPC'sine ilk cümle için 200 karakter, tek satır, URL, e-posta ve telefon biçimi kontrolleri eklendi. İlk cümle zorunlu ve sistem imzası `1000 Kalem` olarak ekleniyor.

## Yayın öncesi çözülmesi gerekenler

1. SQL şeması gerçek Supabase staging projesinde çalıştırılmadı; PostgreSQL sözdizimi ve trigger davranışı canlı ortamda doğrulanmalı.
2. RLS anon/member/admin senaryolarında otomatik test edilmeli; özellikle devam eden kitapta geçmiş cümlelerin API'den sızmadığı kanıtlanmalı.
3. Moderasyonda gizlenen/reddedilen cümleler slot sayımında kalıyor. Kitap sonunda 1000 numaralı konumun görünmesi için silinen içerik yerine güvenli bir kaldırılma yer tutucusu tasarımı tamamlanmalı.
4. E-posta OTP akışı ve takma adın benzersizlik kontrolü gerçek arayüzde uygulanmalı.
5. CAPTCHA/Turnstile, IP/edge rate limit, güvenlik logları, izleme, yedekleme ve geri yükleme provası yapılmalı.
6. Yönetici paneli henüz mevcut arayüzde yok; ayrı admin ekranı ve sunucu tarafı yetki kontrolleri geliştirilmeli.
7. Bildirim tablosu ve kitap tamamlanma bildirimi taslakta var; okundu işaretleme, tercih yönetimi, yeni kitap duyuruları ve e-posta gönderim hattı tamamlanmalı.
8. KVKK, kullanım koşulları, telif/katkı lisansı ve çerez metinleri uzman incelemesinden geçmeli.

## Test sınırı

Statik kontroller kaynak dosyalarının belirli gereksinim izlerini doğrular; veritabanı, tarayıcılar arası gerçek kullanıcı davranışı, eşzamanlılık veya canlı güvenliği kanıtlamaz. Bu nedenle statik kontrol başarısı, yayına hazır olunduğu anlamına gelmez.
