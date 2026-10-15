import { useEffect, useMemo, useState } from "react";
import { BookOpen, Loader2, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { CartProvider } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { useWikiPages } from "@/hooks/useWiki";

const WikiContent = () => {
  const { data: pages = [], isLoading } = useWikiPages();
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLocaleLowerCase("tr");
    if (!s) return pages;
    return pages.filter((p) =>
      (p.title + " " + p.content).toLocaleLowerCase("tr").includes(s),
    );
  }, [pages, q]);

  const sections = useMemo(() => {
    const m = new Map<string, typeof pages>();
    filtered.forEach((p) => m.set(p.section, [...(m.get(p.section) ?? []), p]));
    return Array.from(m.entries());
  }, [filtered]);

  const active = pages.find((p) => p.id === activeId) ?? filtered[0];

  return (
    <section className="container pt-32 pb-24">
      <h1 className="text-4xl md:text-6xl font-black mb-4">
        <span className="gradient-text">Wiki</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Ürünlerimizin kurulum ve kullanım rehberleri.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-glow" /></div>
      ) : pages.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">Henüz wiki sayfası yok.</div>
      ) : (
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Wiki'de ara..." className="pl-9" />
            </div>
            {sections.map(([section, items]) => (
              <div key={section}>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{section}</div>
                <div className="space-y-1">
                  {items.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveId(p.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        active?.id === p.id
                          ? "bg-gradient-primary text-primary-foreground shadow-glow"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {sections.length === 0 && <p className="text-sm text-muted-foreground">Sonuç yok.</p>}
          </aside>

          {active && (
            <article className="glass-card glow-border rounded-2xl p-8 animate-fade-in">
              <div className="flex items-center gap-2 text-xs text-primary-glow font-semibold mb-3">
                <BookOpen className="h-4 w-4" /> {active.section}
              </div>
              <h2 className="text-3xl font-black mb-6">{active.title}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                {active.content}
              </div>
            </article>
          )}
        </div>
      )}
    </section>
  );
};

const WikiPage = () => {
  useEffect(() => { document.title = "Wiki — Blockbound Studios"; }, []);
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main><WikiContent /></main>
        <Footer />
        <CartSheet />
      </div>
    </CartProvider>
  );
};

export default WikiPage;
