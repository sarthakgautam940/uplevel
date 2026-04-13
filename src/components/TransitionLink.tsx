"use client";

import { type ReactNode, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useTransitionCtx } from "@/context/TransitionContext";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
  target?: string;
  rel?: string;
};

function normalizePath(value: string) {
  const clean = value.split("?")[0].split("#")[0];
  if (clean === "/") return "/";
  return clean.replace(/\/+$/, "");
}

/**
 * Drop-in replacement for <a> on internal routes.
 * Intercepts clicks, plays the page transition overlay, then navigates.
 * Falls through to a plain <a> for external URLs, mailto:, and hash anchors.
 */
export default function TransitionLink({
  href,
  children,
  className,
  onClick,
  "aria-label": ariaLabel,
  target,
  rel,
}: Props) {
  const { setPendingHref } = useTransitionCtx();
  const pathname = usePathname();

  // Internal page route: starts with "/" but NOT "/#" (hash anchor)
  const isInternalRoute =
    href.startsWith("/") &&
    !href.startsWith("/#") &&
    !href.startsWith("//");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isInternalRoute) return;
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    onClick?.();

    if (normalizePath(pathname) === normalizePath(href)) return;
    setPendingHref(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
}
