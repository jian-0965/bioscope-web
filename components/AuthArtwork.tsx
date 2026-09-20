"use client";

import { useEffect, useState } from "react";

const PARTS = [
  "/auth/hero-1.txt",
  "/auth/hero-2.txt",
  "/auth/hero-3.txt",
];

export default function AuthArtwork() {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all(
      PARTS.map(async (path) => {
        const response = await fetch(path, { cache: "force-cache" });
        if (!response.ok) {
          throw new Error("Failed to load auth artwork part");
        }
        return (await response.text()).trim();
      }),
    )
      .then((parts) => {
        if (active) {
          setSrc("data:image/webp;base64," + parts.join(""));
        }
      })
      .catch(() => {
        if (active) setSrc("");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="auth-artwork-layer" aria-hidden="true">
      {src ? (
        <img className="auth-artwork-image" src={src} alt="" />
      ) : (
        <div className="auth-artwork-loading" />
      )}
    </div>
  );
}
