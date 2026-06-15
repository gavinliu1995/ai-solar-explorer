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
    const loader = new TextureLoader();
    const loadedTexture = loader.load(
      path,
      (nextTexture) => {
        nextTexture.colorSpace = SRGBColorSpace;
        nextTexture.minFilter = LinearFilter;
        nextTexture.magFilter = LinearFilter;
        nextTexture.wrapS = ClampToEdgeWrapping;
        nextTexture.wrapT = ClampToEdgeWrapping;
        nextTexture.needsUpdate = true;

        if (isMounted) setTexture(nextTexture);
      },
      undefined,
      () => {
        if (isMounted) setTexture(null);
      },
    );

    return () => {
      isMounted = false;
      loadedTexture.dispose();
    };
  }, [path]);

  return texture;
}
