"use client";

import { useState, type ReactNode } from "react";
import { ProductVisual } from "@/components/ProductVisual";
import type { Shape, Tone } from "@/lib/types";

type Props = {
  product: { id: number; name: string; brand: string; images: string[]; shape: Shape; tone: Tone };
  badges?: ReactNode;
};

export function Gallery({ product, badges }: Props) {
  const [index, setIndex] = useState(0);
  return (
    <div className="gallery">
      <div className={`gallery-stage tone-${product.tone}`}>
        <div className="card-badges" style={{ top: 18, left: 18 }}>{badges}</div>
        <ProductVisual product={product} index={index} eager />
      </div>
      {product.images.length > 1 && (
        <div className="thumbs">
          {product.images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`thumb tone-${product.tone} ${i === index ? "on" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`${product.name} ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
