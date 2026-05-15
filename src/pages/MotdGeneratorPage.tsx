import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { CartProvider } from "@/context/CartContext";

const MotdGeneratorPage = () => {
  useEffect(() => {
    document.title = "MOTD Generator — Blockbound Studios";
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-32 pb-20 min-h-[60vh]">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary-glow mb-4">
            // Araçlar
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            MOTD <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Çok yakında. Bu sayfa hazırlanıyor.
          </p>
        </main>
        <Footer />
        <CartSheet />
      </div>
    </CartProvider>
  );
};

export default MotdGeneratorPage;
