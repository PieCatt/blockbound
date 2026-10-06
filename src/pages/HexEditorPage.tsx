import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { CartProvider } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

// Minecraft default chat color palette
const MC_COLORS: { code: string; name: string; hex: string }[] = [
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

const hexToRgb = (hex: string) => {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  if (!m || m.length < 3) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
};

const HexEditorPage = () => {
  const [hex, setHex] = useState("#55FFFF");

  useEffect(() => {
    document.title = "Hex Editor — Blockbound Studios";
  }, []);

  const { r, g, b } = useMemo(() => hexToRgb(hex), [hex]);
  const mcTag = `<#${hex.replace("#", "").toUpperCase()}>`;
  const ampTag = `&x&${hex.replace("#", "").toUpperCase().split("").map((c) => `&${c}`).join("")}`;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopyalandı`);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-32 pb-16 min-h-[60vh]">
          <h1 className="text-4xl md:text-6xl font-black mb-3">
            Hex <span className="gradient-text">Editör</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-10">
            Minecraft için renk kodu seç, hex değerini al, sunucu mesajı ve eklenti formatlarına dönüştür.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Renk Seçici
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setHex(e.target.value.toUpperCase())}
                  className="h-20 w-20 rounded-xl border border-border bg-transparent cursor-pointer"
                  aria-label="Renk seç"
                />
                <Input
                  value={hex}
                  onChange={(e) => setHex(e.target.value.toUpperCase())}
                  className="font-mono text-lg"
                  maxLength={7}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="glass-card rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">R</div>
                  <div className="font-mono text-lg">{r}</div>
                </div>
                <div className="glass-card rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">G</div>
                  <div className="font-mono text-lg">{g}</div>
                </div>
                <div className="glass-card rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">B</div>
                  <div className="font-mono text-lg">{b}</div>
                </div>
              </div>

              <div
                className="rounded-xl p-6 text-center font-black text-2xl border border-border/60"
                style={{ background: hex, color: r + g + b > 380 ? "#0a0a0a" : "#fff" }}
              >
                Örnek Önizleme
              </div>
            </div>

            <div className="space-y-5">
              <div className="glass-card rounded-2xl p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Dönüşümler
                </div>
                <div className="space-y-3">
                  {[
                    { label: "HEX", value: hex.toUpperCase() },
                    { label: "MiniMessage", value: mcTag },
                    { label: "Spigot &x formatı", value: ampTag },
                    { label: "RGB()", value: `rgb(${r}, ${g}, ${b})` },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2">
                      <div className="w-32 text-xs text-muted-foreground">{row.label}</div>
                      <Input value={row.value} readOnly className="font-mono" />
                      <Button variant="outline" size="icon" onClick={() => copy(row.value, row.label)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Vanilla Renkler
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {MC_COLORS.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setHex(c.hex)}
                      title={`§${c.code} ${c.name}`}
                      className="aspect-square rounded-lg border border-border/60 hover:scale-110 transition-transform"
                      style={{ background: c.hex }}
                      aria-label={c.name}
                    />
                  ))}
                </div>
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

export default HexEditorPage;
