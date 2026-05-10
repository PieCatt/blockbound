import { useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { usePosts } from "@/hooks/useContent";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminPostsList = () => {
  const { data: posts = [], isLoading } = usePosts();
  const qc = useQueryClient();

  useEffect(() => { document.title = "Blog Yazıları — Admin"; }, []);

  const remove = async (id: string, title: string) => {
    if (!confirm(`"${title}" yazısını silmek istediğine emin misin?`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Yazı silindi");
    qc.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Blog Yazıları</h1>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} yazı</p>
        </div>
        <Button variant="hero" asChild>
          <Link to="/admin/posts/new"><Plus className="h-4 w-4 mr-2" /> Yeni Yazı</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : posts.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
          Henüz yazı yok. "Yeni Yazı" butonuyla ilk yazını ekle.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-primary-glow font-semibold mb-1">{p.category}</div>
                <div className="font-bold truncate">{p.title}</div>
                <div className="text-xs text-muted-foreground truncate">{p.excerpt}</div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/admin/posts/${p.id}`}><Pencil className="h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => remove(p.id, p.title)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPostsList;
