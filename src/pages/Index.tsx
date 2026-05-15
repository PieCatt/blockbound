import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import FreeProducts from "@/components/FreeProducts";
import Blog from "@/components/Blog";
import Social from "@/components/Social";
import Testimonials from "@/components/Testimonials";
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
          <About />
          <Products />
          <FreeProducts />
          <Blog />
          <Testimonials />
          <Social />
        </main>
        <Footer />
        <LiveChat />
        <CartSheet />
      </div>
    </CartProvider>
  );
};

export default Index;
