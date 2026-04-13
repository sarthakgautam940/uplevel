"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const SiteNav = dynamic(() => import("./SiteNav"), { ssr: false });
const PageTransitionOverlay = dynamic(() => import("./PageTransitionOverlay"), { ssr: false });
const ScrollProgress = dynamic(() => import("./ScrollProgress"), { ssr: false });
const ClientShell = dynamic(() => import("./ClientShell"), { ssr: false });

export default function GlobalChrome() {
  useEffect(() => {
    const w = window as typeof window & {
      __UPLEVEL_INITIAL_PATH__?: string;
      __UPLEVEL_HOME_INTRO_ACTIVE__?: boolean;
    };

    if (!w.__UPLEVEL_INITIAL_PATH__) {
      w.__UPLEVEL_INITIAL_PATH__ = window.location.pathname;
    }

    if (typeof w.__UPLEVEL_HOME_INTRO_ACTIVE__ !== "boolean") {
      w.__UPLEVEL_HOME_INTRO_ACTIVE__ = w.__UPLEVEL_INITIAL_PATH__ === "/";
    }
  }, []);

  return (
    <>
      <SiteNav />
      <PageTransitionOverlay />
      <ScrollProgress />
      <ClientShell />
    </>
  );
}
