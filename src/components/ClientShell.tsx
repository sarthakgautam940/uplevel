"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const ScrollUnlock = dynamic(() => import("./ScrollUnlock"), { ssr: false });
const NoiseOverlay = dynamic(() => import("./NoiseOverlay"), { ssr: false });
const VapiWidget = dynamic(() => import("./VapiWidget"), { ssr: false });

/**
 * Global client overlays — minimal surface for performance and spec compliance.
 */
export default function ClientShell() {
  return (
    <>
      <NoiseOverlay />
      <CustomCursor />
      <ScrollUnlock />
      <VapiWidget />
    </>
  );
}
