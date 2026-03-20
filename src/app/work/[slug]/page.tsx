import { B } from "../../../../lib/brand";
export function generateStaticParams() { return B.work.map(w => ({ slug: w.slug })); }
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = B.work.find(w => w.slug === slug) || B.work[0];
  return (
    <main style={{ background: "var(--ink)", minHeight: "100vh", padding: "clamp(80px,12vw,140px) clamp(20px,4vw,64px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <a href="/work" style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 40 }}>← Back to Work</a>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>{w.tier}</div>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 800, fontSize: "clamp(40px,7vw,96px)", lineHeight: 0.92, letterSpacing: "-0.03em", color: "#fff", marginBottom: 24 }}>{w.title}</h1>
        <p style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: "clamp(14px,1.3vw,16px)", lineHeight: 1.75, color: "var(--white-2)", maxWidth: 600 }}>{w.story}</p>
        <div style={{ marginTop: 40 }}>
          <a href="/contact" className="btn btn-gold" style={{ fontSize: 9 }} data-cursor="">Start a Similar Project →</a>
        </div>
      </div>
    </main>
  );
}
