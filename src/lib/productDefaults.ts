import defaultImg from "@/assets/default-product.png.asset.json";

// Ürün eklerken görsel URL'si girilmezse kullanılacak varsayılan görsel.
export const DEFAULT_PRODUCT_IMAGE = defaultImg.url;

export const resolveProductImage = (src?: string | null) =>
  !src || !src.trim() || src.includes("placeholder.svg") ? DEFAULT_PRODUCT_IMAGE : src;

export const DEFAULT_PRODUCT_FEATURES = [
  "Stokta mevcut",
  "24 ay garanti",
  "Orijinal lisanslı ürün",
];
