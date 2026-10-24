import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Headphones, MessageCircle, Play, ShieldCheck, ShoppingCart, Zap } from "lucide-react";
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
    if (!product) return [];
    const images = [product.img, ...(product.images ?? [])]
      .filter((v, i, a) => v && a.indexOf(v) === i)
      .map((src) => ({ type: "image" as const, src }));
    return product.embed_html?.trim()
      ? [{ type: "embed" as const, html: product.embed_html }, ...images]
      : images;
  }, [product]);
  const [active, setActive] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  useEffect(() => {
    setActive(0);
    setDescriptionExpanded(false);
  }, [product?.id]);

  if (!product) return null;

  const features = product.features?.length ? product.features : DEFAULT_PRODUCT_FEATURES;
  const hasDiscount = product.original_price != null && product.original_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / (product.original_price as number)) * 100) : 0;
  const paragraphs = (product.description || "").split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const activeMedia = gallery[active];

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl glass-card border-border/60 p-0 overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="grid md:grid-cols-[1.05fr_1fr]">
          {/* Görseller */}
          <div className="bg-secondary/30 md:border-r border-border/40">
            <div className="relative aspect-square overflow-hidden">
              {activeMedia?.type === "embed" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background [&>iframe]:w-full [&>iframe]:h-full [&>video]:w-full [&>video]:h-full [&>video]:object-contain [&>div]:w-full [&>div]:h-full [&_iframe]:w-full [&_iframe]:h-full [&_video]:w-full [&_video]:h-full"
                  dangerouslySetInnerHTML={{ __html: activeMedia.html }} />
              ) : (
                <img src={resolveProductImage(activeMedia?.src ?? product.img)} alt={product.name} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                {product.badge && <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-primary text-primary-foreground shadow-glow">{product.badge}</span>}
                {hasDiscount && <span className="px-2 py-1 rounded-md text-xs font-black bg-destructive text-destructive-foreground">-%{discountPct}</span>}
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {gallery.map((media, i) => (
                  <Button variant="ghost" size="icon" key={i} onClick={() => setActive(i)}
                    aria-label={media.type === "embed" ? "Video önizlemesi" : `Görsel ${i + 1}`}
                    aria-pressed={active === i}
                    className={`shrink-0 w-16 h-16 p-0 rounded-lg overflow-hidden border-2 transition ${active === i ? "border-primary-glow" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    {media.type === "embed" ? (
                      <span className="w-full h-full flex items-center justify-center bg-secondary text-primary-glow"><Play className="h-6 w-6" /></span>
                    ) : (
                      <img src={resolveProductImage(media.src)} alt="" className="w-full h-full object-cover" />
                    )}
                  </Button>
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
                <div id="product-description" className={descriptionExpanded ? "space-y-3" : "line-clamp-3 space-y-3"}>
                  {paragraphs.length ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : <p>Bu ürün için henüz açıklama eklenmedi.</p>}
                </div>
                {paragraphs.length > 0 && (
                  <Button variant="link" size="sm" className="px-0 text-primary-glow"
                    aria-expanded={descriptionExpanded} aria-controls="product-description"
                    onClick={() => setDescriptionExpanded((expanded) => !expanded)}>
                    {descriptionExpanded ? "Daha az oku" : "Devamını oku"}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${descriptionExpanded ? "rotate-180" : ""}`} />
                  </Button>
                )}
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
