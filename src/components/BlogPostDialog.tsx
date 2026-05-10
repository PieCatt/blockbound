import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock } from "lucide-react";
import type { Post } from "@/hooks/useContent";

type Props = {
  post: Post | null;
  onClose: () => void;
};

const BlogPostDialog = ({ post, onClose }: Props) => {
  if (!post) return null;

  return (
    <Dialog open={!!post} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl glass-card border-border/60 p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className={`relative h-48 md:h-64 bg-gradient-to-br ${post.gradient} shrink-0`}>
          <div className="absolute inset-0 pixel-grid opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-primary rounded-2xl shadow-glow animate-float" />
          </div>
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-background/80 backdrop-blur-md">
            {post.category}
          </span>
        </div>

        <div className="overflow-y-auto p-8">
          <DialogHeader className="text-left">
            <DialogTitle className="text-3xl md:text-4xl font-black leading-tight">
              {post.title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 mb-6">
            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {post.read_time}</span>
          </div>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {post.content.map((p, i) => (
              <p key={i} className={i === 0 ? "text-foreground text-lg" : ""}>{p}</p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostDialog;
