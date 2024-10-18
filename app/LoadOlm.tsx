"use client";
import React, { useEffect, useState } from "react";

export default function LoadOlm({ children }: any) {
  const [olmLoaded, setOlmLoaded] = useState(false);

  useEffect(() => {
    const loadOlm = async () => {
      if (typeof window !== "undefined") {
        const script = document.createElement("script");
        script.src = "/scripts/matrix-libolm/olm.js";
        script.onload = () => setOlmLoaded(true);
        script.onerror = () => console.error("Failed to load Olm.js");
        document.body.appendChild(script);
      }
    };

    loadOlm();
  }, []);

  if (!olmLoaded) return <>Loading</>;

  return <>{children}</>;
}
