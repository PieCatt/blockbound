import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Hammer, Hash, Menu, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/blockbound-logo.png";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Anasayfa" },
  { href: "/products", label: "Ürünler" },
  { href: "/blog", label: "Blog" },
];

const tools = [
  { href: "#crafting-helper", label: "Crafting Yardımcısı", icon: Hammer, desc: "Tarif ve malzeme hesaplayıcı" },
  { href: "#hex-editor", label: "Hex Editör", icon: Hash, desc: "Renk kodlarını kolayca düzenle" },
  { href: "#motd-maker", label: "MOTD Maker", icon: MessageSquare, desc: "Sunucu mesajını tasarla" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3 backdrop-blur-xl bg-background/70 border-b border-border/50" : "py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a
          href="#home"
          className="logo-mark group relative inline-flex items-center"
          style={{ ['--logo-src' as never]: `url(${logo})` }}
        >
          <img
            src={logo}
            alt="Blockbound Studios logo"
            className="relative h-10 w-auto object-contain"
          />
          <span className="logo-text-overlay" aria-hidden="true" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-primary after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}

          <DropdownMenu open={toolsOpen} onOpenChange={setToolsOpen}>
            <DropdownMenuTrigger className="group flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none">
              Araçlar
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={16}
              className="w-72 p-2 glass-card border-border/50 animate-scale-in"
            >
              {tools.map((t) => (
                <DropdownMenuItem key={t.href} asChild className="p-0 focus:bg-transparent">
                  <a
                    href={t.href}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/60 transition-colors cursor-pointer w-full"
                  >
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                      <t.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground">{t.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{t.desc}</div>
                    </div>
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          <Button variant="hero" size="sm" asChild>
            <a href="/products">Mağazaya Git</a>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menüyü aç/kapat">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden mt-4 mx-6 p-6 glass-card rounded-2xl flex flex-col gap-4 animate-fade-in">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-foreground font-medium">
              {l.label}
            </a>
          ))}

          <button
            onClick={() => setToolsOpen((v) => !v)}
            className="flex items-center justify-between text-foreground font-medium"
            aria-expanded={toolsOpen}
          >
            Araçlar
            <ChevronDown className={`h-4 w-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
          </button>
          {toolsOpen && (
            <div className="pl-3 border-l-2 border-border/60 flex flex-col gap-3 animate-fade-in">
              {tools.map((t) => (
                <a
                  key={t.href}
                  href={t.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <t.icon className="h-4 w-4 text-primary-glow" />
                  {t.label}
                </a>
              ))}
            </div>
          )}

          <Button variant="hero" size="sm" asChild>
            <a href="#products">Mağazaya Git</a>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
