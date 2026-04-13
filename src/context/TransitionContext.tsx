"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

/* ── Types ──────────────────────────────────────────────────────────── */
type Ctx = {
  pendingHref: string | null;
  setPendingHref: (href: string | null) => void;
};

/* ── Context ────────────────────────────────────────────────────────── */
const TransitionContext = createContext<Ctx>({
  pendingHref: null,
  setPendingHref: () => {},
});

export function useTransitionCtx(): Ctx {
  return useContext(TransitionContext);
}

/* ── Provider ───────────────────────────────────────────────────────── */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  return (
    <TransitionContext.Provider value={{ pendingHref, setPendingHref }}>
      {children}
    </TransitionContext.Provider>
  );
}
