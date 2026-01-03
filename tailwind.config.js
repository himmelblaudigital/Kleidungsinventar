/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1b5e20', // Dunkelgrün
          light: '#a5d6a7',   // Hellgrün für Text
          bg: '#e8f5e9',      // Sehr hellgrün für Hintergrund
        },
        secondary: {
          DEFAULT: '#a5d6a7', // Hellgrün
          dark: '#1b5e20',    // Dunkelgrün für Border
        },
        accent: '#66bb6a',
        error: '#ef4444',
        success: '#2e7d32',
        warning: '#f59e0b',
        background: '#f1f8f4', // Hellgrüner Seitenhintergrund
      },
    },
  },
  plugins: [],
}
