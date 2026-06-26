import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3525cd",
        "primary-container": "#4f46e5",
        secondary: "#006c49",
        background: "#f7f9fb",
        surface: "#FFFFFF",
        "surface-container-low": "#f2f4f6",
        "dark-bg": "#0F172A",
        "dark-surface": "#1E293B",
        "text-main": "#0F172A",
        "text-muted": "#64748B",
        "border-subtle": "#E2E8F0",
        tertiary: "#684000",
        "tertiary-fixed-dim": "#ffb95f",
        "on-surface": "#191c1e",
        "on-surface-variant": "#464555",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "container-max": "1280px",
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "48px",
        gutter: "24px",
      },
      boxShadow: {
        ambient: "0px 4px 20px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        nestify: {
          primary: "#3525cd",
          secondary: "#006c49",
          accent: "#4f46e5",
          neutral: "#191c1e",
          "base-100": "#f7f9fb",
          "base-200": "#eceef0",
          "base-300": "#E2E8F0",
          info: "#3525cd",
          success: "#006c49",
          warning: "#ffb95f",
          error: "#ba1a1a",
        },
      },
    ],
    darkTheme: "dark",
  },
};
