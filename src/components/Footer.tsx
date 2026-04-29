import logo from "@/assets/blockbound-logo.png";
import { Github, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 py-16 mt-12">
      <div className="container grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Blockbound logo" className="h-10 w-10" />
            <span className="text-xl font-bold gradient-text">blockbound.</span>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Minecraft severlerin premium koleksiyon ve merch adresi. Blok blok, hayal et — biz inşa edelim.
          </p>
          <div className="flex gap-3 mt-6">
            {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Sosyal medya"
                className="h-10 w-10 rounded-xl glass-card flex items-center justify-center hover:shadow-glow hover:scale-110 transition-all"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4">Mağaza</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#products" className="hover:text-foreground">Tüm Ürünler</a></li>
            <li><a href="#products" className="hover:text-foreground">Yeni Sezon</a></li>
            <li><a href="#products" className="hover:text-foreground">İndirimler</a></li>
            <li><a href="#products" className="hover:text-foreground">Sınırlı Seri</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Şirket</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#blog" className="hover:text-foreground">Blog</a></li>
            <li><a href="#contact" className="hover:text-foreground">İletişim</a></li>
            <li><a href="#" className="hover:text-foreground">Gizlilik</a></li>
            <li><a href="#" className="hover:text-foreground">Şartlar</a></li>
          </ul>
        </div>
      </div>

      <div className="container mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
        <span>© 2026 Blockbound Studios. Tüm hakları saklıdır.</span>
        <span>Mojang ile resmi bir bağlantımız bulunmamaktadır.</span>
      </div>
    </footer>
  );
};

export default Footer;
