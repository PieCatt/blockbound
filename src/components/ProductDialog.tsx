import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { formatPrice, useCart, type Product } from "@/context/CartContext";

type Props = {
  product: Product | null;
  onClose: () => void;
};

const ProductDialog = ({ product, onClose }: Props) => {
  const { addToCart, setCartOpen } = useCart();

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product);
  };

  const handleBuy = () => {
    addToCart(product);
    onClose();
    setCartOpen(true);
  };

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl glass-card border-border/60 p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square bg-secondary/40 overflow-hidden">
            <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-primary text-primary-foreground shadow-glow">
                {product.badge}
              </span>
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
              {["Stokta mevcut", "24 ay garanti", "Orijinal lisanslı ürün"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary-glow" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-3 mt-6 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/40">
                <Truck className="h-4 w-4 text-primary-glow" />
                Ücretsiz kargo
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/40">
                <ShieldCheck className="h-4 w-4 text-primary-glow" />
                14 gün iade
              </div>
            </div>

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
