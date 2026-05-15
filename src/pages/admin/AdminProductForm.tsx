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
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { PRODUCT_TAGS } from "@/lib/productTags";
import { DEFAULT_PRODUCT_FEATURES, DEFAULT_PRODUCT_IMAGE } from "@/lib/productDefaults";
import { useAllProducts } from "@/hooks/useContent";

const schema = z.object({
  name: z.string().trim().min(2, "Ad çok kısa").max(150),
  category: z.string().trim().min(1).max(60),
  price: z.coerce.number().min(0),
  original_price: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  badge: z.string().trim().max(40).optional().or(z.literal("")),
  img: z.string().trim().max(500),
  description: z.string().trim().max(2000),
  is_free: z.boolean(),
  embed_html: z.string().trim().max(4000),
});

const AdminProductForm = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const { data: allProducts = [] } = useAllProducts();
  const categorySuggestions = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [allProducts]);

  const [form, setForm] = useState({
    name: "",
    category: "Koleksiyon",
    price: "0",
    original_price: "",
    badge: "",
    img: "",
    description: "",
    is_free: false,
    embed_html: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>(DEFAULT_PRODUCT_FEATURES);

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
        embed_html: (data as any).embed_html ?? "",
      });
      setImages(Array.isArray((data as any).images) ? (data as any).images : []);
      const f = (data as any).features;
      setFeatures(Array.isArray(f) && f.length > 0 ? f : DEFAULT_PRODUCT_FEATURES);
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
    const cleanImages = images.map((s) => s.trim()).filter(Boolean);
    const cleanFeatures = features.map((s) => s.trim()).filter(Boolean);
    const payload = {
      name: parsed.data.name,
      category: parsed.data.category,
      price: parsed.data.is_free ? 0 : parsed.data.price,
      badge: parsed.data.badge || null,
      img: parsed.data.img.trim() || DEFAULT_PRODUCT_IMAGE,
      description: parsed.data.description,
      is_free: parsed.data.is_free,
      images: cleanImages,
      features: cleanFeatures.length > 0 ? cleanFeatures : DEFAULT_PRODUCT_FEATURES,
      embed_html: parsed.data.embed_html.trim() || null,
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
          <div className="space-y-2 md:col-span-2">
            <Label>Ana görsel URL (boş bırakırsan varsayılan görsel kullanılır)</Label>
            <Input value={form.img} onChange={(e) => update("img", e.target.value)} placeholder="https://... (opsiyonel)" />
          </div>
        </div>

        {(form.img || images.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {[form.img, ...images].filter(Boolean).map((src, i) => (
              <div key={src + i} className="rounded-lg overflow-hidden border border-border/40 bg-secondary/30 w-24 h-24">
                <img src={src} alt="önizleme" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label>Ek görseller (galeri)</Label>
          <p className="text-xs text-muted-foreground">Ana görsele ek olarak ürün ayrıntılarında galeri olarak gösterilir.</p>
          <div className="space-y-2">
            {images.map((src, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={src}
                  placeholder="https://..."
                  onChange={(e) => setImages((arr) => arr.map((v, j) => (j === i ? e.target.value : v)))}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => setImages((arr) => arr.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setImages((arr) => [...arr, ""])}>
              <Plus className="h-4 w-4 mr-2" /> Görsel ekle
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Embed (sadece ürün ayrıntıları açılınca görünür)</Label>
          <p className="text-xs text-muted-foreground">YouTube/iframe/video HTML'i yapıştırabilirsin. Galerinin en üstünde görünür.</p>
          <Textarea
            rows={3}
            value={form.embed_html}
            onChange={(e) => update("embed_html", e.target.value)}
            placeholder='<iframe src="..." allowfullscreen></iframe>'
          />
        </div>

        <div className="space-y-2">
          <Label>Açıklama</Label>
          <Textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Özellikler (ürün ayrıntılarında listelenir)</Label>
          <div className="space-y-2">
            {features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={f}
                  onChange={(e) => setFeatures((arr) => arr.map((v, j) => (j === i ? e.target.value : v)))}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => setFeatures((arr) => arr.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setFeatures((arr) => [...arr, ""])}>
              <Plus className="h-4 w-4 mr-2" /> Özellik ekle
            </Button>
          </div>
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
