
# Admin paneli kurulum planı

Amacın net: kod dosyalarını elle düzenlemeden, siteye girip yeni blog yazısı ve ürün ekleyebileceğin bir yönetim paneli. Görselleri Unsplash/imgur gibi yerlerden URL olarak yapıştıracaksın, dosya yükleme yok — bu kurulumu çok hızlandırır.

## 1. Lovable Cloud aktivasyonu
- Backend için Lovable Cloud açılacak (database + auth + login).
- Şu an `src/data/posts.ts` ve `src/data/products.ts` içinde sabit duran veriler veritabanına taşınacak.

## 2. Veritabanı tabloları
İki ana tablo:

**`posts`** — blog yazıları
- `id`, `slug`, `title`, `excerpt`, `category`, `date`, `read_time`, `gradient`, `content` (paragraflar listesi), `created_at`

**`products`** — ürünler
- `id`, `name`, `category`, `price`, `badge`, `img`, `description`, `is_free` (ücretsiz ürünler için işaret), `created_at`

**`user_roles`** — kim admin?
- Sadece `admin` rolüne sahip kullanıcılar panele girebilsin. Güvenlik için ayrı tablo + `has_role()` fonksiyonu kullanılacak (privilege escalation engellemek için zorunlu).

Tüm tablolarda Row Level Security açık olacak:
- Herkes `posts` ve `products` okuyabilir (site ziyaretçileri için).
- Sadece adminler ekleyebilir / düzenleyebilir / silebilir.

## 3. Authentication
- Email + şifre ile giriş.
- `/admin/login` sayfası.
- İlk admin kullanıcıyı sen kayıt olunca, sana o kullanıcıyı manuel olarak admin yapmanın adımlarını anlatacağım (Cloud → Database → user_roles tablosuna tek satır ekleme).

## 4. Admin paneli sayfaları
`/admin` altında, sadece girişli adminlere açık:

- **`/admin`** → Dashboard, son eklenen yazı/ürün özeti, "Yeni ekle" butonları.
- **`/admin/posts`** → Tüm yazıların listesi, her satırda Düzenle / Sil.
- **`/admin/posts/new`** ve **`/admin/posts/:id`** → Form: başlık, kategori, özet, görsel URL, tarih, içerik (her paragraf bir satır olarak girilecek textarea).
- **`/admin/products`** → Tüm ürünlerin listesi (normal + ücretsiz birlikte, filtre ile ayrılır).
- **`/admin/products/new`** ve **`/admin/products/:id`** → Form: ad, kategori, fiyat, rozet, görsel URL, açıklama, "Ücretsiz mi?" anahtarı.

Tüm formlarda zod ile validation, kaydetme sonrası toast mesajı ve listeye dönüş.

## 5. Mevcut sayfaların güncellenmesi
- `Blog`, `BlogPage`, `Products`, `ProductsPage`, `FreeProducts` bileşenleri artık `posts.ts`/`products.ts` yerine veritabanından çekecek (React Query ile).
- Ücretsiz ürünler için `is_free = true` filtresi.
- Eski sabit veri dosyaları sadece migration için bir defa içeri aktarılır, sonra silinir.

## 6. Navbar
Sağ üste küçük bir "Admin" linki eklenecek — sadece girişli admin görür, başkasında gizli.

## Teknik notlar
- Storage / dosya yükleme YOK (sen istemedin). Görsel alanları sadece URL input'u olacak, önizleme küçük thumbnail gösterir.
- Admin paneli görsel olarak siteyle uyumlu (glass-card, gradient-text), ama daha kompakt liste/form düzeni.
- React Hook Form + zod kullanılacak.
- Mevcut sabit veriler bir kerelik insert ile veritabanına taşınacak ki bugünkü blog/ürünlerin kaybolmasın.

## Senin yapacakların (sadece bir defa)
1. Bu planı onayla → Cloud açılır, tablolar kurulur, admin paneli yazılır.
2. `/admin/login` üzerinden bir hesap aç.
3. Sana göstereceğim tek satırlık adımla kendini admin yap.
4. Bundan sonra: yeni blog/ürün eklemek için sadece `/admin` → "Yeni ekle" → kaydet. Site anında güncellenir, kod değişmez, yeniden yayınlama gerekmez.

Onaylarsan kuruluma başlıyorum.
