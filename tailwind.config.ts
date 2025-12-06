import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
      },
      colors: {
        "findaly-bg": "#eceae3",
        "findaly-blue": "#a0c4ff",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
