/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8b5cf6",
        secondary: "#06b6d4",
        success: "#10b981",
        canvas: "#020205",
        surface: "#0a0a0f",
        muted: "#64748b",
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
