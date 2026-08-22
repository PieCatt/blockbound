# Ürün Görselleri Yüklenirken Animasyonlu Yer Tutucu

## Amaç

Mağaza (Öne çıkan ürünler) ve Ücretsiz Ürünler bölümlerinde ürün görseli yüklenene kadar, blog kartlarındaki görsel gibi animasyonlu bir yer tutucu göstermek: piksel ızgara (pixel-grid) deseni + gradyan zemin + havada süzülen (animate-float) parlayan küp animasyonu. Görsel yüklenince yumuşak bir geçişle (fade-in) gerçek görsele dönüşür.

## Yapılacaklar

1. **Yeniden kullanılabilir bileşen**: `src/components/ProductImage.tsx`
   - Props: `src`, `alt`, `className` (hover scale gibi mevcut sınıflar korunur).
   - İçerik: blog kartındaki görsel bloğun aynısı — `bg-gradient-to-br` gradyan zemin, `pixel-grid` overlay, ortada `bg-gradient-primary` + `shadow-glow` + `animate-float` küp.
   - `img` için `onLoad` state'i: yüklenene kadar yer tutucu görünür, görsel `opacity-0`; yüklendikten sonra yer tutucu kalkar ve görsel yumuşakça belirir (`transition-opacity`).
2. **Uygulanacak yerler** (mevcut `<img>` kullanımları bu bileşenle değiştirilecek):
   - `src/components/Products.tsx` — mağaza kartları (aspect-square).
   - `src/components/FreeProducts.tsx` — ücretsiz ürün kartları (aspect-[16/10]).
   - `src/pages/ProductsPage.tsx` — tüm koleksiyon sayfasındaki kartlar (tutarlılık için).
3. **Davranış korunur**: hover'da büyüme, rozetler (badge/indirim), üstteki gradyan karartma ve tıklama davranışları aynen kalır.

## Teknik notlar

- Blog kartındaki görsel stili referans alınır (`src/components/Blog.tsx` içindeki `pixel-grid` + `animate-float` küp bloğu).
- Yeni CSS gerekmez; mevcut `pixel-grid`, `animate-float`, `bg-gradient-primary`, `shadow-glow` sınıfları kullanılır.
- Ürünlerde blog'daki gibi ürün bazlı `gradient` alanı olmadığından tek tip tema gradyanı kullanılır.
- Veritabanı veya veri akışında değişiklik yok.
