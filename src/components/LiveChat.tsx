import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

type Msg = { from: "bot" | "user"; text: string };

const initial: Msg[] = [
  { from: "bot", text: "Merhaba! Ben Block, Blockbound canlı destek asistanın. Nasıl yardımcı olabilirim? 🟦" },
];

const replies: Record<string, string> = {
  fiyat: "Ürün fiyatlarımız ürün sayfasında görünür. Toplu sipariş için %15'e varan indirim sunuyoruz!",
  kargo: "Türkiye geneli 1-3 iş günü içinde kargolama yapıyoruz. 500₺ üzeri siparişlerde kargo ücretsiz. 📦",
  iade: "14 gün içerisinde koşulsuz iade garantisi sunuyoruz.",
  default: "Sorunu ekibe ilettim. E-posta adresini paylaşırsan kısa süre içinde dönüş yapalım.",
};

const LiveChat = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      const lower = text.toLowerCase();
      const key = Object.keys(replies).find((k) => lower.includes(k)) ?? "default";
      setMsgs((m) => [...m, { from: "bot", text: replies[key] }]);
    }, 700);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Canlı destek"
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-primary shadow-elegant flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-primary animate-glow-pulse opacity-60" />
        {open ? (
          <X className="h-6 w-6 text-primary-foreground relative z-10" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground relative z-10" />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent-cyan border-2 border-background animate-glow-pulse" />
        )}
      </button>

      {open && (
        <div className="fixed bottom-28 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[500px] glass-card rounded-3xl flex flex-col overflow-hidden animate-scale-in shadow-elegant">
          <div className="p-5 border-b border-border/50 bg-gradient-primary/10 flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-accent-cyan border-2 border-background" />
            </div>
            <div>
              <div className="font-bold">Block — Canlı Destek</div>
              <div className="text-xs text-muted-foreground">Genellikle 1 dakikada yanıtlar</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm animate-fade-in ${
                  m.from === "user"
                    ? "ml-auto bg-gradient-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary/80 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="p-4 border-t border-border/50 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajını yaz..."
              className="bg-secondary/50 border-border"
            />
            <Button type="submit" variant="hero" size="icon" aria-label="Gönder">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default LiveChat;
