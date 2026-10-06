import { useState } from "react";
import { ArrowUpRight, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePosts, type Post } from "@/hooks/useContent";
import BlogPostDialog from "./BlogPostDialog";

const Blog = () => {
  const [selected, setSelected] = useState<Post | null>(null);
  const { data: posts = [], isLoading } = usePosts();

  const visible = posts.slice(0, 3);

  return (
    <section id="blog" className="relative py-12 md:py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-black">
              Son <span className="gradient-text">yazılar</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Minecraft dünyasından haberler, rehberler, topluluk yapımları ve daha fazlası.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-glow" /></div>
        ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {visible.map((post, i) => (
            <article
              key={post.id}
              className="group glass-card glow-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 animate-fade-in-up flex flex-col"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                onClick={() => setSelected(post)}
                className={`relative aspect-[16/10] bg-gradient-to-br ${post.gradient} overflow-hidden cursor-pointer`}
              >
                <div className="absolute inset-0 pixel-grid opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-2xl shadow-glow animate-float opacity-90 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-background/80 backdrop-blur-md">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all cursor-pointer" onClick={() => setSelected(post)}>
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <Button variant="hero" size="sm" onClick={() => setSelected(post)}>
                    Devamını oku
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
        )}
      </div>

      <BlogPostDialog post={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default Blog;
