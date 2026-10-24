import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductDialog from "./ProductDialog";
import type { Product } from "@/context/CartContext";

vi.mock("@/context/CartContext", () => ({
  useCart: () => ({ addToCart: vi.fn() }),
  formatPrice: (price: number) => String(price),
}));

afterEach(cleanup);

const product: Product = {
  id: "preview-test", name: "Test ürün", category: "Plugin", price: 100,
  img: "/cover.jpg", images: ["/second.jpg"],
  description: "Birinci paragraf.\nİkinci paragraf.\nÜçüncü paragraf.",
  embed_html: '<iframe title="Ürün videosu" src="about:blank"></iframe>',
};

describe("Product preview interactions", () => {
  it("starts with embed in the gallery and switches between images and embed", () => {
    render(<ProductDialog product={product} onClose={() => {}} />);
    expect(screen.getByTitle("Ürün videosu")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Görsel 2" }));
    expect(screen.queryByTitle("Ürün videosu")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: product.name })).toHaveAttribute("src", "/cover.jpg");
    fireEvent.click(screen.getByRole("button", { name: "Video önizlemesi" }));
    expect(screen.getByTitle("Ürün videosu")).toBeInTheDocument();
  });

  it("expands and collapses the description and resets for another product", () => {
    const { rerender } = render(<ProductDialog product={product} onClose={() => {}} />);
    const toggle = screen.getByRole("button", { expanded: false });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    rerender(<ProductDialog product={{ ...product, id: "other" }} onClose={() => {}} />);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("uses the cover normally when no embed is provided", () => {
    render(<ProductDialog product={{ ...product, embed_html: null }} onClose={() => {}} />);
    expect(screen.getByRole("img", { name: product.name })).toHaveAttribute("src", "/cover.jpg");
    expect(screen.queryByRole("button", { name: "Video önizlemesi" })).not.toBeInTheDocument();
  });
});