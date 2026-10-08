import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, Headphones, MessageCircle, ShieldCheck, ShoppingCart, Zap } from "lucide-react";
import { formatPrice, useCart, type Product } from "@/context/CartContext";
import { DEFAULT_PRODUCT_FEATURES, resolveProductImage } from "@/lib/productDefaults";
import { DISCORD_URL } from "@/lib/links";

type Props = { product: Product | null; onClose: () => void };

const TRUST = [
  { icon: Zap, label: "Hızlı teslimat" },
  { icon: ShieldCheck, label: "Güvenli ödeme" },
  { icon: Headphones, label: "Discord desteği" },
];

const ProductDialog = ({ product, onClose }: Props) => {
  const { addToCart } = useCart();
  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    return [product.img, ...(product.images ?? [])].filter((v, i, a) => v && a.indexOf(v) === i);
  }, [product]);
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [product?.id]);

  if (!product) return null;

  const features = product.features?.length ? product.features : DEFAULT_PRODUCT_FEATURES;
  const hasDiscount = product.original_price != null && product.original_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / (product.original_price as number)) * 100) : 0;
  const paragraphs = (product.description || "").split(/\n+/).map((s) => s.trim()).filter(Boolean);

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl glass-card border-border/60 p-0 overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="grid md:grid-cols-[1.05fr_1fr]">
          {/* Görseller */}
          <div className="bg-secondary/30 md:border-r border-border/40">
            {product.embed_html && (
              <div className="w-full aspect-video bg-background [&_iframe]:w-full [&_iframe]:h-full [&_video]:w-full [&_video]:h-full"
                dangerouslySetInnerHTML={{ __html: product.embed_html }} />
            )}
            <div className="relative aspect-square overflow-hidden">
              <img src={resolveProductImage(gallery[active] ?? product.img)} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                {product.badge && <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-primary text-primary-foreground shadow-glow">{product.badge}</span>}
                {hasDiscount && <span className="px-2 py-1 rounded-md text-xs font-black bg-destructive text-destructive-foreground">-%{discountPct}</span>}
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {gallery.map((src, i) => (
                  <button key={src + i} onClick={() => setActive(i)} aria-label={`Görsel ${i + 1}`}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${active === i ? "border-primary-glow" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={resolveProductImage(src)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bilgi */}
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <DialogHeader className="text-left space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary-glow">{product.category}</div>
              <DialogTitle className="text-2xl md:text-3xl font-black leading-tight">{product.name}</DialogTitle>
              <DialogDescription className="sr-only">{product.name} ürün ayrıntıları</DialogDescription>
            </DialogHeader>

            <div className="rounded-2xl bg-secondary/40 border border-border/40 p-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-black gradient-text">{formatPrice(product.price)}</span>
                {hasDiscount && <span className="text-base text-muted-foreground line-through">{formatPrice(product.original_price as number)}</span>}
                {hasDiscount && <span className="text-xs font-bold text-destructive">{formatPrice((product.original_price as number) - product.price)} tasarruf</span>}
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="hero" size="lg" asChild>
                  <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> Satın Al</a>
                </Button>
                <Button variant="outline" size="lg" onClick={() => addToCart(product)}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Sepete Ekle
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Satın alma işlemleri Discord sunucumuz üzerinden yapılır.</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {TRUST.map(({ icon: I, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1.5 rounded-xl border border-border/40 py-3 px-2">
                  <I className="h-4 w-4 text-primary-glow" />
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            <Tabs defaultValue="desc">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="desc">Açıklama</TabsTrigger>
                <TabsTrigger value="features">Özellikler</TabsTrigger>
              </TabsList>
              <TabsContent value="desc" className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {paragraphs.length ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : <p>Bu ürün için henüz açıklama eklenmedi.</p>}
              </TabsContent>
              <TabsContent value="features" className="mt-4">
                <ul className="space-y-2.5 text-sm">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-0.5 rounded-full bg-primary/15 p-0.5"><Check className="h-3.5 w-3.5 text-primary-glow" /></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
