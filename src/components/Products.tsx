import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import sword from "@/assets/product-sword.jpg";
import pickaxe from "@/assets/product-pickaxe.jpg";
import armor from "@/assets/product-armor.jpg";
import elytra from "@/assets/product-elytra.jpg";
import book from "@/assets/product-book.jpg";
import beacon from "@/assets/product-beacon.jpg";

const products = [
  { id: 1, name: "Diamond Sword Replica", category: "Koleksiyon", price: "₺899", img: sword, badge: "Yeni" },
  { id: 2, name: "Golden Pickaxe Edition", category: "Premium", price: "₺1.249", img: pickaxe, badge: "Sınırlı" },
  { id: 3, name: "Netherite Armor Figür", category: "Figür", price: "₺2.199", img: armor },
  { id: 4, name: "Elytra Wings Poster", category: "Sanat", price: "₺349", img: elytra, badge: "İndirim" },
  { id: 5, name: "Enchanted Book", category: "Aksesuar", price: "₺499", img: book },
  { id: 6, name: "Glow Beacon Lamp", category: "Aydınlatma", price: "₺1.599", img: beacon, badge: "Popüler" },
];

const Products = () => {
  return (
    <section id="products" className="relative py-24 md:py-32">
      <div className="container">
        <div className="max-w-2xl mb-16 animate-fade-in-up">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
            // Mağaza
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            Öne çıkan <span className="gradient-text">ürünler</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Topluluğun en sevdiği koleksiyon parçaları, premium figürler ve dijital içerikler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <article
              key={p.id}
              className="group relative glass-card glow-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-square overflow-hidden bg-secondary/40">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                {p.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-primary text-primary-foreground shadow-glow">
                    {p.badge}
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="hero" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Sepete Ekle
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Ürünü görüntüle">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary-glow mb-2">
                  {p.category}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black gradient-text">{p.price}</span>
                  <span className="text-xs text-muted-foreground">Stokta</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-14">
          <Button variant="outline" size="lg">Tüm Koleksiyonu Gör</Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
