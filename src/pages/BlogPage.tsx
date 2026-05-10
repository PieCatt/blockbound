import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ArrowUpRight, Loader2 } from "lucide-react";
import { usePosts, type Post } from "@/hooks/useContent";
import BlogPostDialog from "@/components/BlogPostDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import CartSheet from "@/components/CartSheet";

const BlogList = () => {
  const [selected, setSelected] = useState<Post | null>(null);
  const { data: posts = [], isLoading } = usePosts();

  return (
    <section className="container pt-32 pb-24">
      <div className="mb-10 animate-fade-in-up">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <a href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Anasayfa</a>
        </Button>
        <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
          // Blog
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          Tüm <span className="gradient-text">yazılar</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Minecraft dünyasından haberler, rehberler, topluluk yapımları ve daha fazlası.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary-glow" /></div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <article
            key={post.id}
            onClick={() => setSelected(post)}
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
      )}

      <BlogPostDialog post={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

const BlogPage = () => {
  useEffect(() => {
    document.title = "Blog — Blockbound Studios";
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <BlogList />
        </main>
        <Footer />
        <CartSheet />
      </div>
    </CartProvider>
  );
};

export default BlogPage;
