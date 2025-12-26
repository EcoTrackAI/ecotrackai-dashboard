import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        card: "#FFFFFF",
        primary: "#6366F1",
        secondary: "#16A34A",
        warning: "#FB923C",
        error: "#DC2626",
        textPrimary: "#111827",
        textMuted: "#6B7280",
        border: "#E5E7EB",
      },
    },
  },
  plugins: [],
};

export default config;
