"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 450,
  priority = false,
  className = "",
  placeholder = "empty",
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true);

  // Handle external URLs
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={`duration-700 ease-in-out ${
            isLoading ? "scale-110 blur-2xl" : "scale-100 blur-0"
          }`}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
    );
  }

  // Handle local images
  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`duration-700 ease-in-out ${
          isLoading ? "scale-110 blur-2xl" : "scale-100 blur-0"
        }`}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
}