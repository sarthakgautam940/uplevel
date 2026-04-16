import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-[var(--text)]">
      <h1 className="font-display text-4xl">Terms of Service</h1>
      <p className="mt-6 font-body text-[var(--text-dim)]">
        This page defines engagement terms, payment structure, delivery boundaries, and operating expectations
        for UpLevel Services projects.
      </p>
    </main>
  );
}
