import { Button } from "@/components/ui/button";
import { Download, Gift } from "lucide-react";
import { freeProducts } from "@/data/products";
import { toast } from "sonner";

const FreeProducts = () => {
  return (
    <section id="free" className="relative py-24 md:py-32">
      <div className="container">
        <div className="max-w-2xl mb-16 animate-fade-in-up">
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

        <div className="grid md:grid-cols-3 gap-6">
          {freeProducts.map((p, i) => (
            <article
              key={p.id}
              className="group relative glass-card glow-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary/40">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-primary text-primary-foreground shadow-glow">
                  {p.badge}
                </span>
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary-glow mb-2">
                  {p.category}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">
                  {p.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{p.description}</p>
                <Button
                  variant="hero"
                  size="sm"
                  className="w-full"
                  onClick={() => toast.success(`${p.name} indiriliyor...`)}
                >
                  <Download className="mr-2 h-4 w-4" /> Ücretsiz İndir
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeProducts;
