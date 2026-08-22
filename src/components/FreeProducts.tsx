import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Gift, Loader2 } from "lucide-react";
import { useFreeProducts } from "@/hooks/useContent";
import { FREE_DOWNLOAD_URL } from "@/lib/links";
import ProductImage from "@/components/ProductImage";

const DESC_LIMIT = 140;

const FreeProductCard = ({ p, i }: { p: any; i: number }) => {
  const [expanded, setExpanded] = useState(false);
  const long = (p.description?.length ?? 0) > DESC_LIMIT;
  const shown = !long || expanded ? p.description : `${p.description.slice(0, DESC_LIMIT).trimEnd()}…`;

  return (
    <article
      className="group relative glass-card glow-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant animate-fade-in-up flex flex-col"
      style={{ animationDelay: `${i * 100}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary/40">
        <ProductImage
          src={p.img}
          alt={p.name}
          className="w-full h-full object-cover group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
        {p.badge && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-primary text-primary-foreground shadow-glow">
            {p.badge}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary-glow mb-2">
          {p.category}
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">
          {p.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {shown}
          {long && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="ml-1 text-primary-glow font-semibold hover:underline"
            >
              {expanded ? "Daha az oku" : "Devamını oku"}
            </button>
          )}
        </p>
        <Button variant="hero" size="sm" className="w-full mt-auto" asChild>
          <a href={FREE_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" /> Ücretsiz İndir
          </a>
        </Button>
      </div>
    </article>
  );
};

const FreeProducts = () => {
  const { data: items = [], isLoading } = useFreeProducts();

  return (
    <section id="free" className="relative py-12 md:py-16">
      <div className="container">
        <div className="max-w-2xl mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
            <Gift className="h-4 w-4" /> Ücretsiz
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="gradient-text">Ücretsiz</span> Ürünler
          </h2>
          <p className="text-lg text-muted-foreground">
            Stüdyomuzun hazırladığı ücretsiz dijital içerikleri keşfet ve hemen indir.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-glow" /></div>
        ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((p, i) => <FreeProductCard key={p.id} p={p} i={i} />)}
        </div>
        )}
      </div>
    </section>
  );
};

export default FreeProducts;
