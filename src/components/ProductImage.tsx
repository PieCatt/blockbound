import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const ProductImage = ({ src, alt, className }: ProductImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary to-accent/20 overflow-hidden">
          <div className="absolute inset-0 pixel-grid opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-primary rounded-2xl shadow-glow animate-float opacity-90" />
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-all duration-700",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </>
  );
};

export default ProductImage;
