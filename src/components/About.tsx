import { Blocks, Globe2, Sparkles, Users } from "lucide-react";

const stats = [
  { icon: Users, label: "Topluluk", value: "10K+" },
  { icon: Blocks, label: "Tasarım", value: "5+" },
  { icon: Globe2, label: "Ülke", value: "40+" },
  { icon: Sparkles, label: "Yıl Deneyim", value: "6+" },
];

const About = () => {
  return (
    <section id="about" className="relative py-12 md:py-16">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              <span className="gradient-text">Hayal et</span>, biz inşa edelim
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Kozma Network Minecraft sunucusunun kurucularını bünyesinde barındıran BlockBound Studios, 5 yıllık deneyime sahip profesyonel ekibi ile siz değerli oyunculara en kaliteli hizmeti sunmayı hedeflemektedir. Bu bağlamda, sunucu sahiplerinin ve oyuncuların deneyimini en üst seviyeye taşımak için kapsamlı çözümler sunuyoruz.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Ekip olarak, sunucunuzun konfigürasyonlarını optimize etmek, hazır eklenti paketleri ve pluginler ile sunucunuzu güçlendirmek, ayrıca özelleştirilmiş tasarımlar ve görsel içeriklerle sunucunuzu eşsiz kılmak için çalışıyoruz.
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
