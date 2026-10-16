import { useEffect, useMemo, useState } from "react";
import { BookOpen, Clock, Loader2, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { CartProvider } from "@/context/CartContext";
import WikiSearch from "@/components/wiki/WikiSearch";
import { WikiArticleBody, extractHeadings, readingTime } from "@/lib/wikiContent";
import { useWikiPages } from "@/hooks/useWiki";

const WikiContent = () => {
  const { data: pages = [], isLoading } = useWikiPages();
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tocActive, setTocActive] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("wiki-article");
      if (!el) { setProgress(0); return; }
      const start = el.offsetTop - 120;
      const total = el.offsetHeight - window.innerHeight + 240;
      const p = total > 0 ? Math.min(1, Math.max(0, (window.scrollY - start) / total)) : 0;
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeId, pages]);

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
  const headings = useMemo(() => (active ? extractHeadings(active.content) : []), [active]);

  useEffect(() => {
    if (headings.length === 0) { setTocActive(null); return; }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => { if (en.isIntersecting) setTocActive(en.target.id); });
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headings]);

  const goToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="container pt-32 pb-24">
      {/* Okuma ilerleme çubuğu */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-primary transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <WikiSearch open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelect={(id) => setActiveId(id)} />

      {/* Buzlu cam başlık çubuğu */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-8 bg-background/70 backdrop-blur-xl border-b border-border/40 flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-4xl font-black">
          <span className="gradient-text">Wiki</span>
        </h1>
      </div>

      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Ürünlerimizin kurulum ve kullanım rehberleri.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-glow" /></div>
      ) : pages.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">Henüz wiki sayfası yok.</div>
      ) : (
        <div className="grid lg:grid-cols-[260px_1fr_200px] gap-8">
          {/* Sol: sayfa listesi (buzlu cam) */}
          <aside className="space-y-6 lg:sticky lg:top-36 self-start rounded-2xl p-4 bg-background/40 backdrop-blur-xl border border-border/40">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Wiki'de ara..."
                className="w-full rounded-md border border-border/60 bg-background/60 pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary-glow"
              />
            </div>
            {sections.map(([section, items]) => (
              <div key={section}>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{section}</div>
                <div className="space-y-1">
                  {items.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setActiveId(p.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
            <article id="wiki-article" className="glass-card glow-border rounded-2xl p-8 animate-fade-in min-w-0">
              <div className="flex flex-wrap items-center gap-3 text-xs text-primary-glow font-semibold mb-3">
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {active.section}</span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {readingTime(active.content)} dk okuma süresi
                </span>
              </div>
              <h2 className="text-3xl font-black mb-6">{active.title}</h2>
              <WikiArticleBody content={active.content} pages={pages} onNavigate={(id) => { setActiveId(id); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
            </article>
          )}

          {/* Sağ: dinamik içindekiler */}
          {headings.length > 0 && (
            <aside className="hidden xl:block self-start sticky top-36 rounded-2xl p-4 bg-background/40 backdrop-blur-xl border border-border/40">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">İçindekiler</div>
              <div className="space-y-1">
                {headings.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => goToHeading(h.id)}
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-md border-l-2 transition-colors ${
                      tocActive === h.id
                        ? "border-primary-glow text-foreground bg-secondary/50"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                    }`}
                  >
                    {h.text}
                  </button>
                ))}
              </div>
            </aside>
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
