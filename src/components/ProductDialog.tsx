import { resolveProductImage } from "@/lib/productDefaults";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";
import { formatPrice, useCart, type Product } from "@/context/CartContext";
import { DEFAULT_PRODUCT_FEATURES } from "@/lib/productDefaults";

type Props = {
  product: Product | null;
  onClose: () => void;
};

const DESC_LIMIT = 220;

const ProductDialog = ({ product, onClose }: Props) => {
  const { addToCart, setCartOpen } = useCart();

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    const extras = (product.images ?? []).filter(Boolean);
    const all = [product.img, ...extras].filter((v, i, a) => v && a.indexOf(v) === i);
    return all;
  }, [product]);

  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => { setActive(0); setExpanded(false); }, [product?.id]);

  if (!product) return null;

  const features = (product.features && product.features.length > 0)
    ? product.features
    : DEFAULT_PRODUCT_FEATURES;

  const hasDiscount = product.original_price != null && product.original_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / (product.original_price as number)) * 100) : 0;
  const longDesc = (product.description?.length ?? 0) > DESC_LIMIT;
  const shownDesc = !longDesc || expanded ? product.description : `${product.description.slice(0, DESC_LIMIT).trimEnd()}…`;

  const handleAdd = () => addToCart(product);
  const handleBuy = () => { addToCart(product); onClose(); setCartOpen(true); };

  const FeaturesList = () => (
    <ul className="space-y-2 text-sm">
      {features.map((f) => (
        <li key={f} className="flex items-center gap-2 text-muted-foreground">
          <Check className="h-4 w-4 text-primary-glow" />
          {f}
        </li>
      ))}
    </ul>
  );

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl glass-card border-border/60 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-2">
          <div className="bg-secondary/40">
            {product.embed_html && (
              <div
                className="w-full aspect-video bg-black [&_iframe]:w-full [&_iframe]:h-full [&_video]:w-full [&_video]:h-full"
                dangerouslySetInnerHTML={{ __html: product.embed_html }}
              />
            )}
            <div className="relative aspect-square overflow-hidden">
              <img src={resolveProductImage(gallery[active] ?? product.img)} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-primary text-primary-foreground shadow-glow">
                  {product.badge}
                </span>
              )}
              {hasDiscount && (
                <span className="absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-black bg-rose-500 text-rose-50 shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                  -%{discountPct}
                </span>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActive(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      active === i ? "border-primary-glow" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={resolveProductImage(src)} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative p-6 md:p-8 pb-28 flex flex-col">
            <DialogHeader className="text-left space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary-glow">
                {product.category}
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-black">{product.name}</DialogTitle>
            </DialogHeader>

            <div className="mt-3 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl font-black gradient-text">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="text-base text-muted-foreground line-through">{formatPrice(product.original_price as number)}</span>
              )}
            </div>

            {/* Collapsed: features üstte, açıklama altta. Expanded: açıklama tam, features altta. */}
            {!expanded && (
              <div className="mt-5">
                <FeaturesList />
              </div>
            )}

            <p className="text-muted-foreground mt-5 leading-relaxed">
              {shownDesc}
              {longDesc && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="ml-1 text-primary-glow font-semibold hover:underline"
                >
                  {expanded ? "Daha az oku" : "Devamını oku"}
                </button>
              )}
            </p>

            {expanded && (
              <div className="mt-5">
                <FeaturesList />
              </div>
            )}

            {/* CTA — sağ altta sticky */}
            <div className="sticky bottom-0 left-0 right-0 mt-6 -mx-6 md:-mx-8 px-6 md:px-8 py-4 bg-gradient-to-t from-background via-background/95 to-transparent">
              <div className="flex gap-3 justify-end">
                <Button variant="outline" size="lg" onClick={handleAdd}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Sepete Ekle
                </Button>
                <Button variant="hero" size="lg" onClick={handleBuy}>
                  Hemen Al
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
