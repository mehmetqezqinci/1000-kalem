# 1000 Kalem — V1.0 Ürün Gereksinimleri

**Durum:** Onaylandı — 23 Kasım 2026  
**Sürüm hedefi:** İlk herkese açık üretim sürümü

## 1. Ürün amacı

1000 Kalem, her biri tam 1000 cümleden oluşan ortak kitapların kullanıcıların tek cümlelik katkılarıyla oluşturulduğu dijital edebiyat platformudur. Deneyimin odağı bireysel rekabet değil, kolektif üretimdir.

## 2. Değiştirilemez ürün kuralları

1. Her kitap tam 1000 cümlelik bir eserdir.
2. Kitabın 1. cümlesini yalnızca yönetici oluştururken belirler. Kitap ilk cümle olmadan yayımlanamaz.
3. Her doğrulanmış hesap aynı kitaba en fazla bir cümle ekleyebilir; farklı kitaplara ayrı ayrı katkı verebilir.
4. Kullanıcı katkı yapmadan önce devam eden kitaptan yalnızca en son yayımlanmış cümleyi görebilir.
5. Katkısı başarıyla kaydedilen kullanıcı, o kitabın yayımlanmış tüm cümlelerini okuyabilir.
6. Devam eden kitabın tam metni, katkıda bulunmamış kullanıcıya hiçbir istemci veya doğrudan API yolu üzerinden açılmaz.
7. Kitap 1000. cümleyle tamamlandığında arşive taşınır ve herkesçe okunabilir.
8. Kullanıcıların birbirine görünen kimliği yalnızca seçtikleri takma addır. Gerçek ad ve e-posta kitaplarda, profillerde veya herkese açık API yanıtlarında gösterilmez.
9. Her katkı tek satır ve en fazla 200 karakterdir.
10. Kitap oluşturma, başlangıç cümlesi belirleme, durum değiştirme ve moderasyon yalnızca yönetici yetkisindedir.
11. Cümle numarası, katkı hakkı ve kitabın tamamlanma durumu istemcide değil sunucuda kesinleştirilir.

## 3. Kimlik ve üyelik

- Görünen kullanıcı adı: 2–24 karakterlik benzersiz takma ad.
- Hesap kimliği: Supabase Auth tarafından üretilen değişmez UUID.
- Üretim oturumu: E-posta OTP / Magic Link doğrulaması. E-posta diğer kullanıcılara gösterilmez.
- Takma ad değiştirilirse geçmiş katkıların yazarı değişmez; katkılar aynı UUID'ye bağlı kalır.
- Takma ad büyük/küçük harf duyarsız benzersiz olmalıdır.
- Kullanıcı hesap silme ve veri talepleri için açık süreç sunulmalıdır.

> “Sadece takma ad” kararı, diğer kullanıcılara görünen kimlik içindir. Güvenli hesap kurtarma ve farklı cihazlarda tek katkı hakkını korumak için arka planda doğrulanmış hesap gerekir. E-posta görünür profil alanı değildir.

## 4. Kullanıcı özellikleri

### 4.1 Kitaplık
- Açık kitapları listeleme, arama ve türe göre filtreleme.
- Kapak, başlık, kısa açıklama, tür, ilerleme, katılımcı sayısı ve kalan cümle sayısı.
- Kullanıcının o kitaba katkı yapıp yapmadığını gösterme.

### 4.2 Katkı akışı
- Katkı öncesi son cümleyi ve yazar takma adını gösterme.
- Cümle alanı son cümlenin hemen altında bulunur.
- 200 karakter sayacı, otomatik taslak, önizleme ve açık onay.
- Boş, çok satırlı, bağlantı içeren veya kişisel iletişim bilgisi barındıran katkıları reddetme.
- Başarılı gönderimden sonra tam kitap okuma görünümüne geçiş.
- Çakışan/eski son cümleye yanıt durumunda kullanıcıya yenileme uyarısı.

### 4.3 Profil ve katkılarım
- Takma ad ve hesap ayarları.
- Yazılan cümle, katkı verilen kitap ve tamamlanmasına katkıda bulunulan kitap sayısı.
- Katkı geçmişi; yalnızca kullanıcının yetkili olduğu içerik alanları.

### 4.4 Bildirimler
- Uygulama içi bildirim merkezi ve okunmamış sayısı.
- Kitabın tamamlanması bildirimi ilgili tüm katkıcılara gider.
- Katkı onayı ve yeni kitap duyuruları kullanıcı tercihine göre gönderilir.
- İsteğe bağlı e-posta bildirimleri; kullanıcı tercihleri ve abonelikten çıkma.
- Bildirimden ilgili kitap veya katkı ekranına geçiş.

### 4.5 Arşiv
- Tamamlanan kitaplar herkese açık listelenir.
- Tam metin, 1–1000 numaralı cümleler ve görünen takma adlar sıralı sunulur.
- Tamamlanma tarihi, tür, katılımcı sayısı ve kitap açıklaması gösterilir.
- Tamamlanan kitapların içeriği yönetici moderasyonu dışında değiştirilemez.

### 4.6 Paylaşım
- Her kitap için kalıcı, tahmin edilebilir ve içerik sızdırmayan slug/URL.
- Bağlantı kopyalama ve Web Share API; desteklenen sosyal ağlara paylaşım.
- Open Graph başlık, açıklama ve kapak görseli.
- Devam eden kitap bağlantısı gizlilik politikasını aşamaz: katkı yapmamış ziyaretçiye yalnızca son cümle gösterilir.
- Tamamlanan kitap bağlantısı herkese açık tam metni açar.

## 5. Yönetici paneli

- Kitap oluşturma: başlık, tür, açıklama, kapak ve zorunlu ilk cümle.
- Taslak, açık, duraklatılmış ve tamamlanmış durumları yönetme.
- Kitap ve katkı istatistiklerini görme.
- Şikâyetleri inceleme; cümleyi gizleme/yayımlama ve raporu sonuçlandırma.
- Kullanıcıyı kısıtlama/engelleme ve işlem geçmişini görme.
- Yönetici yetkisi yalnızca arayüzde değil, veritabanı RLS/RPC katmanında doğrulanır.

## 6. Platform istatistikleri

- Toplam kayıtlı kullanıcı, aktif kullanıcı, katkı, açık kitap ve tamamlanan kitap.
- Günlük/haftalık/aylık katkı trendi.
- Kitap başına ilerleme ve katılımcı sayısı.
- Kullanıcıya özel katkı istatistikleri.
- İstatistikler takma adlar üzerinden gereksiz sıralama/rekabet yaratacak şekilde sunulmaz.

## 7. Güvenlik ve gizlilik gereksinimleri

- PostgreSQL RLS varsayılanı kapalı değil, her tabloda açık ve test edilmiş olmalı.
- İstemciye `service_role` anahtarı verilmez.
- Cümle/kitap/katkı yazma işlemleri doğrulanmış RPC veya güvenli sunucu katmanından yapılır.
- Kitap satırı kilidi ve unique kısıtlarıyla eşzamanlı gönderim güvence altına alınır.
- Rate limit, CAPTCHA/Turnstile, IP/edge kötüye kullanım koruması ve loglama.
- Yedekleme, geri yükleme denemesi ve hata izleme.
- KVKK aydınlatma, gizlilik, kullanım koşulları, telif/katkı lisansı, çerez ve veri silme metinleri uzman incelemesinden geçer.

## 8. Yayın kabul kriterleri

- İki farklı hesapla aynı kitapta eşzamanlı gönderim doğru ve benzersiz sıra üretir.
- Aynı hesap ikinci katkıyı veremez; farklı kitaba katkı verebilir.
- 200 karakter kabul, 201 karakter ret edilir.
- 999. cümle kitabı açık bırakır; 1000. cümle tek seferde tamamlar; 1001. cümle hiçbir yoldan eklenemez.
- Katkı öncesi kullanıcı sadece son yayımlanmış cümleyi görür; API ile eski cümleleri çekemez.
- Katkı sonrası kullanıcı tam metni görür.
- Tamamlanan kitap herkesçe okunur.
- E-posta, Auth UUID ve özel profil verisi başka kullanıcılara sızmaz.
- Yönetici olmayan hesap kitap oluşturamaz, ilk cümleyi değiştiremez veya moderasyon yapamaz.
- Mobil, masaüstü, erişilebilirlik, yavaş bağlantı ve oturum yenileme testleri geçer.

## 9. İlk sürüm dışında tutulacaklar

- Kullanıcıların kendi kitaplarını oluşturması.
- Aynı kitapta birden fazla cümle yazma.
- Özel mesajlaşma ve sosyal takip ağı.
- Katkı sıralaması/yarışma/puan ekonomisi.
- Ücretli üyelik ve ödeme.

Bu özellikler ilk yayın kalitesini ve güvenliğini riske atmadan, sonraki sürümlerde ayrıca değerlendirilebilir.
