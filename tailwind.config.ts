import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#06080f",
        surface: "#0d1119",
        electric: "#4d82ff",
        "electric-glow": "#7aa3ff",
        warm: "#c9a84c",
        teal: "#00d4c0",
        text: {
          DEFAULT: "#edf0f7",
          dim: "#8895aa",
        },
        border: "rgba(237,240,247,0.10)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        elastic: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
