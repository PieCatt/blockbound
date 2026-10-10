import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles, Puzzle, Package, Settings2, Zap, ShieldCheck, Headphones, ChevronDown, Star } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { WIKI_URL } from "@/lib/links";

const items = [
  { icon: Puzzle, t: "Pluginler", d: "Özel geliştirilmiş, optimize eklentiler" },
  { icon: Package, t: "Paketler", d: "Kaynak & veri paketleri" },
  { icon: Settings2, t: "Konfigürasyonlar", d: "Kuruluma hazır sunucu ayarları" },
];

const perks = [
  { icon: Zap, t: "Anında teslimat" },
  { icon: ShieldCheck, t: "Güvenli ödeme" },
  { icon: Headphones, t: "7/24 destek" },
];

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 -z-10">
        <img src={heroBg} alt="Minecraft floating islands landscape" className="w-full h-full object-cover opacity-50" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/75 to-background" />
        <div className="absolute inset-0 pixel-grid opacity-40" />
        <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-40 right-0 w-[32rem] h-[32rem] rounded-full bg-accent-purple/20 blur-[120px]" />
      </div>

      <div className="absolute top-1/4 right-[6%] w-16 h-16 bg-gradient-primary rounded-2xl shadow-glow animate-float-slow opacity-70 hidden xl:block" />
      <div className="absolute bottom-1/4 left-[4%] w-12 h-12 bg-accent-purple/80 rounded-xl shadow-purple animate-float opacity-70" style={{ animationDelay: "1s" }} />

      <div className="container relative z-10 grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 mb-7 rounded-full glass-card text-sm">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold">YENİ</span>
            <Sparkles className="h-4 w-4 text-primary-glow" />
            <span className="text-muted-foreground">Yeni sezon ürünleri yayında</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[0.95] mb-6">
            Minecraft <br />
            evrenini <span className="gradient-text text-glow">inşa et</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-9 leading-relaxed">
            Sunucunu kurmak hiç bu kadar kolay olmamıştı. Pluginler, paketler ve konfigürasyonlar, hepsi hazır ve sadece bir tık uzakta.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="xl" asChild className="discover-btn group/btn relative overflow-hidden">
              <a href="#products">
                <span className="relative z-10 inline-flex items-center">
                  Ürünleri Keşfet
                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </span>
                <span className="discover-btn-shine" aria-hidden="true" />
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#blog">Blog'u Oku</a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href={WIKI_URL} target="_blank" rel="noopener noreferrer">
                <BookOpen className="mr-2 h-5 w-5" /> Wiki
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {perks.map(({ icon: Icon, t }) => (
              <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary-glow" /> {t}
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-3 max-w-lg rounded-2xl glass-card divide-x divide-border/50">
            {[
              { n: "10K+", l: "Mutlu Oyuncu" },
              { n: "5+", l: "Eşsiz Ürün" },
              { n: "4.9★", l: "Müşteri Puanı" },
            ].map((s) => (
              <div key={s.l} className="px-4 py-4 text-center">
                <div className="text-2xl md:text-3xl font-black gradient-text">{s.n}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative glass-card glow-border rounded-3xl p-6 shadow-elegant">
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-destructive/70" />
                <span className="w-3 h-3 rounded-full bg-accent-purple/70" />
                <span className="w-3 h-3 rounded-full bg-accent-cyan/70" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">sunucu-kurulumu</span>
            </div>

            <div className="space-y-3">
              {items.map(({ icon: Icon, t, d }, i) => (
                <div key={t} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors animate-fade-in-up" style={{ animationDelay: `${400 + i * 120}ms` }}>
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold">{t}</div>
                    <div className="text-xs text-muted-foreground">{d}</div>
                  </div>
                  <span className="text-xs font-semibold text-primary-glow">Hazır ✓</span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Kurulum</span><span>%100</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full w-full bg-gradient-primary" />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-elegant animate-float">
            <div className="flex">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-primary-glow text-primary-glow" />)}
            </div>
            <span className="text-sm font-bold">4.9 / 5</span>
          </div>
        </div>
      </div>

      <a href="#about" aria-label="Aşağı kaydır" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce">
        <ChevronDown className="h-6 w-6" />
      </a>
    </section>
  );
};

export default Hero;
