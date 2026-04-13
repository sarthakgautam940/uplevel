"use client";

import { useState } from "react";

type FAQItem = { q: string; a: string };

export default function FAQAccordion({ items }: { items: readonly FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <dl className="border-t border-[var(--border)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="group border-b border-[var(--border)]">
            <dt>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
                style={{ cursor: "none" }}
              >
                <span
                  className={[
                    "font-display font-medium tracking-[-0.015em] transition-colors duration-250",
                    isOpen ? "text-[var(--text)]" : "text-[var(--text-dim)] group-hover:text-[var(--text)]",
                  ].join(" ")}
                  style={{ fontSize: "clamp(1rem,1.6vw,1.25rem)" }}
                >
                  {item.q}
                </span>
                <span
                  className={[
                    "shrink-0 font-body text-[1.25rem] leading-none transition-all duration-300",
                    isOpen
                      ? "text-[var(--electric)]"
                      : "text-[var(--text-dim)] group-hover:text-[var(--electric)]",
                  ].join(" ")}
                  style={{
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </dt>
            <dd
              className="grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <p className="max-w-[56ch] pb-7 font-body text-[15px] leading-[1.72] text-[var(--text-dim)]">
                  {item.a}
                </p>
              </div>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
