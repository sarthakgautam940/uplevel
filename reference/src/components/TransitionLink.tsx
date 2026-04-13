"use client";

import { type ReactNode, type MouseEvent } from "react";
import { useTransitionCtx } from "../context/TransitionContext";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
  target?: string;
  rel?: string;
};

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

  // Internal page route: starts with "/" but NOT "/#" (hash anchor)
  const isInternalRoute =
    href.startsWith("/") &&
    !href.startsWith("/#") &&
    !href.startsWith("//");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isInternalRoute) return;
    e.preventDefault();
    onClick?.();
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
