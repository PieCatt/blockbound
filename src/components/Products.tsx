import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useContent";
import { useCart, formatPrice, type Product } from "@/context/CartContext";
import { getTag, sortByTagPriority } from "@/lib/productTags";
import ProductDialog from "./ProductDialog";
import ProductImage from "./ProductImage";

const Products = () => {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { data: products = [], isLoading } = useProducts();

  const sorted = sortByTagPriority(products);
  const visible = showAll ? sorted : sorted.slice(0, 6);

  return (
    <section id="products" className="relative py-12 md:py-16">
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

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-glow" /></div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p, i) => {
            const hasDiscount = p.original_price != null && p.original_price > p.price;
            const discountPct = hasDiscount ? Math.round((1 - p.price / (p.original_price as number)) * 100) : 0;
            const effectiveBadge = p.badge || (hasDiscount ? "İndirim" : null);
            const tag = getTag(effectiveBadge);
            return (
            <article
              key={p.id}
              className={`group relative glass-card glow-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant animate-fade-in-up ${tag?.cardClass ?? ""}`}
              style={{ animationDelay: `${i * 80}ms`, ...(tag ? { ["--tag-color" as any]: tag.borderColor } : {}) }}
            >
              <div className="relative aspect-square overflow-hidden bg-secondary/40">
                <ProductImage
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                  {effectiveBadge && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${tag?.badgeClass ?? "bg-gradient-primary text-primary-foreground shadow-glow"}`}>
                      {effectiveBadge}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-black bg-rose-500 text-rose-50 shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                      -%{discountPct}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="hero" size="sm" onClick={() => addToCart(p)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Sepete Ekle
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Ürünü görüntüle" onClick={() => setSelected(p)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 cursor-pointer" onClick={() => setSelected(p)}>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary-glow mb-2">
                  {p.category}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-black gradient-text">{formatPrice(p.price)}</span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(p.original_price as number)}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">Stokta</span>
                </div>
              </div>
            </article>
          );})}
        </div>
        )}

        <div className="text-center mt-14 flex flex-wrap items-center justify-center gap-4">
          {products.length > 6 && (
            <Button variant="outline" size="lg" onClick={() => setShowAll((v) => !v)}>
              {showAll ? "Daha Az Göster" : "Daha Fazla Göster"}
            </Button>
          )}
          <Button variant="hero" size="lg" asChild>
            <a href="/products" target="_blank" rel="noopener noreferrer">
              Tüm Koleksiyonu Gör
            </a>
          </Button>
        </div>
      </div>

      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default Products;
