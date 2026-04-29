import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/blockbound-logo.png";

const links = [
  { href: "#home", label: "Anasayfa" },
  { href: "#products", label: "Ürünler" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "İletişim" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        <a href="#home" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="Blockbound Studios logo"
            className="h-10 w-10 object-contain transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500"
          />
          <span className="text-xl font-bold gradient-text">blockbound.</span>
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
        </nav>

        <div className="hidden md:block">
          <Button variant="hero" size="sm" asChild>
            <a href="#products">Mağazaya Git</a>
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
          <Button variant="hero" size="sm" asChild>
            <a href="#products">Mağazaya Git</a>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
