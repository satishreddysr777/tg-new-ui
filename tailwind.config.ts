import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--paper)",
          2: "var(--paper-2)",
          3: "var(--paper-3)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          2: "var(--ink-2)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          2: "var(--muted-2)",
        },
        copper: {
          DEFAULT: "var(--copper)",
          deep: "var(--copper-deep)",
          soft: "var(--copper-soft)",
        },
        cream: "var(--cream)",
        line: {
          DEFAULT: "var(--line)",
          2: "var(--line-2)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "var(--r-sm)",
        DEFAULT: "var(--r)",
        lg: "var(--r-lg)",
        pill: "var(--r-pill)",
      },
      maxWidth: {
        wrap: "var(--maxw)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        float: "var(--shadow-float)",
        hover: "var(--shadow-hover)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
