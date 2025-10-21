/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors, // keep default palette

        // pastel tokens you can use as classes: bg-background, text-text, bg-surface, from-primary, etc.
        primary: "#cdb4db", // lavender
        secondary: "#ffc8dd", // baby pink
        tertiary: "#a2d2ff", // baby blue

        background: "#f8f6ff", // page background
        surface: "#f3f0fa", // card / container
        text: "#2b2b2b",
        subtle: "#6b6b6b",
        border: "#e0d7f3",

        success: "#bde0fe",
        warning: "#ffe5ec",
        error: "#ffafcc",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
