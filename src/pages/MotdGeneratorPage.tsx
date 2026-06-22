import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { CartProvider } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Bold, Italic, Underline, Strikethrough, Sparkles } from "lucide-react";
import { toast } from "sonner";

const COLORS: { code: string; name: string; hex: string }[] = [
  { code: "0", name: "Black", hex: "#000000" },
  { code: "1", name: "Dark Blue", hex: "#0000AA" },
  { code: "2", name: "Dark Green", hex: "#00AA00" },
  { code: "3", name: "Dark Aqua", hex: "#00AAAA" },
  { code: "4", name: "Dark Red", hex: "#AA0000" },
  { code: "5", name: "Dark Purple", hex: "#AA00AA" },
  { code: "6", name: "Gold", hex: "#FFAA00" },
  { code: "7", name: "Gray", hex: "#AAAAAA" },
  { code: "8", name: "Dark Gray", hex: "#555555" },
  { code: "9", name: "Blue", hex: "#5555FF" },
  { code: "a", name: "Green", hex: "#55FF55" },
  { code: "b", name: "Aqua", hex: "#55FFFF" },
  { code: "c", name: "Red", hex: "#FF5555" },
  { code: "d", name: "Light Purple", hex: "#FF55FF" },
  { code: "e", name: "Yellow", hex: "#FFFF55" },
  { code: "f", name: "White", hex: "#FFFFFF" },
];

const FORMATS = [
  { code: "l", icon: Bold, label: "Bold" },
  { code: "o", icon: Italic, label: "Italic" },
  { code: "n", icon: Underline, label: "Underline" },
  { code: "m", icon: Strikethrough, label: "Strike" },
  { code: "k", icon: Sparkles, label: "Obfuscated" },
];

const colorFor = (code: string) => COLORS.find((c) => c.code === code)?.hex;

// Render text with §-codes into styled spans for the preview.
const renderMotd = (text: string) => {
  const tokens: { color?: string; styles: string[]; text: string }[] = [];
  let color: string | undefined;
  let styles: string[] = [];
  let buf = "";
  const flush = () => {
    if (buf) tokens.push({ color, styles: [...styles], text: buf });
    buf = "";
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "§" && i + 1 < text.length) {
      const code = text[i + 1].toLowerCase();
      flush();
      if (code === "r") {
        color = undefined;
        styles = [];
      } else if (colorFor(code)) {
        color = colorFor(code);
        styles = [];
      } else if (["l", "o", "n", "m", "k"].includes(code)) {
        if (!styles.includes(code)) styles.push(code);
      }
      i++;
    } else if (ch === "\n") {
      flush();
      tokens.push({ text: "\n", styles: [] });
    } else {
      buf += ch;
    }
  }
  flush();
  return tokens;
};

const MotdGeneratorPage = () => {
  const [text, setText] = useState("§6Welcome to §bBlockbound§r\n§aA premium Minecraft server");

  useEffect(() => {
    document.title = "MOTD Generator — Blockbound Studios";
  }, []);

  const tokens = useMemo(() => renderMotd(text), [text]);

  const insert = (code: string) => setText((t) => t + "§" + code);

  const copyServerProps = () => {
    const out = text.replace(/\n/g, "\\n").replace(/§/g, "\\u00A7");
    navigator.clipboard.writeText(`motd=${out}`);
    toast.success("server.properties formatı kopyalandı");
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-32 pb-16 min-h-[60vh]">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
            // Araçlar
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3">
            MOTD <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-10">
            Sunucu mesajını (MOTD) §-renk kodlarıyla tasarla, canlı önizle, server.properties için kopyala.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-4 flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => insert(c.code)}
                    title={`§${c.code} ${c.name}`}
                    className="h-9 w-9 rounded-md border border-border/60 hover:scale-110 transition-transform"
                    style={{ background: c.hex }}
                    aria-label={c.name}
                  />
                ))}
                <div className="w-full h-px bg-border/50 my-1" />
                {FORMATS.map((f) => (
                  <Button key={f.code} variant="outline" size="sm" onClick={() => insert(f.code)} title={f.label}>
                    <f.icon className="h-4 w-4" />
                  </Button>
                ))}
                <Button variant="outline" size="sm" onClick={() => insert("r")}>Reset §r</Button>
              </div>

              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="font-mono"
                placeholder="§6Welcome to §bMyServer..."
              />

              <div className="flex gap-2">
                <Button variant="hero" onClick={copyServerProps}>
                  <Copy className="mr-2 h-4 w-4" /> server.properties Kopyala
                </Button>
                <Button variant="outline" onClick={() => { navigator.clipboard.writeText(text); toast.success("Ham metin kopyalandı"); }}>
                  Ham Metin
                </Button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Canlı Önizleme
              </div>
              <div
                className="rounded-xl p-6 bg-black font-mono text-lg leading-relaxed min-h-[200px]"
                style={{ fontFamily: "'Minecraftia', monospace" }}
              >
                {tokens.map((t, i) =>
                  t.text === "\n" ? (
                    <br key={i} />
                  ) : (
                    <span
                      key={i}
                      style={{
                        color: t.color ?? "#FFFFFF",
                        fontWeight: t.styles.includes("l") ? 700 : 400,
                        fontStyle: t.styles.includes("o") ? "italic" : "normal",
                        textDecoration: [
                          t.styles.includes("n") ? "underline" : "",
                          t.styles.includes("m") ? "line-through" : "",
                        ].filter(Boolean).join(" "),
                        filter: t.styles.includes("k") ? "blur(2px)" : "none",
                      }}
                    >
                      {t.text}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <CartSheet />
      </div>
    </CartProvider>
  );
};

export default MotdGeneratorPage;
