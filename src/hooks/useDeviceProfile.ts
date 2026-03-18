"use client";

import { useEffect, useState } from "react";

export function useDeviceProfile() {
  const [profile, setProfile] = useState({
    isTouch: false,
    isMobile: false,
    isReducedMotion: false,
  });

  useEffect(() => {
    setProfile({
      isTouch: window.matchMedia("(pointer: coarse)").matches,
      isMobile: window.innerWidth < 768,
      isReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  return profile;
}
