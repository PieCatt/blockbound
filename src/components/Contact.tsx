import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Mesajın bize ulaştı! En kısa sürede dönüş yapacağız.");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  const items = [
    { icon: Mail, label: "E-posta", value: "merhaba@blockbound.studio" },
    { icon: Phone, label: "Telefon", value: "+90 850 000 00 00" },
    { icon: MapPin, label: "Adres", value: "İstanbul, Türkiye" },
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="animate-fade-in-up">
            <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
              // İletişim
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Bize <span className="gradient-text">ulaş</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Soruların, iş birliği teklifin ya da özel tasarım talebin mi var? Mesajını bırak, ekibimiz 24 saat içinde dönsün.
            </p>

            <div className="space-y-5">
              {items.map((it) => (
                <div key={it.label} className="flex items-center gap-4 p-4 glass-card rounded-xl group hover:shadow-glow transition-all">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                    <it.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{it.label}</div>
                    <div className="font-semibold">{it.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="glass-card rounded-3xl p-8 md:p-10 space-y-5 animate-fade-in-up"
            style={{ animationDelay: "150ms" }}
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium mb-2 block">Adın</label>
                <Input required placeholder="Steve" className="bg-secondary/50 border-border h-12" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">E-posta</label>
                <Input required type="email" placeholder="seninadres@mail.com" className="bg-secondary/50 border-border h-12" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Konu</label>
              <Input required placeholder="Sipariş, iş birliği..." className="bg-secondary/50 border-border h-12" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mesajın</label>
              <Textarea required rows={5} placeholder="Bize anlatmak istediklerin..." className="bg-secondary/50 border-border resize-none" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Gönderiliyor..." : (<>Mesajı Gönder <Send className="ml-2 h-4 w-4" /></>)}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
