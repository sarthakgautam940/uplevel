type Props = {
  items?: string[];
  speed?: "normal" | "slow";
  className?: string;
  dark?: boolean;
};

const DEFAULT_ITEMS = [
  "Premium Digital Experiences",
  "Applied AI Intelligence",
  "14-Day Builds",
  "Luxury Service Businesses",
  "Core Web Vitals 98%",
  "No Templates",
  "Award-Winning Design",
  "Virginia LLC",
];

export default function MarqueeStrip({
  items = DEFAULT_ITEMS,
  speed = "normal",
  className = "",
  dark = true,
}: Props) {
  const repeated = [...items, ...items];
  const duration = speed === "slow" ? "40s" : "28s";

  return (
    <div
      className={`overflow-hidden border-y ${
        dark
          ? "border-[var(--border)] bg-[var(--void)]"
          : "border-[rgba(6,8,15,0.1)] bg-[var(--text)]"
      } py-[14px] ${className}`}
      aria-hidden="true"
    >
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: `marquee ${duration} linear infinite`,
          willChange: "transform",
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: dark
                ? "rgba(237,240,247,0.22)"
                : "rgba(6,8,15,0.35)",
              paddingLeft: "2.4rem",
              paddingRight: "2.4rem",
              flexShrink: 0,
            }}
          >
            {item}
            <span
              style={{
                display: "inline-block",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: dark
                  ? "rgba(36,97,232,0.5)"
                  : "rgba(36,97,232,0.4)",
                verticalAlign: "middle",
                margin: "0 2rem 0 0",
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
