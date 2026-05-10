import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useAllProducts } from "@/hooks/useContent";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPrice } from "@/context/CartContext";

const AdminProductsList = () => {
  const { data: products = [], isLoading } = useAllProducts();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "paid" | "free">("all");

  useEffect(() => { document.title = "Ürünler — Admin"; }, []);

  const remove = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğine emin misin?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Ürün silindi");
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["free-products"] });
    qc.invalidateQueries({ queryKey: ["all-products"] });
  };

  const visible = products.filter((p) =>
    filter === "all" ? true : filter === "free" ? p.is_free : !p.is_free,
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">Ürünler</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} ürün</p>
        </div>
        <Button variant="hero" asChild>
          <Link to="/admin/products/new"><Plus className="h-4 w-4 mr-2" /> Yeni Ürün</Link>
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {([["all","Tümü"],["paid","Ücretli"],["free","Ücretsiz"]] as const).map(([k,l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === k
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : visible.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
          Bu filtrede ürün yok.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((p) => (
            <div key={p.id} className="glass-card rounded-xl p-3 flex items-center gap-4">
              <img src={p.img} alt="" className="h-14 w-14 rounded-lg object-cover bg-secondary/40" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-primary-glow font-semibold mb-0.5">
                  {p.category}{p.is_free && " · Ücretsiz"}
                </div>
                <div className="font-bold truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.is_free ? "—" : formatPrice(p.price)}</div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/admin/products/${p.id}`}><Pencil className="h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => remove(p.id, p.name)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProductsList;
