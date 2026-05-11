import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { PRODUCT_TAGS } from "@/lib/productTags";

const schema = z.object({
  name: z.string().trim().min(2, "Ad çok kısa").max(150),
  category: z.string().trim().min(1).max(60),
  price: z.coerce.number().min(0),
  badge: z.string().trim().max(40).optional().or(z.literal("")),
  img: z.string().trim().url("Geçerli bir görsel URL'si gir").max(500),
  description: z.string().trim().max(2000),
  is_free: z.boolean(),
});

const AdminProductForm = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  const [form, setForm] = useState({
    name: "",
    category: "Koleksiyon",
    price: "0",
    badge: "",
    img: "",
    description: "",
    is_free: false,
  });

  useEffect(() => {
    document.title = isNew ? "Yeni Ürün — Admin" : "Ürünü Düzenle — Admin";
    if (isNew) return;
    supabase.from("products").select("*").eq("id", id!).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        toast.error("Ürün bulunamadı");
        navigate("/admin/products");
        return;
      }
      setForm({
        name: data.name,
        category: data.category,
        price: String(data.price),
        badge: data.badge ?? "",
        img: data.img,
        description: data.description,
        is_free: data.is_free,
      });
      setLoading(false);
    });
  }, [id, isNew, navigate]);

  const update = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setBusy(true);
    const payload = {
      name: parsed.data.name,
      category: parsed.data.category,
      price: parsed.data.is_free ? 0 : parsed.data.price,
      badge: parsed.data.badge || null,
      img: parsed.data.img,
      description: parsed.data.description,
      is_free: parsed.data.is_free,
    };

    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", id!);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Ürün eklendi" : "Ürün güncellendi");
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["free-products"] });
    qc.invalidateQueries({ queryKey: ["all-products"] });
    navigate("/admin/products");
  };

  if (loading) {
    return <AdminLayout><div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <Button variant="ghost" size="sm" onClick={() => navigate("/admin/products")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Geri
      </Button>
      <h1 className="text-3xl font-black mb-8">{isNew ? "Yeni Ürün" : "Ürünü Düzenle"}</h1>

      <div className="space-y-5 max-w-3xl glass-card rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Ürün adı</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Input value={form.category} onChange={(e) => update("category", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Fiyat (TL)</Label>
            <Input type="number" min={0} value={form.price} onChange={(e) => update("price", e.target.value)} disabled={form.is_free} />
          </div>
          <div className="space-y-2">
            <Label>Etiket (opsiyonel)</Label>
            <Select value={form.badge || "none"} onValueChange={(v) => update("badge", v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="Etiket seç" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Etiket yok</SelectItem>
                {PRODUCT_TAGS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">"Çok Satan" ve "Yeni Çıkan" ana sayfada öncelikli gösterilir.</p>
          </div>
          <div className="space-y-2">
            <Label>Görsel URL</Label>
            <Input value={form.img} onChange={(e) => update("img", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        {form.img && (
          <div className="rounded-xl overflow-hidden border border-border/40 bg-secondary/30 max-w-xs">
            <img src={form.img} alt="önizleme" className="w-full h-40 object-cover" />
          </div>
        )}

        <div className="space-y-2">
          <Label>Açıklama</Label>
          <Textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/40">
          <Switch checked={form.is_free} onCheckedChange={(v) => update("is_free", v)} />
          <div>
            <div className="font-semibold text-sm">Ücretsiz ürün</div>
            <div className="text-xs text-muted-foreground">Açarsan "Ücretsiz Ürünler" bölümünde gösterilir.</div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="hero" onClick={save} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Kaydet
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/products")}>İptal</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductForm;
