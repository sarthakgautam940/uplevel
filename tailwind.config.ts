import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        bg: "#0C0B0B",
        surface: {
          1: "#111010",
          2: "#161514",
          3: "#1C1A19",
        },
        accent: {
          DEFAULT: "#C9A87C",
          light: "#E8CEA6",
          dim: "rgba(201,168,124,0.12)",
        },
        stone: "#D4C4B0",
        text: {
          primary: "#F5F0E8",
          secondary: "#6B635A",
          dim: "#2C2825",
        },
      },
      letterSpacing: {
        widest: "0.4em",
        wider: "0.22em",
        wide: "0.16em",
        logo: "0.2em",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
