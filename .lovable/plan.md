## Plan: Logo'yu üst ve alttan kırpma

Logodaki üst ve alt boşlukları kaldıracağız. İki seçenek var; en temizi PNG'yi yeniden işleyip şeffaf kenarları trim etmek.

### Yapılacaklar

1. **`src/assets/blockbound-logo.png`** — Görselin üstündeki ve altındaki şeffaf/boş alanları otomatik trim et (sadece içerik kalacak şekilde sıkı kırpma).
2. **`src/components/Navbar.tsx`** — Logo artık daha kompakt olacağı için `h-20` değerini koruyabiliriz; gerekirse hizalama için `object-contain` zaten var, ek değişiklik gerekmez.
3. **`src/index.css`** — `.logo-text-overlay` mask'i logo görseline bağlı (`--logo-src`), trim sonrası mask otomatik yeni orana uyacağından animasyon bozulmadan çalışmaya devam edecek. Gerekirse mask gradient başlangıç noktası (28%/33%) yeni orana göre küçük bir ayar alabilir.

### Sonuç
Navbar'da logo dikeyde daha sıkı görünecek, üst/alt fazla boşluk kalmayacak ve mevcut hover gradyan animasyonu çalışmaya devam edecek.