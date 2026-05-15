import { Blocks, Globe2, Sparkles, Users } from "lucide-react";

const stats = [
  { icon: Users, label: "Topluluk", value: "120K+" },
  { icon: Blocks, label: "Tasarım", value: "350+" },
  { icon: Globe2, label: "Ülke", value: "40+" },
  { icon: Sparkles, label: "Yıl Deneyim", value: "8+" },
];

const About = () => {
  return (
    <section id="about" className="relative py-12 md:py-16">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="animate-fade-in-up">
            <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
              // Hakkımızda
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              <span className="gradient-text">Hayal et</span>, biz inşa edelim
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Blockbound Studios; Minecraft topluluğu için premium koleksiyon parçaları, sınırlı seri merch ve özgün dijital içerikler üreten bağımsız bir tasarım stüdyosudur. Her ürünümüz, oyunseverlerin tutkusunu fiziksel ve dijital dünyada yansıtmak için titizlikle tasarlanır.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              2018'den beri sanatçılar, modelciler ve mühendislerden oluşan ekibimizle topluluğumuza ilham veren yüzlerce ürün hayata geçirdik. Hedefimiz: kaliteyi, yaratıcılığı ve oyun kültürünü tek çatı altında buluşturmak.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="glass-card glow-border rounded-2xl p-6 animate-fade-in-up hover:-translate-y-1 transition-transform duration-500"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="text-3xl font-black gradient-text mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
