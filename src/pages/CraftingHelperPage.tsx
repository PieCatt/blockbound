import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { CartProvider } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type Recipe = {
  id: string;
  name: string;
  category: string;
  grid: (string | null)[]; // 9 cells
  output: number;
  materials: Record<string, number>;
};

const RECIPES: Recipe[] = [
  {
    id: "crafting-table",
    name: "Crafting Table",
    category: "Temel",
    grid: ["Planks", "Planks", null, "Planks", "Planks", null, null, null, null],
    output: 1,
    materials: { Planks: 4 },
  },
  {
    id: "furnace",
    name: "Furnace",
    category: "Temel",
    grid: ["Cobblestone", "Cobblestone", "Cobblestone", "Cobblestone", null, "Cobblestone", "Cobblestone", "Cobblestone", "Cobblestone"],
    output: 1,
    materials: { Cobblestone: 8 },
  },
  {
    id: "chest",
    name: "Chest",
    category: "Depolama",
    grid: ["Planks", "Planks", "Planks", "Planks", null, "Planks", "Planks", "Planks", "Planks"],
    output: 1,
    materials: { Planks: 8 },
  },
  {
    id: "torch",
    name: "Torch",
    category: "Aydınlatma",
    grid: [null, null, null, null, "Coal", null, null, "Stick", null],
    output: 4,
    materials: { Coal: 1, Stick: 1 },
  },
  {
    id: "stick",
    name: "Stick",
    category: "Temel",
    grid: [null, null, null, null, "Planks", null, null, "Planks", null],
    output: 4,
    materials: { Planks: 2 },
  },
  {
    id: "iron-pickaxe",
    name: "Iron Pickaxe",
    category: "Alet",
    grid: ["Iron Ingot", "Iron Ingot", "Iron Ingot", null, "Stick", null, null, "Stick", null],
    output: 1,
    materials: { "Iron Ingot": 3, Stick: 2 },
  },
  {
    id: "diamond-sword",
    name: "Diamond Sword",
    category: "Silah",
    grid: [null, "Diamond", null, null, "Diamond", null, null, "Stick", null],
    output: 1,
    materials: { Diamond: 2, Stick: 1 },
  },
  {
    id: "shield",
    name: "Shield",
    category: "Savunma",
    grid: ["Planks", "Iron Ingot", "Planks", "Planks", "Planks", "Planks", null, "Planks", null],
    output: 1,
    materials: { Planks: 6, "Iron Ingot": 1 },
  },
  {
    id: "bow",
    name: "Bow",
    category: "Silah",
    grid: [null, "Stick", "String", "Stick", null, "String", null, "Stick", "String"],
    output: 1,
    materials: { Stick: 3, String: 3 },
  },
  {
    id: "bookshelf",
    name: "Bookshelf",
    category: "Dekor",
    grid: ["Planks", "Planks", "Planks", "Book", "Book", "Book", "Planks", "Planks", "Planks"],
    output: 1,
    materials: { Planks: 6, Book: 3 },
  },
];

const matColor: Record<string, string> = {
  Planks: "#A0784A",
  Cobblestone: "#7C7C7C",
  Stick: "#C8A368",
  Coal: "#1F1F1F",
  "Iron Ingot": "#DCDCDC",
  Diamond: "#5DECE9",
  String: "#EEE8C4",
  Book: "#C9A059",
};

const CraftingHelperPage = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Recipe>(RECIPES[0]);
  const [count, setCount] = useState(1);

  useEffect(() => {
    document.title = "Crafting Yardımcısı — Blockbound Studios";
  }, []);

  const filtered = useMemo(
    () =>
      RECIPES.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const totals = useMemo(() => {
    const batches = Math.ceil((count || 1) / selected.output);
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(selected.materials)) out[k] = v * batches;
    return { batches, items: out };
  }, [selected, count]);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-32 pb-16 min-h-[60vh]">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
            // Araçlar
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3">
            Crafting <span className="gradient-text">Yardımcısı</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-10">
            Tarifi seç, kaç adet üretmek istediğini yaz, tam malzeme listesini al.
          </p>

          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            <div className="glass-card rounded-2xl p-4 space-y-3 h-fit">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tarif ara..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="max-h-[500px] overflow-y-auto space-y-1">
                {filtered.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selected.id === r.id
                        ? "bg-gradient-primary text-primary-foreground"
                        : "hover:bg-secondary/60"
                    }`}
                  >
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs opacity-70">{r.category}</div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="text-sm text-muted-foreground px-3 py-6 text-center">
                    Sonuç yok
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">
                      {selected.category}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black">{selected.name}</h2>
                    <div className="text-sm text-muted-foreground mt-1">
                      Tarif başına {selected.output} adet üretir
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Adet</label>
                    <Input
                      type="number"
                      min={1}
                      value={count}
                      onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 max-w-xs">
                  {selected.grid.map((cell, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg border border-border/60 flex items-center justify-center text-[10px] font-bold text-center p-1"
                      style={{
                        background: cell ? matColor[cell] ?? "#444" : "rgba(255,255,255,0.03)",
                        color: cell ? "#fff" : undefined,
                        textShadow: cell ? "0 1px 2px rgba(0,0,0,0.6)" : undefined,
                      }}
                    >
                      {cell ?? ""}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Toplam Malzeme ({totals.batches} tarif)
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(totals.items).map(([name, qty]) => (
                    <div key={name} className="flex items-center gap-3 glass-card rounded-lg p-3">
                      <div
                        className="h-10 w-10 rounded-md border border-border/60 shrink-0"
                        style={{ background: matColor[name] ?? "#444" }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{name}</div>
                        <div className="text-xs text-muted-foreground">×{qty}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  Üretilen: <span className="text-foreground font-bold">{totals.batches * selected.output}</span> adet {selected.name}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <CartSheet />
      </div>
    </CartProvider>
  );
};

export default CraftingHelperPage;
