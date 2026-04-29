import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice, useCart } from "@/context/CartContext";
import { toast } from "sonner";

const CartSheet = () => {
  const { items, cartOpen, setCartOpen, updateQty, removeFromCart, total, clear } = useCart();

  const checkout = () => {
    toast.success("Ödeme sayfasına yönlendiriliyorsun! (demo)");
    clear();
    setCartOpen(false);
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="glass-card border-border/60 w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5 text-primary-glow" />
            Sepetin
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-primary/20 flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-primary-glow" />
            </div>
            <h3 className="font-bold text-lg mb-2">Sepetin boş</h3>
            <p className="text-sm text-muted-foreground mb-6">Hadi birkaç efsanevi parça ekleyelim!</p>
            <Button variant="hero" onClick={() => setCartOpen(false)}>Alışverişe Başla</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-secondary/40 animate-fade-in">
                  <img src={item.img} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-primary-glow font-semibold uppercase">{item.category}</div>
                    <div className="font-semibold truncate">{item.name}</div>
                    <div className="text-sm gradient-text font-black mt-1">{formatPrice(item.price)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="h-7 w-7 rounded-md bg-background/60 hover:bg-secondary flex items-center justify-center"
                        aria-label="Azalt"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="h-7 w-7 rounded-md bg-background/60 hover:bg-secondary flex items-center justify-center"
                        aria-label="Artır"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto h-7 w-7 rounded-md text-muted-foreground hover:text-destructive flex items-center justify-center"
                        aria-label="Kaldır"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border/50 space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Ara Toplam</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Kargo</span>
                <span className="text-primary-glow">Ücretsiz</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-border/50">
                <span>Toplam</span>
                <span className="gradient-text">{formatPrice(total)}</span>
              </div>
              <Button variant="hero" size="lg" className="w-full" onClick={checkout}>
                Ödemeye Geç
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
