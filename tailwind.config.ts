import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // App Router pages
    "./components/**/*.{js,ts,jsx,tsx}", // UI components
  ],
  theme: {
    fontFamily: {
      manrope: "var(--font-manrope)",
    },
  },
  plugins: [],
};

export default config;
