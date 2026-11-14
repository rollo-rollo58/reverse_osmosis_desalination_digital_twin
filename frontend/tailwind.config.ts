import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: { 950: "#071723", 900: "#0b2030", 800: "#18354a" },
        aqua: { 500: "#00cba9", 300: "#6fffe0", 100: "#ccfff4" },
        brine: { 500: "#f59e65" }
      },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] }
    }
  },
  plugins: []
};

export default config;
