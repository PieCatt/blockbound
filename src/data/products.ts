import sword from "@/assets/product-sword.jpg";
import pickaxe from "@/assets/product-pickaxe.jpg";
import armor from "@/assets/product-armor.jpg";
import elytra from "@/assets/product-elytra.jpg";
import book from "@/assets/product-book.jpg";
import beacon from "@/assets/product-beacon.jpg";
import type { Product } from "@/context/CartContext";

export const categories = [
  "Tümü",
  "Koleksiyon",
  "Premium",
  "Figür",
  "Sanat",
  "Aksesuar",
  "Aydınlatma",
  "Kıyafet",
] as const;

export const products: Product[] = [
  {
    id: 1,
    name: "Diamond Sword Replica",
    category: "Koleksiyon",
    price: 899,
    img: sword,
    badge: "Yeni",
    description: "Premium reçine döküm, gerçek boyutlu Diamond Sword replika. LED iç aydınlatma ve duvar standı dahil.",
  },
  {
    id: 2,
    name: "Golden Pickaxe Edition",
    category: "Premium",
    price: 1249,
    img: pickaxe,
    badge: "Sınırlı",
    description: "El boyaması, 24K altın varak detaylı sınırlı sayıda Golden Pickaxe. Numaralandırılmış sertifika ile.",
  },
  {
    id: 3,
    name: "Netherite Armor Figür",
    category: "Figür",
    price: 2199,
    img: armor,
    description: "30 cm yüksekliğinde, hareketli eklemli Netherite zırhlı savaşçı figürü. Koleksiyoner kutusunda.",
  },
  {
    id: 4,
    name: "Elytra Wings Poster",
    category: "Sanat",
    price: 349,
    img: elytra,
    badge: "İndirim",
    description: "70x100 cm, parlak premium kağıt baskılı Elytra havai fişek temalı poster. Çerçeve dahil değildir.",
  },
  {
    id: 5,
    name: "Enchanted Book",
    category: "Aksesuar",
    price: 499,
    img: book,
    description: "Mor parlamalı LED'li, dokunmatik açılabilen büyülü kitap dekorasyon objesi.",
  },
  {
    id: 6,
    name: "Glow Beacon Lamp",
    category: "Aydınlatma",
    price: 1599,
    img: beacon,
    badge: "Popüler",
    description: "Tavandan yansıyan ışın efektli, 16 milyon renk, uygulamadan kontrollü Beacon masa lambası.",
  },
  {
    id: 7,
    name: "Creeper Hoodie",
    category: "Kıyafet",
    price: 749,
    img: armor,
    description: "Organik pamuk Creeper desenli kapüşonlu sweatshirt. Unisex kesim, S-XXL beden seçenekleri.",
  },
  {
    id: 8,
    name: "Redstone Mug",
    category: "Aksesuar",
    price: 199,
    img: book,
    badge: "Yeni",
    description: "Sıcakla rengi değişen Redstone temalı 350ml seramik kupa.",
  },
  {
    id: 9,
    name: "Ender Dragon Heykel",
    category: "Figür",
    price: 3499,
    img: pickaxe,
    badge: "Premium",
    description: "El yapımı, 50 cm kanat açıklığında polyester reçine Ender Dragon heykel. Limited 100 adet.",
  },
];

export const freeProducts: Product[] = [
  {
    id: 1001,
    name: "Pixel Wallpaper Paketi",
    category: "Dijital",
    price: 0,
    img: elytra,
    badge: "Ücretsiz",
    description: "4K çözünürlüğünde 12 adet Minecraft temalı duvar kağıdı paketi.",
  },
  {
    id: 1002,
    name: "Skin Şablon Seti",
    category: "Dijital",
    price: 0,
    img: book,
    badge: "Ücretsiz",
    description: "Topluluğa açık 20 adet özgün karakter skin şablonu.",
  },
  {
    id: 1003,
    name: "Texture Pack Lite",
    category: "Dijital",
    price: 0,
    img: beacon,
    badge: "Ücretsiz",
    description: "Stüdyomuzun hazırladığı hafif sürüm texture paketi. 32x çözünürlük.",
  },
];
