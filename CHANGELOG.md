# Changelog

## V1.0 — Supabase bağlantısı ilk aşama
- Yerel demo veri akışı, Supabase JS v2 kullanan canlı istemci akışıyla değiştirildi.
- E-posta OTP üyeliği ve doğrulaması eklendi; görünen kimlik takma ad olarak kaldı.
- Anonim ziyaretçi kitaplığı ve devam eden kitapların son cümlesini görebilir.
- Kitaplık, katkılar, cümle okuma, bildirimler ve profil istatistikleri Supabase sorgularına bağlandı.
- Cümle katkısı, raporlama ve yönetici kitap oluşturma RPC fonksiyonlarına bağlandı.
- Yönetici rolü olan kullanıcı için kitap oluşturma paneli eklendi.
- İlk entegrasyon ve yayın öncesi kontrol notları `DEPLOY_LIVE.md` içine eklendi.

Not: Bu aşama kod entegrasyonudur. Gerçek tarayıcı/SMTP/iki kullanıcı uçtan uca testleri yapılmadan production-ready kabul edilmez.

## Magic Link giriş güncellemesi
- 6 haneli kod arayüzü kaldırıldı; Supabase e-posta Magic Link akışına geçildi.
- Giriş bağlantısı, uygulamanın mevcut origin ve sayfasına geri dönecek şekilde `emailRedirectTo` ile istenir.
- Kullanıcıya e-postayı kontrol etmesi ve bağlantıyı aynı tarayıcıda açması gerektiği açıklanır.
- Supabase Auth Redirect URLs ve Magic Link e-posta şablonu için kurulum notları güncellendi.
