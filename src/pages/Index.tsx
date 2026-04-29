import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import CartSheet from "@/components/CartSheet";
import { CartProvider } from "@/context/CartContext";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Blockbound Studios — Premium Minecraft Ürünleri";
    const desc = "Blockbound Studios: Premium Minecraft koleksiyonu, figürler, merch ve dijital ürünler.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Products />
          <Blog />
          <Contact />
        </main>
        <Footer />
        <LiveChat />
        <CartSheet />
      </div>
    </CartProvider>
  );
};

export default Index;
