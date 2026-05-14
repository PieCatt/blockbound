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

const ProductDialog = ({ product, onClose }: Props) => {
  const { addToCart, setCartOpen } = useCart();

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    const extras = (product.images ?? []).filter(Boolean);
    const all = [product.img, ...extras].filter((v, i, a) => v && a.indexOf(v) === i);
    return all;
  }, [product]);

  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [product?.id]);

  if (!product) return null;

  const features = (product.features && product.features.length > 0)
    ? product.features
    : DEFAULT_PRODUCT_FEATURES;

  const handleAdd = () => addToCart(product);
  const handleBuy = () => { addToCart(product); onClose(); setCartOpen(true); };

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
              <img src={gallery[active] ?? product.img} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-primary text-primary-foreground shadow-glow">
                  {product.badge}
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
                    <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-8 flex flex-col">
            <DialogHeader className="text-left space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary-glow">
                {product.category}
              </div>
              <DialogTitle className="text-3xl font-black">{product.name}</DialogTitle>
            </DialogHeader>

            <div className="text-4xl font-black gradient-text mt-4">{formatPrice(product.price)}</div>

            <p className="text-muted-foreground mt-5 leading-relaxed">{product.description}</p>

            <ul className="mt-6 space-y-2 text-sm">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary-glow" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex gap-3 mt-auto pt-6">
              <Button variant="hero" size="lg" className="flex-1" onClick={handleBuy}>
                Hemen Al
              </Button>
              <Button variant="outline" size="lg" onClick={handleAdd}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Sepete Ekle
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
