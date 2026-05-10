import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { toast } from "sonner";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  img: string;
  badge?: string | null;
  description: string;
  is_free?: boolean;
};

type CartItem = Product & { quantity: number };

type CartCtx = {
  items: CartItem[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (p: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) {
        return prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...p, quantity: 1 }];
    });
    toast.success(`${p.name} sepete eklendi!`);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const clear = () => setItems([]);

  const { total, count } = useMemo(() => {
    return {
      total: items.reduce((s, i) => s + i.price * i.quantity, 0),
      count: items.reduce((s, i) => s + i.quantity, 0),
    };
  }, [items]);

  return (
    <Ctx.Provider value={{ items, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clear, total, count }}>
      {children}
    </Ctx.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
