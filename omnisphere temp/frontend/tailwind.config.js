/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // ← ADD THIS LINE
  theme: {
    extend: {},
  },
  plugins: [],
}
