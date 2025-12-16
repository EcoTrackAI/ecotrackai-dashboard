import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        // Default breakpoints are:
        // sm: '640px'
        // md: '768px'
        // lg: '1024px'
        // xl: '1280px'
        // 2xl: '1536px'
      },
    },
  },
  plugins: [],
};

export default config;
