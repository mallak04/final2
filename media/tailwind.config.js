/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,

        // Dark theme colors - soft developer-friendly palette
        dark: {
          bg: "#1c1e20",         // soft charcoal background
          surface: "#252729",     // card/panel background
          elevated: "#2d2f31",    // elevated elements
          border: "#3a3c3e",      // borders
        },

        // Muted teal/cyan/green accents
        accent: {
          teal: "#4db8a8",        // muted teal
          cyan: "#5ec5d4",        // soft cyan
          green: "#66c9a4",       // soft green
          purple: "#a78bfa",      // soft purple for variety
        },

        // Text colors
        text: {
          primary: "#e4e4e7",     // light gray text
          secondary: "#a1a1aa",   // muted gray
          tertiary: "#71717a",    // subtle gray
        },

        // Legacy pastel colors (kept for backward compatibility if needed)
        primary: "#cdb4db",
        secondary: "#ffc8dd",
        tertiary: "#a2d2ff",
        background: "#f8f6ff",
        surface: "#f3f0fa",
        subtle: "#6b6b6b",
        border: "#e0d7f3",
        success: "#bde0fe",
        warning: "#ffe5ec",
        error: "#ffafcc",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
        mono: ["Fira Code", "Monaco", "Courier New", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        glow: "0 0 20px rgba(77, 184, 168, 0.15)",
        glowHover: "0 0 30px rgba(77, 184, 168, 0.25)",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(77, 184, 168, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(77, 184, 168, 0.3)' },
        },
      },
    },
  },
  plugins: [],
};
