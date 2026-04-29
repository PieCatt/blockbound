import { ArrowUpRight, Calendar } from "lucide-react";

const posts = [
  {
    title: "1.21 güncellemesi: Tüm yenilikler ve sırlar",
    excerpt: "Trial Chambers, Breeze ve daha fazlası... Yeni sürümün getirdiği her şey.",
    date: "12 Mart 2026",
    category: "Güncelleme",
    gradient: "from-primary/40 to-accent-purple/40",
  },
  {
    title: "En iyi 10 redstone tasarımı",
    excerpt: "Topluluğun paylaştığı en yaratıcı redstone makinelerinin derlemesi.",
    date: "5 Mart 2026",
    category: "Rehber",
    gradient: "from-accent-cyan/40 to-primary/40",
  },
  {
    title: "Speedrun rekorları nasıl kırılıyor?",
    excerpt: "Dünya çapındaki speedrun camiasının teknikleri ve ipuçları.",
    date: "28 Şubat 2026",
    category: "Esports",
    gradient: "from-accent-purple/40 to-accent-cyan/40",
  },
];

const Blog = () => {
  return (
    <section id="blog" className="relative py-24 md:py-32">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
              // Blog
            </div>
            <h2 className="text-4xl md:text-6xl font-black">
              Son <span className="gradient-text">yazılar</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Minecraft dünyasından haberler, rehberler, topluluk yapımları ve daha fazlası.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <article
              key={post.title}
              className="group glass-card glow-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${post.gradient} overflow-hidden`}>
                <div className="absolute inset-0 pixel-grid opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-2xl shadow-glow animate-float opacity-90 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-background/80 backdrop-blur-md">
                  {post.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary-glow">
                  Devamını oku
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
