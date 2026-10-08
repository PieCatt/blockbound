import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Eye, LayoutGrid, List, Loader2, PackageSearch, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/hooks/useContent";
import { CartProvider, formatPrice, useCart, type Product } from "@/context/CartContext";
import { getTag, PRODUCT_TAGS } from "@/lib/productTags";
import ProductDialog from "@/components/ProductDialog";
import ProductImage from "@/components/ProductImage";
import CartSheet from "@/components/CartSheet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Sort = "featured" | "new" | "price-asc" | "price-desc" | "discount" | "name";

const hasDisc = (p: Product) => p.original_price != null && p.original_price > p.price;
const discPct = (p: Product) => (hasDisc(p) ? Math.round((1 - p.price / (p.original_price as number)) * 100) : 0);

type Filters = {
  cats: string[]; setCats: (v: string[]) => void;
  tags: string[]; setTags: (v: string[]) => void;
  onlyDisc: boolean; setOnlyDisc: (v: boolean) => void;
  min: string; setMin: (v: string) => void;
  max: string; setMax: (v: string) => void;
  catCounts: [string, number][];
  reset: () => void;
};

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

const FilterPanel = (f: Filters) => (
  <div className="space-y-7">
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Kategori</h3>
      <div className="space-y-1">
        {f.catCounts.map(([c, n]) => (
          <label key={c} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-secondary/50 text-sm">
            <span className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary h-4 w-4" checked={f.cats.includes(c)} onChange={() => f.setCats(toggle(f.cats, c))} />
              {c}
            </span>
            <span className="text-xs text-muted-foreground">{n}</span>
          </label>
        ))}
      </div>
    </div>
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Fiyat (TL)</h3>
      <div className="flex items-center gap-2">
        <Input type="number" min={0} placeholder="En az" value={f.min} onChange={(e) => f.setMin(e.target.value)} />
        <span className="text-muted-foreground">–</span>
        <Input type="number" min={0} placeholder="En çok" value={f.max} onChange={(e) => f.setMax(e.target.value)} />
      </div>
    </div>
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Etiket</h3>
      <div className="flex flex-wrap gap-2">
        {PRODUCT_TAGS.map((t) => (
          <button key={t.value} onClick={() => f.setTags(toggle(f.tags, t.value))}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${f.tags.includes(t.value) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 mt-4 text-sm cursor-pointer">
        <input type="checkbox" className="accent-primary h-4 w-4" checked={f.onlyDisc} onChange={(e) => f.setOnlyDisc(e.target.checked)} />
        Sadece indirimdekiler
      </label>
    </div>
    <Button variant="outline" size="sm" className="w-full" onClick={f.reset}>Filtreleri temizle</Button>
  </div>
);

const Catalog = () => {
  const [selected, setSelected] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { data: products = [], isLoading } = useProducts();
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [onlyDisc, setOnlyDisc] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [picked, setPicked] = useState<string | null>(null);

  const catCounts = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0], "tr"));
  }, [products]);

  const reset = () => { setQ(""); setCats([]); setTags([]); setOnlyDisc(false); setMin(""); setMax(""); };

  const filtered = useMemo(() => {
    const s = q.trim().toLocaleLowerCase("tr");
    const lo = min === "" ? -Infinity : Number(min);
    const hi = max === "" ? Infinity : Number(max);
    const list = products.filter((p) =>
      (!s || `${p.name} ${p.description} ${p.category}`.toLocaleLowerCase("tr").includes(s)) &&
      (cats.length === 0 || cats.includes(p.category)) &&
      (tags.length === 0 || (p.badge && tags.includes(p.badge))) &&
      (!onlyDisc || hasDisc(p)) &&
      p.price >= lo && p.price <= hi,
    );
    const idx = new Map(products.map((p, i) => [p.id, i]));
    const pr = (p: Product) => getTag(p.badge)?.priority ?? (hasDisc(p) ? 10 : 0);
    return [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "discount": return discPct(b) - discPct(a);
        case "name": return a.name.localeCompare(b.name, "tr");
        case "new": return idx.get(a.id)! - idx.get(b.id)!;
        default: return pr(b) - pr(a) || idx.get(a.id)! - idx.get(b.id)!;
      }
    });
  }, [products, q, cats, tags, onlyDisc, min, max, sort]);

  const filters: Filters = { cats, setCats, tags, setTags, onlyDisc, setOnlyDisc, min, setMin, max, setMax, catCounts, reset };
  const activeChips = [
    ...cats.map((c) => ({ label: c, clear: () => setCats(cats.filter((x) => x !== c)) })),
    ...tags.map((t) => ({ label: t, clear: () => setTags(tags.filter((x) => x !== t)) })),
    ...(onlyDisc ? [{ label: "İndirimde", clear: () => setOnlyDisc(false) }] : []),
    ...(min || max ? [{ label: `${min || 0} – ${max || "∞"} TL`, clear: () => { setMin(""); setMax(""); } }] : []),
  ];

  const pick = (c: string | null) => { reset(); setCats(c ? [c] : []); setPicked(c ?? "__all"); window.scrollTo({ top: 0 }); };

  if (picked === null) {
    const cards: { key: string | null; label: string; n: number }[] = [
      ...catCounts.map(([c, n]) => ({ key: c, label: c, n })),
      { key: null, label: "Tüm Ürünler", n: products.length },
    ];
    return (
      <section className="container pt-28 pb-16">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="breadcrumb">
          <a href="/" className="hover:text-foreground">Anasayfa</a> <span className="mx-2">/</span> <span className="text-foreground">Ürünler</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-black mb-2">Bir <span className="gradient-text">kategori</span> seç</h1>
        <p className="text-muted-foreground mb-10">Göz atmak istediğin kategoriyi seç.</p>
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-glow" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((c) => (
              <button key={c.label} onClick={() => pick(c.key)}
                className={`group text-left glass-card glow-border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant ${c.key === null ? "bg-gradient-primary/10 border border-primary/40" : ""}`}>
                <div className="relative h-28 mb-5 rounded-xl overflow-hidden bg-secondary/40">
                  <div className="absolute inset-0 pixel-grid opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-gradient-primary rounded-xl shadow-glow group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:gradient-text">{c.label}</h3>
                <p className="text-sm text-muted-foreground">{c.n} ürün</p>
              </button>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="container pt-28 pb-16">
      <nav className="text-sm text-muted-foreground mb-4" aria-label="breadcrumb">
        <a href="/" className="hover:text-foreground">Anasayfa</a> <span className="mx-2">/</span>
        <button onClick={() => setPicked(null)} className="hover:text-foreground">Ürünler</button> <span className="mx-2">/</span>
        <span className="text-foreground">{picked === "__all" ? "Tüm Ürünler" : picked}</span>
      </nav>
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setPicked(null)}>← Kategorilere dön</Button>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">{picked === "__all" ? <>Tüm <span className="gradient-text">Ürünler</span></> : <span className="gradient-text">{picked}</span>}</h1>
          <p className="text-muted-foreground">Premium fiziksel ürünlerden dijital içeriklere kadar tüm Blockbound koleksiyonu.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ürün ara..." className="pl-9" aria-label="Ürün ara" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 glass-card rounded-2xl p-5"><FilterPanel {...filters} /></div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden"><SlidersHorizontal className="h-4 w-4 mr-2" /> Filtrele</Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto">
                  <SheetHeader className="mb-6"><SheetTitle>Filtreler</SheetTitle></SheetHeader>
                  <FilterPanel {...filters} />
                </SheetContent>
              </Sheet>
              <span className="text-sm text-muted-foreground">{filtered.length} ürün</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                <SelectTrigger className="w-48 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Öne çıkanlar</SelectItem>
                  <SelectItem value="new">En yeniler</SelectItem>
                  <SelectItem value="price-asc">Fiyat: düşükten yükseğe</SelectItem>
                  <SelectItem value="price-desc">Fiyat: yüksekten düşüğe</SelectItem>
                  <SelectItem value="discount">En yüksek indirim</SelectItem>
                  <SelectItem value="name">İsim (A–Z)</SelectItem>
                </SelectContent>
              </Select>
              <div className="hidden sm:flex rounded-lg border border-border p-0.5">
                <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" aria-label="Izgara görünümü" onClick={() => setView("grid")}><LayoutGrid className="h-4 w-4" /></Button>
                <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" aria-label="Liste görünümü" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeChips.map((c) => (
                <button key={c.label} onClick={c.clear} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-secondary hover:bg-secondary/70">
                  {c.label} <X className="h-3 w-3" />
                </button>
              ))}
              <button onClick={reset} className="text-xs text-primary-glow hover:underline px-2">Tümünü temizle</button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-glow" /></div>
          ) : filtered.length === 0 ? (
            <div className="glass-card rounded-2xl py-16 text-center">
              <PackageSearch className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="font-semibold mb-1">Aramana uygun ürün bulunamadı</p>
              <p className="text-sm text-muted-foreground mb-5">Filtreleri değiştirmeyi veya temizlemeyi dene.</p>
              <Button variant="outline" size="sm" onClick={reset}>Filtreleri temizle</Button>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
              {filtered.map((p) => {
                const d = hasDisc(p);
                const badge = p.badge || (d ? "İndirim" : null);
                const tag = getTag(badge);
                const list = view === "list";
                return (
                  <article key={p.id}
                    className={`group relative glass-card glow-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant flex ${list ? "flex-row" : "flex-col"} ${tag?.cardClass ?? ""}`}
                    style={tag ? { ["--tag-color" as any]: tag.borderColor } : undefined}>
                    <button onClick={() => setSelected(p)} aria-label={`${p.name} detayları`}
                      className={`relative overflow-hidden bg-secondary/40 shrink-0 ${list ? "w-36 sm:w-48 aspect-square" : "aspect-square w-full"}`}>
                      <ProductImage src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        {badge && <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${tag?.badgeClass ?? "bg-gradient-primary text-primary-foreground"}`}>{badge}</span>}
                        {d && <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-destructive text-destructive-foreground">-%{discPct(p)}</span>}
                      </div>
                    </button>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-primary-glow mb-1">{p.category}</div>
                      <h3 className="text-lg font-bold mb-1 cursor-pointer hover:text-primary-glow" onClick={() => setSelected(p)}>{p.name}</h3>
                      <p className={`text-sm text-muted-foreground mb-4 ${list ? "line-clamp-3" : "line-clamp-2"}`}>{p.description}</p>
                      <div className="mt-auto flex items-end justify-between gap-2">
                        <div>
                          {d && <div className="text-xs text-muted-foreground line-through">{formatPrice(p.original_price as number)}</div>}
                          <div className="text-xl font-black gradient-text">{formatPrice(p.price)}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Ürünü incele" onClick={() => setSelected(p)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="hero" size="sm" onClick={() => addToCart(p)}><ShoppingCart className="h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">Sepete Ekle</span></Button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

const ProductsPage = () => {
  useEffect(() => {
    document.title = "Tüm Koleksiyon — Blockbound Studios";
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Catalog />
        </main>
        <Footer />
        <CartSheet />
      </div>
    </CartProvider>
  );
};

export default ProductsPage;
