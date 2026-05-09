import { Github, Instagram, Twitter, Youtube } from "lucide-react";

const socials = [
  { name: "Instagram", icon: Instagram, handle: "@blockbound", href: "#", color: "from-pink-500 to-purple-500" },
  { name: "YouTube", icon: Youtube, handle: "/blockboundstudios", href: "#", color: "from-red-500 to-orange-500" },
  { name: "Twitter", icon: Twitter, handle: "@blockbound", href: "#", color: "from-sky-500 to-blue-500" },
  { name: "GitHub", icon: Github, handle: "/blockbound", href: "#", color: "from-zinc-400 to-zinc-600" },
];

const Social = () => {
  return (
    <section id="social" className="relative py-24 md:py-32">
      <div className="container">
        <div className="max-w-2xl mb-16 animate-fade-in-up">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
            // Sosyal
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            Bize <span className="gradient-text">katıl</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Yeni ürünler, kulis içerikleri ve canlı yayınlar için sosyal kanallarımızı takip et.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {socials.map((s, i) => (
            <a
              key={s.name}
              href={s.href}
              className="group glass-card glow-border rounded-2xl p-6 flex flex-col items-start gap-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-500`}
              >
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">{s.name}</div>
                <div className="text-sm text-muted-foreground">{s.handle}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Social;
