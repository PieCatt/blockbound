import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { WIKI_URL } from "@/lib/links";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[80vh] flex items-center overflow-hidden pt-24 pb-10">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBg}
          alt="Minecraft floating islands landscape"
          className="w-full h-full object-cover opacity-60"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        <div className="absolute inset-0 pixel-grid opacity-40" />
      </div>

      {/* Floating blocks decoration */}
      <div className="absolute top-1/4 right-[10%] w-20 h-20 bg-gradient-primary rounded-2xl shadow-glow animate-float-slow opacity-80" />
      <div className="absolute bottom-1/3 left-[8%] w-14 h-14 bg-accent-purple/80 rounded-xl shadow-purple animate-float opacity-80" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-[20%] w-10 h-10 bg-accent-cyan/70 rounded-lg animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10">
        <div className="max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-card text-sm">
            <Sparkles className="h-4 w-4 text-primary-glow" />
            <span className="text-muted-foreground">Yeni sezon ürünleri yayında</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6">
            Minecraft <br />
            evrenini <span className="gradient-text text-glow">inşa et</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
            Premium Minecraft koleksiyonu, sınırlı sayıda merch ve özel tasarım dijital ürünler. Blockbound Studios — blok blok yaratıcılığın peşinde.
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

          <div className="mt-16 flex flex-wrap gap-8 md:gap-12">
            {[
              { n: "120K+", l: "Mutlu Oyuncu" },
              { n: "350+", l: "Eşsiz Ürün" },
              { n: "4.9★", l: "Müşteri Puanı" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl md:text-4xl font-black gradient-text">{s.n}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
