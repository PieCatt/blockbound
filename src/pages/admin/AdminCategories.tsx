import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAllProducts, useCategoryImages } from "@/hooks/useContent";
import { useToast } from "@/hooks/use-toast";

const AdminCategories = () => {
  const { data: products = [], isLoading } = useAllProducts();
  const { data: images = {} } = useCategoryImages();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const qc = useQueryClient();
  const { toast } = useToast();

  const cats = useMemo(() => Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(), [products]);
  useEffect(() => setDraft(images), [images]);

  const save = async (name: string) => {
    setSaving(name);
    const { error } = await supabase.from("categories").upsert({ name, image_url: (draft[name] ?? "").trim() });
    setSaving(null);
    if (error) return toast({ title: "Kaydedilemedi", description: error.message, variant: "destructive" });
    qc.invalidateQueries({ queryKey: ["category-images"] });
    toast({ title: "Kaydedildi", description: `${name} görseli güncellendi.` });
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black mb-2">Kategoriler</h1>
      <p className="text-muted-foreground mb-6">Ürünler sayfasındaki kategori kartlarının görsellerini ayarla. Boş bırakırsan varsayılan görünüm kullanılır.</p>
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary-glow" />
      ) : cats.length === 0 ? (
        <p className="text-muted-foreground">Henüz kategori yok — önce ürün ekle.</p>
      ) : (
        <div className="space-y-4">
          {cats.map((c) => (
            <div key={c} className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="w-full sm:w-40 h-24 rounded-xl overflow-hidden bg-secondary/40 shrink-0">
                {draft[c] ? <img src={draft[c]} alt={c} className="w-full h-full object-cover" /> : <div className="w-full h-full pixel-grid opacity-60" />}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-bold">{c}</h3>
                <Input placeholder="Görsel URL'si (https://...)" value={draft[c] ?? ""} onChange={(e) => setDraft({ ...draft, [c]: e.target.value })} />
              </div>
              <Button onClick={() => save(c)} disabled={saving === c}>
                {saving === c ? <Loader2 className="h-4 w-4 animate-spin" /> : "Kaydet"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
