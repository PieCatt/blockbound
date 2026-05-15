import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Loader2, ShoppingCart } from "lucide-react";
import { useProducts } from "@/hooks/useContent";
import { CartProvider, formatPrice, useCart, type Product } from "@/context/CartContext";
import { getTag } from "@/lib/productTags";
import ProductDialog from "@/components/ProductDialog";
import CartSheet from "@/components/CartSheet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Catalog = () => {
  const [active, setActive] = useState<string>("Tümü");
  const [selected, setSelected] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { data: products = [], isLoading } = useProducts();

  const categories = useMemo(() => {
    const set = new Set<string>(["Tümü"]);
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(
    () => (active === "Tümü" ? products : products.filter((p) => p.category === active)),
    [active, products],
  );

  return (
    <section className="container pt-24 pb-12">
      <div className="mb-10 animate-fade-in-up">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <a href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Anasayfa</a>
        </Button>
        <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
          // Tüm Koleksiyon
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          Koleksiyonu <span className="gradient-text">keşfet</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Premium fiziksel ürünlerden dijital içeriklere kadar tüm Blockbound koleksiyonu.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              active === c
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-glow" /></div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => {
          const hasDiscount = p.original_price != null && p.original_price > p.price;
          const discountPct = hasDiscount ? Math.round((1 - p.price / (p.original_price as number)) * 100) : 0;
          const effBadge = p.badge || (hasDiscount ? "İndirim" : null);
          const tag = getTag(effBadge);
          return (
          <article
            key={p.id}
            className={`group relative glass-card glow-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant animate-fade-in-up ${tag?.cardClass ?? ""}`}
            style={{ animationDelay: `${i * 60}ms`, ...(tag ? { ["--tag-color" as any]: tag.borderColor } : {}) }}
          >
            <div className="relative aspect-square overflow-hidden bg-secondary/40">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                {effBadge && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${tag?.badgeClass ?? "bg-gradient-primary text-primary-foreground shadow-glow"}`}>
                    {effBadge}
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
              <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">{p.name}</h3>
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

      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

const ProductsPage = () => {
  useEffect(() => {
    document.title = "Tüm Koleksiyon — Blockbound Studios";
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Catalog />
        </main>
        <Footer />
        <CartSheet />
      </div>
    </CartProvider>
  );
};

export default ProductsPage;
