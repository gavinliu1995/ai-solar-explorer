"use client";

import { useEffect, useState } from "react";
import {
  ClampToEdgeWrapping,
  LinearFilter,
  SRGBColorSpace,
  TextureLoader,
} from "three";
import type { Texture } from "three";

export const USE_LOCAL_TEXTURES = true;

export function useOptionalTexture(path: string) {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    if (!USE_LOCAL_TEXTURES || !path) {
      return;
    }

    let isMounted = true;
    let loadedTexture: Texture | null = null;
    const controller = new AbortController();

    async function loadTextureIfAvailable() {
      try {
        const response = await fetch(path, {
          method: "HEAD",
          signal: controller.signal,
        });

        if (!response.ok) {
          if (isMounted) setTexture(null);
          return;
        }
      } catch {
        if (isMounted) setTexture(null);
        return;
      }

      if (!isMounted) return;

      const loader = new TextureLoader();
      loadedTexture = loader.load(
        path,
        (nextTexture) => {
          if (!isMounted) return;

          nextTexture.colorSpace = SRGBColorSpace;
          nextTexture.minFilter = LinearFilter;
          nextTexture.magFilter = LinearFilter;
          nextTexture.wrapS = ClampToEdgeWrapping;
          nextTexture.wrapT = ClampToEdgeWrapping;
          nextTexture.needsUpdate = true;

          setTexture(nextTexture);
        },
        undefined,
        () => {
          if (isMounted) setTexture(null);
        },
      );
    }

    void loadTextureIfAvailable();

    return () => {
      isMounted = false;
      controller.abort();
      loadedTexture?.dispose();
    };
  }, [path]);

  return texture;
}
