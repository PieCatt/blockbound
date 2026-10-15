import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useWikiPages, type WikiPage } from "@/hooks/useWiki";

const empty = { title: "", section: "Genel", content: "", sort_order: 0 };

const AdminWiki = () => {
  const { data: pages = [], isLoading } = useWikiPages();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { document.title = "Wiki — Admin"; }, []);

  const startNew = () => { setEditing("new"); setForm(empty); };
  const startEdit = (p: WikiPage) => {
    setEditing(p.id);
    setForm({ title: p.title, section: p.section, content: p.content, sort_order: p.sort_order });
  };

  const save = async () => {
    if (!form.title.trim()) return toast.error("Başlık gerekli");
    setSaving(true);
    const payload = { ...form, section: form.section.trim() || "Genel" };
    const { error } = editing === "new"
      ? await supabase.from("wiki_pages").insert(payload)
      : await supabase.from("wiki_pages").update(payload).eq("id", editing!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Kaydedildi");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["wiki"] });
  };

  const remove = async (p: WikiPage) => {
    if (!confirm(`"${p.title}" sayfasını silmek istediğine emin misin?`)) return;
    const { error } = await supabase.from("wiki_pages").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Silindi");
    qc.invalidateQueries({ queryKey: ["wiki"] });
  };

  const sections = Array.from(new Set(pages.map((p) => p.section)));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Wiki</h1>
          <p className="text-sm text-muted-foreground mt-1">{pages.length} sayfa</p>
        </div>
        <Button variant="hero" onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Yeni Sayfa</Button>
      </div>

      {editing && (
        <div className="glass-card glow-border rounded-2xl p-6 mb-8 space-y-4">
          <div className="grid md:grid-cols-[1fr_200px_100px] gap-3">
            <Input placeholder="Başlık" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Bölüm" list="wiki-sections" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
            <Input type="number" placeholder="Sıra" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })} />
            <datalist id="wiki-sections">{sections.map((s) => <option key={s} value={s} />)}</datalist>
          </div>
          <Textarea rows={14} placeholder="İçerik" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setEditing(null)}>Vazgeç</Button>
            <Button variant="hero" onClick={save} disabled={saving}>{saving ? "Kaydediliyor..." : "Kaydet"}</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : pages.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">Henüz sayfa yok.</div>
      ) : (
        <div className="space-y-3">
          {pages.map((p) => (
            <div key={p.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-primary-glow font-semibold mb-1">{p.section} · #{p.sort_order}</div>
                <div className="font-bold truncate">{p.title}</div>
              </div>
              <Button variant="outline" size="sm" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => remove(p)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminWiki;
