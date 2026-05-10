import { useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { FileText, Package, Plus } from "lucide-react";
import { usePosts, useAllProducts } from "@/hooks/useContent";

const AdminDashboard = () => {
  const { data: posts = [] } = usePosts();
  const { data: products = [] } = useAllProducts();

  useEffect(() => { document.title = "Admin Paneli — Blockbound"; }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black mb-2">Hoş geldin</h1>
      <p className="text-muted-foreground mb-8">Buradan blog yazıları ve ürünleri yönetebilirsin.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card glow-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-black">{posts.length}</div>
                <div className="text-xs text-muted-foreground">Blog yazısı</div>
              </div>
            </div>
            <Button size="sm" variant="hero" asChild>
              <Link to="/admin/posts/new"><Plus className="h-4 w-4 mr-1" /> Yeni</Link>
            </Button>
          </div>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/admin/posts">Tümünü yönet</Link>
          </Button>
        </div>

        <div className="glass-card glow-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-black">{products.length}</div>
                <div className="text-xs text-muted-foreground">Ürün</div>
              </div>
            </div>
            <Button size="sm" variant="hero" asChild>
              <Link to="/admin/products/new"><Plus className="h-4 w-4 mr-1" /> Yeni</Link>
            </Button>
          </div>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/admin/products">Tümünü yönet</Link>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
