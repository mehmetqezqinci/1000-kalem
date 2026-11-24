# 1000 Kalem — Supabase canlı entegrasyon ilk aşama

Bu paket `index.html` içindeki yerel demo akışını `live-app.js` ile değiştirir. Supabase JS v2, tarayıcıda ESM üzerinden `esm.sh` ile yüklenir. Proje URL'si ve yalnızca public/publishable key istemci dosyasındadır. `service_role` veya secret key kesinlikle kullanılmaz.

## Bu aşamada çalışan şekilde hazırlanan akışlar

- Ziyaretçi oturum açmadan kitap listesini ve devam eden kitaplardaki son cümleyi görebilir.
- Katkı göndermek veya cümle bildirmek için e-posta Magic Link doğrulaması gerekir. Kullanıcı e-postasına gelen tek kullanımlık bağlantıya tıklayarak giriş yapar.
- Kayıt sırasında takma ad Auth metadata ile gönderilir; profil trigger'ı profili oluşturur.
- Oturum açınca profil, katkı geçmişi, kitap listesi ve bildirimler Supabase'den okunur.
- Açık kitapta katkı vermemiş kullanıcıya RLS'nin izin verdiği son cümle gösterilir.
- Katkı yapan kullanıcı veya tamamlanmış kitap için RLS'nin izin verdiği tam metin yüklenir.
- Cümle gönderimi `submit_sentence` RPC üzerinden yapılır; beklenen son cümle kimliği gönderilir.
- `admin` rolündeki kullanıcı için yönetici alanı görünür; kitap ve başlangıç cümlesi `admin_create_book` RPC ile oluşturulur.
- Cümle şikâyeti `report_sentence` RPC ile gönderilir.
- Katkılarım, bildirimler ve temel profil istatistikleri veritabanından yüklenir.

## Önemli: yayın öncesi yapılacaklar

1. Supabase Authentication > URL Configuration bölümünde Site URL olarak yayın adresi tanımlanmalı.
2. Redirect URLs listesine yerel test adresi `http://localhost:8000/` ve yayındaki gerçek alan adı eklenmeli. Geliştirme sırasında gerekiyorsa `http://localhost:8000/**` wildcard adresi kullanılabilir. Uygulama Magic Link isteğinde mevcut origin ve sayfaya geri dönüş adresi gönderir.
3. Authentication > Email Templates > Magic Link şablonunda `{{ .ConfirmationURL }}` kullanılmalı; `{{ .Token }}` ile OTP şablonuna çevrilmemeli.
4. Magic Link bağlantısı test sırasında aynı cihaz ve tarayıcıda açılmalı; Supabase Auth URL allowlist içinde dönüş adresi bulunmalı.
5. Proje e-posta gönderim kotası ve SMTP yapılandırması kontrol edilmeli.
6. `index.html` ve `live-app.js` HTTPS destekli statik hosting üzerinde sunulmalı. `file://` üzerinden test edilmemeli.
7. Gerçek iki hesapla kayıt, giriş, takma ad benzersizliği, katkı, ikinci katkının reddi, tam kitap okuma gizliliği ve eşzamanlı gönderim test edilmeli.
8. SQL policy/RPC güvenlik testleri ve admin yetki testi yapılmalı.
9. Bu ilk canlı bağlantı adımı, platformun bütünüyle production-ready olduğu anlamına gelmez. Yönetici moderasyon ekranı, kapsamlı istatistikler, paylaşım SEO/OG, e-posta bildirim tercihleri, CAPTCHA/edge rate limit, KVKK ve yedekleme/izleme çalışmaları sonraki aşamalardadır.

## Yerel sunum

Proje klasöründe terminal açıp `python -m http.server 8000` çalıştır; ardından `http://localhost:8000` adresini aç. ESM modülü için internet bağlantısı gerekir.
