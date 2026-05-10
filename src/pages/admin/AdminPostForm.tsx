import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

const gradients = [
  { value: "from-primary/40 to-accent-purple/40", label: "Mor" },
  { value: "from-accent-cyan/40 to-primary/40", label: "Cyan" },
  { value: "from-accent-purple/40 to-accent-cyan/40", label: "Mor-Cyan" },
];

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const schema = z.object({
  title: z.string().trim().min(3, "Başlık çok kısa").max(200),
  slug: z.string().trim().min(2).max(120),
  excerpt: z.string().trim().max(500),
  category: z.string().trim().min(1).max(60),
  date: z.string().trim().max(60),
  read_time: z.string().trim().max(40),
  gradient: z.string(),
  content: z.string().trim().min(1, "İçerik boş olamaz"),
});

const AdminPostForm = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "Genel",
    date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
    read_time: "5 dk okuma",
    gradient: gradients[0].value,
    content: "",
  });

  useEffect(() => {
    document.title = isNew ? "Yeni Yazı — Admin" : "Yazıyı Düzenle — Admin";
    if (isNew) return;
    supabase.from("posts").select("*").eq("id", id!).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        toast.error("Yazı bulunamadı");
        navigate("/admin/posts");
        return;
      }
      setForm({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        category: data.category,
        date: data.date,
        read_time: data.read_time,
        gradient: data.gradient,
        content: data.content.join("\n\n"),
      });
      setLoading(false);
    });
  }, [id, isNew, navigate]);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setBusy(true);
    const payload = {
      title: parsed.data.title,
      slug: parsed.data.slug || slugify(parsed.data.title),
      excerpt: parsed.data.excerpt,
      category: parsed.data.category,
      date: parsed.data.date,
      read_time: parsed.data.read_time,
      gradient: parsed.data.gradient,
      content: parsed.data.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean),
    };

    const { error } = isNew
      ? await supabase.from("posts").insert(payload)
      : await supabase.from("posts").update(payload).eq("id", id!);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Yazı eklendi" : "Yazı güncellendi");
    qc.invalidateQueries({ queryKey: ["posts"] });
    navigate("/admin/posts");
  };

  if (loading) {
    return <AdminLayout><div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <Button variant="ghost" size="sm" onClick={() => navigate("/admin/posts")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Geri
      </Button>
      <h1 className="text-3xl font-black mb-8">{isNew ? "Yeni Yazı" : "Yazıyı Düzenle"}</h1>

      <div className="space-y-5 max-w-3xl glass-card rounded-2xl p-6">
        <div className="space-y-2">
          <Label>Başlık</Label>
          <Input value={form.title} onChange={(e) => {
            update("title", e.target.value);
            if (isNew && !form.slug) update("slug", slugify(e.target.value));
          }} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>URL slug</Label>
            <Input value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Input value={form.category} onChange={(e) => update("category", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Özet</Label>
          <Textarea rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tarih</Label>
            <Input value={form.date} onChange={(e) => update("date", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Okuma süresi</Label>
            <Input value={form.read_time} onChange={(e) => update("read_time", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Renk</Label>
            <Select value={form.gradient} onValueChange={(v) => update("gradient", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {gradients.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>İçerik (paragrafları boş satırla ayır)</Label>
          <Textarea rows={12} value={form.content} onChange={(e) => update("content", e.target.value)} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="hero" onClick={save} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Kaydet
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/posts")}>İptal</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPostForm;
