import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ayşe K.",
    role: "Koleksiyoner",
    rating: 5,
    text: "Figürlerin işçiliği inanılmaz. Kutu açılışı bile başlı başına bir deneyim, kalitesinden çok memnun kaldım.",
  },
  {
    name: "Mert D.",
    role: "Server Sahibi",
    rating: 5,
    text: "Dijital içerikler tam istediğim gibi hazırlanmış. Topluluğumdan çok olumlu geri dönüş aldım.",
  },
  {
    name: "Selin Y.",
    role: "Content Creator",
    rating: 5,
    text: "Hızlı kargo, premium ambalaj ve müthiş tasarım. Blockbound artık benim go-to mağazam.",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-12 md:py-16">
      <div className="container">
        <div className="max-w-2xl mb-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            Kullanıcı <span className="gradient-text">yorumları</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Topluluğumuzun Blockbound deneyimi hakkında söyledikleri.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <article
              key={t.name}
              className="glass-card glow-border rounded-2xl p-6 animate-fade-in-up hover:-translate-y-1 transition-transform duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary-glow text-primary-glow" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center font-black text-primary-foreground">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
