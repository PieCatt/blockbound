# Ürünler ve Blog Yüklenmeme Sorunu

## Teşhis

Ağ isteklerinde `products` ve `posts` sorguları sürekli "Failed to fetch" hatası veriyor ve tekrar deneniyor. Uygulama kodu doğru; sorun Lovable Cloud backend'inin şu anda başlatılıyor / askıda olması (`cloud_status` henüz sağlıklı dönmüyor). Veritabanı API'sine hiç ulaşılamadığı için ana sayfadaki ürünler, ücretsiz ürünler ve blog yazıları boş kalıyor.

## Plan

1. **Backend durumunu izle**: `cloud_status` kontrolünü tekrarla; `ACTIVE_HEALTHY` olana kadar bekle.
2. **Gerekirse yeniden başlat**: Durum takılı kalırsa (INACTIVE / UNHEALTHY / uzun süre COMING_UP) onayınla backend'i yeniden başlat (`restart`) ve tekrar durumu izle.
3. **Verileri doğrula**: `products` ve `posts` tablolarına sorgu atarak verilerin yerinde olduğunu ve API'nin yanıt verdiğini kontrol et.
4. **Ön yüzde doğrula**: Preview'da ürünlerin ve blog yazılarının yüklendiğini Playwright ile ekran görüntüsü alarak doğrula.
5. **Kötü durumda kullanıcı deneyimini iyileştir (küçük kod değişikliği)**: Backend geçici olarak ulaşılamazsa sonsuz yüklenme animasyonu yerine "Şu an içerik yüklenemiyor, sayfayı yenilemeyi deneyin" tarzı bir hata mesajı göster (react-query `isError` durumu). Böylece ileride backend yine başlatılırken site boş spinner'da kalmaz.

## Teknik notlar

- Kod tarafında değişiklik: `src/hooks/useContent.ts` sorguları aynı kalır; sadece `Blog`, `Products`, `FreeProducts` (ve ilgili sayfalar) bileşenlerinde `isError` kontrolü eklenir.
- Herhangi bir şema/veri tabanı değişikliği yapılmayacak.
