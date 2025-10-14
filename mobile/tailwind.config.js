/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/context/**/*.{js,jsx,ts,tsx}",],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ☀️ Light mode
        bgDark: "#ebebeb",
        bg: "#f5f5f5",
        bgLight: "#ffffff",
        text: "#262626",
        textMuted: "#676767",
        highlight: "#ffffff",
        border: "#999999",
        borderMuted: "#b0b0b0",
        primary: "#6d85ff",
        secondary: "#6d85d9",
        danger: "#cc3c3c",
        warning: "#d9a033",
        success: "#50a856",
        info: "#449ad9",

        // 🌙 Dark mode overrides
        dark: {
          "bg-dark": "#181818",      // oklch(0.1 0.015 41)
          bg: "#202020",             // oklch(0.15 0.015 41)
          "bg-light": "#2b2b2b",     // oklch(0.2 0.015 41)
          text: "#f5f5f5",           // oklch(0.96 0.03 41)
          "text-muted": "#c4c4c4",   // oklch(0.76 0.03 41)
          highlight: "#7f7f7f",      // oklch(0.5 0.03 41)
          border: "#676767",         // oklch(0.4 0.03 41)
          "border-muted": "#4c4c4c", // oklch(0.3 0.03 41)
          primary: "#a68cff",        // oklch(0.76 0.1 41)
          secondary: "#7ec3ff",      // oklch(0.76 0.1 221)
          danger: "#e06a5f",         // oklch(0.7 0.05 30)
          warning: "#e3b14d",        // oklch(0.7 0.05 100)
          success: "#69c374",        // oklch(0.7 0.05 160)
          info: "#5cb6e3",           // oklch(0.7 0.05 260)
        },
      },
    },
  },
  plugins: [],
};
