export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  gradient: string;
  readTime: string;
  content: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "1-21-guncellemesi",
    title: "1.21 güncellemesi: Tüm yenilikler ve sırlar",
    excerpt: "Trial Chambers, Breeze ve daha fazlası... Yeni sürümün getirdiği her şey.",
    date: "12 Mart 2026",
    category: "Güncelleme",
    gradient: "from-primary/40 to-accent-purple/40",
    readTime: "6 dk okuma",
    content: [
      "Minecraft 1.21 'Tricky Trials' güncellemesi, oyuncuları tamamen yeni bir keşif deneyimine davet ediyor. Bu sürümün en dikkat çekici yeniliği şüphesiz Trial Chambers — yeraltında üretilen, savaş ve ödül odaklı yapılar.",
      "Trial Spawner adlı yeni mob üretici, oyuncu sayısına göre dinamik olarak zorluk ayarlıyor. Tek başına girersen daha az düşman, dört kişiyle girersen ekran dolusu mob seni karşılıyor. Vault adlı yeni bloklar ise Trial Key kullanılarak açılan ödül sandıkları işlevi görüyor.",
      "Breeze, bu güncellemenin yeni mob'u. Hava saldırılarıyla seni yerinden eden bu uçucu varlık, Breeze Rod düşürüyor — bu da yeni Wind Charge silahını crafting için gerekli. Mace adlı yeni silah ise yükseklikten düşerken devasa hasar veriyor; doğru kombinasyonla patron savaşlarını saniyelere indirebilirsin.",
      "Crafter bloğu otomasyon severler için bir devrim. Redstone sinyaliyle tetiklenen bu blok, otomatik crafting hattı kurmayı mümkün kılıyor. Demir farmı, ok üretimi, hatta otomatik fırın hatları artık çok daha pratik.",
      "Bizim önerimiz: Önce yakındaki bir Trial Chamber'ı bul, Wind Charge'larla mobilite kazan, ardından Mace'i crafting yapıp End'e dönüş yap. Bu sıralama, 1.21'in tüm tatlarını çıkarmanı sağlayacak.",
    ],
  },
  {
    slug: "redstone-tasarimlari",
    title: "En iyi 10 redstone tasarımı",
    excerpt: "Topluluğun paylaştığı en yaratıcı redstone makinelerinin derlemesi.",
    date: "5 Mart 2026",
    category: "Rehber",
    gradient: "from-accent-cyan/40 to-primary/40",
    readTime: "8 dk okuma",
    content: [
      "Redstone, Minecraft'ın gerçek zekâ testidir. Bu yazıda topluluğun paylaştığı, hem işlevsel hem de estetik açıdan dikkat çeken 10 muhteşem tasarımı inceliyoruz.",
      "1. Otomatik Sıralama Sistemi: Hopper'lar ve karşılaştırıcılarla kurulan, eşyaları cinsine göre sandıklara dağıtan sistem. Yeni başlayanlar için en kullanışlı proje.",
      "2. Gizli Pistonlu Kapı: 2x2 sticky piston düzeniyle duvara entegre olan bu kapı, baz savunması için ideal. Doğru gizlendiğinde kimse fark edemez.",
      "3. Tam Otomatik Çiftlik: Observer + dispenser kombinasyonuyla kurulan, sürekli buğday/havuç/patates üreten kompakt çiftlik tasarımı.",
      "4. TNT Topu: 16 blok mesafede patlayan, mancınık benzeri yıkım aracı. PvP sunucularının vazgeçilmezi.",
      "5. Asansör Sistemi: Su sütunu ve soul sand kombinasyonu yerine, redstone tabanlı piston merdiveniyle çok katlı yapılarda hız kazandıran tasarım.",
      "Listenin geri kalanı için bizi takip etmeye devam et — ikinci bölümde 6'dan 10'a kadar olan tasarımları incelemeye devam edeceğiz.",
    ],
  },
  {
    slug: "speedrun-rekorlari",
    title: "Speedrun rekorları nasıl kırılıyor?",
    excerpt: "Dünya çapındaki speedrun camiasının teknikleri ve ipuçları.",
    date: "28 Şubat 2026",
    category: "Esports",
    gradient: "from-accent-purple/40 to-accent-cyan/40",
    readTime: "5 dk okuma",
    content: [
      "Minecraft speedrun, oyunu en hızlı şekilde bitirmeye odaklanan bir disiplin. Şu an dünya rekoru 'Any% Glitchless Random Seed' kategorisinde 6 dakika 50 saniye civarında — inanılmaz değil mi?",
      "Speedrunner'ların en önemli silahı 'piglin trading'. Nether'a girer girmez bartering yaparak ender pearl ve obsidian elde etmek, klasik blaze farming yolundan onlarca dakika tasarruf sağlıyor.",
      "İkinci kritik teknik 'lava boating'. Boat ile Nether'da lavanın üzerinde gezinerek hem hızlı hareket ediyor hem de zarar almıyorsun. Pratik gerektiren ama öğrenildiğinde oyun değiştiren bir taktik.",
      "End portalına ulaştıktan sonraki 'bed bombing' tekniği ise Ender Dragon'u 30 saniyede yenmeye olanak tanıyor. Yatakların Nether ve End'de patladığı gerçeği, speedrun'da olağanüstü hasar kaynağı.",
      "Sen de denemek istersen, 'Set Seed' kategorisiyle başla. Tohumu önceden bilmek, rastgelelik faktörünü ortadan kaldırıyor ve teknikleri öğrenmek çok daha kolay oluyor.",
    ],
  },
];
