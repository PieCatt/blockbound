import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@south-paw/typeface-minecraft/index.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { CartProvider } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Copy,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Sparkles,
  RotateCcw,
  Eraser,
  Wand2,
  Users,
  Signal,
} from "lucide-react";
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
  { code: "l", icon: Bold, label: "Kalın (&l)" },
  { code: "o", icon: Italic, label: "İtalik (&o)" },
  { code: "n", icon: Underline, label: "Altı Çizili (&n)" },
  { code: "m", icon: Strikethrough, label: "Üstü Çizili (&m)" },
  { code: "k", icon: Sparkles, label: "Karışık / Obfuscated (&k)" },
];

const PRESETS: { name: string; value: string }[] = [
  {
    name: "Klasik",
    value: "&6&lBLOCKBOUND &8» &fPremium Minecraft Sunucusu\n&7Sürüm &a1.21 &7• &bshop.blockbound.gg",
  },
  {
    name: "Etkinlik",
    value: "&c&l✦ YAZ ETKİNLİĞİ BAŞLADI ✦\n&e%50 indirim &7ve &dözel kozmetikler &7seni bekliyor!",
  },
  {
    name: "Bakım",
    value: "&4&lBAKIM MODU\n&7Kısa süre içinde geri döneceğiz &8| &7takipte kal",
  },
  {
    name: "RGB Gradyan",
    value: "&#00E5FF&lB&#22C9FF&ll&#44AEFF&lo&#6692FF&lc&#8877FF&lk&#AA5BFF&lb&#BC49F5&lo&#CE37EB&lu&#E025E1&ln&#F213D7&ld\n&7play.blockbound.gg",
  },
];

const OBF_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@%&$?!/\\|";


const colorFor = (code: string) => COLORS.find((c) => c.code === code)?.hex;

const shadowFor = (hex: string) => {
  const n = hex.replace("#", "");
  const num = parseInt(n, 16);
  const r = Math.floor(((num >> 16) & 255) * 0.25);
  const g = Math.floor(((num >> 8) & 255) * 0.25);
  const b = Math.floor((num & 255) * 0.25);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

type Token = { color?: string; styles: string[]; text: string; br?: boolean };

// Render text with &-codes (and &#RRGGBB hex codes) into styled tokens for the preview.
const tokenize = (text: string): Token[] => {
  const tokens: Token[] = [];
  let color: string | undefined;
  let styles: string[] = [];
  let buf = "";
  const flush = () => {
    if (buf) tokens.push({ color, styles: [...styles], text: buf });
    buf = "";
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if ((ch === "§" || ch === "&") && i + 1 < text.length) {
      // &#RRGGBB custom hex color
      const hexMatch = /^#([0-9a-fA-F]{6})/.exec(text.slice(i + 1, i + 8));
      if (hexMatch) {
        flush();
        color = `#${hexMatch[1]}`;
        i += 7;
        continue;
      }
      const code = text[i + 1].toLowerCase();
      const valid = code === "r" || !!colorFor(code) || ["l", "o", "n", "m", "k"].includes(code);
      if (!valid) {
        buf += ch;
        continue;
      }
      flush();
      if (code === "r") {
        color = undefined;
        styles = [];
      } else if (colorFor(code)) {
        color = colorFor(code);
        styles = [];
      } else {
        if (!styles.includes(code)) styles.push(code);
      }
      i++;
    } else if (ch === "\n") {
      flush();
      tokens.push({ text: "", styles: [], br: true });
    } else {
      buf += ch;
    }
  }
  flush();
  return tokens;
};

const stripCodes = (s: string) =>
  s.replace(/[§&]#[0-9a-fA-F]{6}/g, "").replace(/[§&][0-9a-fk-orA-FK-OR]/g, "");


const MotdLine = ({ tokens, tick }: { tokens: Token[]; tick: number }) => (
  <>
    {tokens.map((t, i) => {
      const color = t.color ?? "#AAAAAA";
      const obf = t.styles.includes("k");
      const shown = obf
        ? t.text
            .split("")
            .map((c) =>
              c === " " ? " " : OBF_CHARS[Math.floor((tick * 7 + i * 13 + c.charCodeAt(0)) % OBF_CHARS.length)]
            )
            .join("")
        : t.text;
      return (
        <span
          key={i}
          style={{
            color,
            textShadow: `2px 2px 0 ${shadowFor(color)}`,
            fontWeight: t.styles.includes("l") ? 700 : 400,
            fontStyle: t.styles.includes("o") ? "italic" : "normal",
            textDecoration: [
              t.styles.includes("n") ? "underline" : "",
              t.styles.includes("m") ? "line-through" : "",
            ]
              .filter(Boolean)
              .join(" "),
          }}
        >
          {shown}
        </span>
      );
    })}
  </>
);

const MotdGeneratorPage = () => {
  const [text, setText] = useState(PRESETS[0].value);
  const [serverName, setServerName] = useState("Blockbound Network");
  const [online, setOnline] = useState(842);
  const [maxPlayers, setMaxPlayers] = useState(1000);
  const [darkList, setDarkList] = useState(true);
  const [tick, setTick] = useState(0);
  const [customColor, setCustomColor] = useState("#7C4DFF");
  const [gradFrom, setGradFrom] = useState("#00E5FF");
  const [gradTo, setGradTo] = useState("#F213D7");
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<string[]>([]);

  useEffect(() => {
    document.title = "MOTD Generator — Minecraft Sunucu Mesajı Tasarla | Blockbound";
    const desc = document.querySelector('meta[name="description"]');
    if (desc)
      desc.setAttribute(
        "content",
        "Minecraft sunucu MOTD'unu &renk kodları ve &#RRGGBB özel renklerle tasarla, sunucu listesi görünümünde canlı önizle ve tek tıkla kopyala."
      );
  }, []);

  // animate obfuscated (&k) text
  const hasObf = text.includes("§k") || text.includes("&k");
  useEffect(() => {
    if (!hasObf) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 70);
    return () => window.clearInterval(id);
  }, [hasObf]);

  const lines = useMemo(() => {
    const raw = text.split("\n").slice(0, 2);
    return raw.map((l) => tokenize(l));
  }, [text]);

  const plainLines = useMemo(() => text.split("\n").slice(0, 2).map(stripCodes), [text]);

  const push = useCallback((next: string) => {
    historyRef.current = [...historyRef.current.slice(-40), text];
    setText(next);
  }, [text]);

  // Insert a raw snippet at the caret position (or at the end).
  const insertRaw = (snippet: string) => {
    const el = areaRef.current;
    if (!el) {
      push(text + snippet);
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? start;
    const next = text.slice(0, start) + snippet + text.slice(end);
    push(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  };

  const insert = (code: string) => insertRaw("&" + code);

  const undo = () => {
    const prev = historyRef.current.pop();
    if (prev === undefined) return toast.info("Geri alınacak bir şey yok");
    setText(prev);
  };

  const rainbow = () => {
    const order = ["c", "6", "e", "a", "b", "9", "d"];
    const next = text
      .split("\n")
      .map((line) => {
        const plain = stripCodes(line);
        let i = 0;
        return plain
          .split("")
          .map((ch) => (ch === " " ? ch : `&${order[i++ % order.length]}${ch}`))
          .join("");
      })
      .join("\n");
    push(next);
    toast.success("Gökkuşağı uygulandı");
  };

  // Birdflop-style two-color hex gradient across each line.
  const gradient = () => {
    const hex2rgb = (h: string) => {
      const n = parseInt(h.replace("#", ""), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const [r1, g1, b1] = hex2rgb(gradFrom);
    const [r2, g2, b2] = hex2rgb(gradTo);
    const next = text
      .split("\n")
      .map((line) => {
        const plain = stripCodes(line);
        const chars = plain.split("");
        const steps = Math.max(chars.length - 1, 1);
        return chars
          .map((ch, i) => {
            const t = i / steps;
            const hex = [r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t]
              .map((v) => Math.round(v).toString(16).padStart(2, "0"))
              .join("");
            return `&#${hex.toUpperCase()}${ch}`;
          })
          .join("");
      })
      .join("\n");
    push(next);
    toast.success("Gradyan uygulandı");
  };

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} kopyalandı`);
  };

  // Normalize everything to & codes for display/copy.
  const ampOut = text.replace(/§/g, "&");
  // server.properties: legacy codes → \u00A7X, hex → Spigot \u00A7x\u00A7R\u00A7R...
  const propsBody = ampOut
    .replace(/&#([0-9a-fA-F]{6})/g, (_m, h: string) =>
      "\\u00A7x" + h.split("").map((c) => "\\u00A7" + c).join("")
    )
    .replace(/&([0-9a-fk-orA-FK-OR])/g, "\\u00A7$1")
    .replace(/\n/g, "\\n");
  const serverProps = `motd=${propsBody}`;
  const jsonOut = JSON.stringify({ text: ampOut });


  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-28 pb-20">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-3">
            // Araçlar
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3">
            MOTD <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-10">
            Sunucu mesajını renk ve biçim kodlarıyla tasarla, gerçek Minecraft sunucu listesi
            görünümünde canlı önizle ve tek tıkla kopyala.
          </p>

          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-8 items-start">
            {/* ---- Editor ---- */}
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Renkler
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => insert(c.code)}
                      title={`&${c.code} — ${c.name}`}
                      className="group relative h-10 rounded-lg border border-border/60 transition-all hover:scale-110 hover:z-10 hover:shadow-glow"
                      style={{ background: c.hex }}
                      aria-label={c.name}
                    >
                      <span className="absolute inset-x-0 -bottom-5 text-[10px] font-mono text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        &amp;{c.code}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="h-px bg-border/60" />

                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Özel Renk (&amp;#RRGGBB)
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="color"
                    aria-label="Özel renk seç"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value.toUpperCase())}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-border/60 bg-transparent p-1"
                  />
                  <Input
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value.toUpperCase())}
                    className="w-32 font-mono text-sm"
                    aria-label="Özel renk hex kodu"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      /^#[0-9a-fA-F]{6}$/.test(customColor)
                        ? insertRaw(`&${customColor.toUpperCase()}`)
                        : toast.error("Geçerli bir hex kodu gir (#RRGGBB)")
                    }
                  >
                    Ekle
                  </Button>
                </div>

                <div className="h-px bg-border/60" />

                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Hex Gradyan
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="color"
                    aria-label="Gradyan başlangıç rengi"
                    value={gradFrom}
                    onChange={(e) => setGradFrom(e.target.value.toUpperCase())}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-border/60 bg-transparent p-1"
                  />
                  <input
                    type="color"
                    aria-label="Gradyan bitiş rengi"
                    value={gradTo}
                    onChange={(e) => setGradTo(e.target.value.toUpperCase())}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-border/60 bg-transparent p-1"
                  />
                  <div
                    className="h-10 flex-1 min-w-[100px] rounded-lg border border-border/60"
                    style={{ background: `linear-gradient(90deg,${gradFrom},${gradTo})` }}
                  />
                  <Button variant="outline" size="sm" onClick={gradient}>
                    <Wand2 className="mr-2 h-4 w-4" /> Uygula
                  </Button>
                </div>


                <div className="h-px bg-border/60" />

                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Biçim
                </div>
                <div className="flex flex-wrap gap-2">
                  {FORMATS.map((f) => (
                    <Button
                      key={f.code}
                      variant="outline"
                      size="sm"
                      onClick={() => insert(f.code)}
                      title={f.label}
                    >
                      <f.icon className="h-4 w-4" />
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => insert("r")}>
                    Sıfırla &amp;r
                  </Button>

                  <Button variant="outline" size="sm" onClick={rainbow}>
                    <Wand2 className="mr-2 h-4 w-4" /> Gökkuşağı
                  </Button>
                  <Button variant="outline" size="sm" onClick={undo}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Geri Al
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => push("")}>
                    <Eraser className="mr-2 h-4 w-4" /> Temizle
                  </Button>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="motd-text" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    MOTD Metni (en fazla 2 satır)
                  </Label>
                  <div className="flex gap-3 text-xs font-mono">
                    {plainLines.map((l, i) => (
                      <span key={i} className={l.length > 45 ? "text-destructive" : "text-muted-foreground"}>
                        S{i + 1}: {l.length}/45
                      </span>
                    ))}
                  </div>
                </div>
                <Textarea
                  id="motd-text"
                  ref={areaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value.split("\n").slice(0, 2).join("\n"))}
                  rows={4}
                  className="font-mono text-sm leading-relaxed"
                  placeholder="&6Welcome to &bMyServer... veya &#FF8800Özel renk"
                />
                <p className="text-xs text-muted-foreground">
                  İpucu: <span className="font-mono text-foreground">&amp;#RRGGBB</span> ile özel renk
                  kullanabilirsin (ör. <span className="font-mono text-foreground">&amp;#FFFFFF</span>).
                  Renk kodu yazınca aktif biçimler sıfırlanır — Minecraft'ta da böyle çalışır.
                </p>

              </div>

              <div className="glass-card rounded-2xl p-5 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Hazır Şablonlar
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <Button key={p.name} variant="secondary" size="sm" onClick={() => push(p.value)}>
                      {p.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- Preview + export ---- */}
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Canlı Önizleme — Sunucu Listesi
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bg-toggle" className="text-xs text-muted-foreground">
                      Koyu arka plan
                    </Label>
                    <Switch id="bg-toggle" checked={darkList} onCheckedChange={setDarkList} />
                  </div>
                </div>

                <div
                  className="rounded-xl p-4 sm:p-6"
                  style={{
                    background: darkList
                      ? "linear-gradient(180deg,#101010,#1b1b1b)"
                      : "linear-gradient(180deg,#6a8ec4,#8fb0d8)",
                  }}
                >
                  <div
                    className="flex gap-3 p-2 sm:p-3 border-2"
                    style={{
                      background: "rgba(0,0,0,0.55)",
                      borderColor: "#6b6b6b",
                      fontFamily: "'Minecraft', 'Courier New', monospace",
                      imageRendering: "pixelated",
                    }}
                  >
                    <div
                      className="h-16 w-16 shrink-0 grid place-items-center text-2xl"
                      style={{
                        background: "linear-gradient(135deg,#3aa0ff,#8b5cf6)",
                        color: "#fff",
                        textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
                      }}
                    >
                      {(serverName.trim() || "Minecraft Server").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="truncate text-base sm:text-lg"
                          style={{ color: "#FFFFFF", textShadow: "2px 2px 0 #3f3f3f" }}
                        >
                          {serverName || "Minecraft Server"}
                        </div>
                        <div className="flex items-center gap-2 shrink-0" style={{ color: "#AAAAAA" }}>
                          <span className="text-xs" style={{ textShadow: "2px 2px 0 #2a2a2a" }}>
                            {online}/{maxPlayers}
                          </span>
                          <div className="flex items-end gap-[2px] h-4">
                            {[6, 9, 12, 15, 18].map((h, i) => (
                              <span
                                key={i}
                                style={{
                                  display: "block",
                                  width: 3,
                                  height: h,
                                  background: i < 4 ? "#55FF55" : "#3f3f3f",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-1 text-sm sm:text-base leading-snug break-words">
                        {lines.map((lineTokens, i) => (
                          <div key={i} className="min-h-[1.2em]">
                            <MotdLine tokens={lineTokens} tick={tick} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="srv" className="text-xs text-muted-foreground">
                      Sunucu adı
                    </Label>
                    <Input id="srv" value={serverName} onChange={(e) => setServerName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="on" className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Çevrimiçi
                    </Label>
                    <Input
                      id="on"
                      type="number"
                      value={online}
                      onChange={(e) => setOnline(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="max" className="text-xs text-muted-foreground flex items-center gap-1">
                      <Signal className="h-3 w-3" /> Kapasite
                    </Label>
                    <Input
                      id="max"
                      type="number"
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Dışa Aktar
                </div>
                <div className="rounded-lg bg-secondary/60 p-3 font-mono text-xs break-all text-muted-foreground">
                  {serverProps}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="hero" onClick={() => copy(serverProps, "server.properties")}>
                    <Copy className="mr-2 h-4 w-4" /> server.properties
                  </Button>
                  <Button variant="outline" onClick={() => copy(ampOut, "Ham metin (&)")}>
                    Ham (&amp;)
                  </Button>
                  <Button variant="outline" onClick={() => copy(stripCodes(text), "Düz metin")}>
                    Düz metin
                  </Button>

                  <Button variant="outline" onClick={() => copy(jsonOut, "JSON")}>
                    JSON
                  </Button>
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

export default MotdGeneratorPage;
