## Plan

### 1. Ürün çerçevesi (tag-border) düzeltme
- `src/index.css` → `.tag-border::after` mevcut çift katmanlı/yansımalı görünüm yerine **2px ince kenarlık** olacak şekilde yeniden yazılır.
- Conic gradient sadece `--tag-color` + `white` (2 stop, dönen) kullanır; siyah/şeffaf stop'lar kaldırılır → temiz beyaz + renk dönmesi.
- Hız 6s → 4s, padding 3px → 2px, inset -2px.

### 2. İndirim sistemi
- **DB migration:** `products` tablosuna `original_price numeric NULL` kolonu eklenir.
- Admin formunda "Eski fiyat (opsiyonel)" alanı; doluysa kart üzerinde:
  - Eski fiyat üstü çizili (`line-through text-muted-foreground`)
  - Yeni fiyat gradient
  - Otomatik hesaplanan **% indirim rozeti** (örn. `-25%`) — kırmızı/rose tema.
- "İndirim" tag'i opsiyonel, ama `original_price` varsa otomatik `İndirim` rozeti gösterilir ve sıralamada öncelik kazanır.
- Uygulanan dosyalar: `Products.tsx`, `ProductsPage.tsx`, `ProductDialog.tsx`, `AdminProductForm.tsx`, `productTags.ts`, `CartContext.tsx` (Product tipi).

### 3. Kategori autocomplete
- `AdminProductForm.tsx`: kategori `<Input>` yerine `<input list="...">` + `<datalist>`.
- Datalist seçenekleri **mevcut ürünlerde fiilen kullanılan** distinct kategorilerden gelir (`useProducts` ile). Ürünü olmayan kategori otomatik kaybolur.

### 4. Blog → "Wiki Sayfasını Görüntüle" butonu
- `Blog.tsx` ve/veya `BlogPostDialog.tsx`'de "Devamını oku" yanına ikinci buton (`variant="outline"`) eklenir.
- Link şimdilik placeholder (`#`) → kullanıcı sonra verecek (sabit `WIKI_URL`, `FREE_DOWNLOAD_URL` olarak `src/lib/links.ts` içinde tutulur).

### 5. Ücretsiz indir butonları
- `FreeProducts.tsx` ve diğer tüm "Ücretsiz İndir" CTA'ları aynı `FREE_DOWNLOAD_URL` constant'ına bağlanır (`src/lib/links.ts`, placeholder `#`).

### 6. Logo animasyon renkleri
- `src/index.css` `.logo-mark .logo-text-overlay`:
  - Başlangıç (idle) gradient'ı sade bırakılır (mevcut tema mavi).
  - Hover gradient'ı **tema içinde** daha geniş tonlarla genişletilir: cyan 190, blue 210, indigo 230, violet 265, teal 175 — 6+ stop.

### 7. Hex Editor sayfası + MOTD Generator sayfası
- Yeni rota: `/hex-editor` → `src/pages/HexEditorPage.tsx` → `Navbar` + boş `<main>` (sadece sayfa başlığı) + `Footer` + `CartProvider` + `CartSheet` (Index'le aynı kabuk).
- Yeni rota: `/motd-generator` → `src/pages/MotdGeneratorPage.tsx` (aynı kabuk, başlık "MOTD Generator").
- `App.tsx` route'lar eklenir. (Navigasyon menüsüne eklemek istenirse ayrıca söylenir.)

### 8. Ana sayfa "Kullanıcı Yorumları" bölümü
- Yeni `src/components/Testimonials.tsx`: 3-4 sabit örnek yorum (avatar baş harfi, isim, rol, yıldız, yorum) → glass-card grid.
- `Index.tsx`'e `<Social />` öncesine eklenir.

### 9. Ücretsiz ürün açıklamasında "Devamını oku / Daha az oku"
- `FreeProducts.tsx`'te kart açıklaması bir karakter eşiğinin (örn. 140) üzerinde ise kesilir + inline "Devamını oku" buton.
- Açıkken sonunda "Daha az oku".
- State kart bazında local `useState`.

### 10. Ana sayfa & ürünler sayfası bölüm boşlukları
- Ana sayfa section'larındaki `py-24 md:py-32` → `py-12 md:py-16` (yarı yarıya).
- Etkilenen dosyalar: `Hero.tsx`, `About.tsx`, `Products.tsx`, `FreeProducts.tsx`, `Blog.tsx`, `Social.tsx`, `Testimonials.tsx`, `ProductsPage.tsx` (catalog `pt-32 pb-24` → `pt-20 pb-12`).

### 11. ProductDialog: uzun açıklama davranışı
- Açıklama 220+ karakter ise **collapsed** başlar; "Hemen Al" + "Sepete Ekle" + tikli özellik listesi her zaman scroll yapmadan görünür kalır.
- Layout: dialog 2 sütun grid (sol görsel/embed, sağ üst sticky CTA + features, sağ alt scrollable açıklama).
- "Devamını oku"ya basılınca açıklama tam genişler; bu durumda **tikli features listesi açıklamanın altına taşınır**, ama "Hemen Al" + "Sepete Ekle" üstte sticky kalır.
- "Daha az oku" ile eski düzene döner.

### Bana sonradan söylemen gerekenler (her mesajda hatırlatacağım)
1. **Wiki sayfası linki** ("Wiki Sayfasını Görüntüle" butonu için)
2. **Ücretsiz indir linki** (tüm "Ücretsiz İndir" butonları için)

### Teknik notlar
- DB değişikliği: tek migration → `ALTER TABLE products ADD COLUMN original_price numeric;`
- Yeni dosyalar: `src/lib/links.ts`, `src/components/Testimonials.tsx`, `src/pages/HexEditorPage.tsx`, `src/pages/MotdGeneratorPage.tsx`.
- Düzenlenen: `index.css`, `App.tsx`, `Index.tsx`, `Hero.tsx`, `About.tsx`, `Products.tsx`, `ProductsPage.tsx`, `ProductDialog.tsx`, `FreeProducts.tsx`, `Blog.tsx`, `BlogPostDialog.tsx`, `Social.tsx`, `AdminProductForm.tsx`, `productTags.ts`, `CartContext.tsx`, `useContent.ts` (yeni alan).
