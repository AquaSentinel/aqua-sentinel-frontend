/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // <-- REQUIRED for the toggle to work
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.25rem",
          md: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "3rem",
        },
      },
      // optional, nice defaults for smoother transitions
      transitionTimingFunction: {
        "in-out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        glass: "0 10px 30px -12px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),       // optional but improves inputs
    require("@tailwindcss/typography"),  // optional but improves text
  ],
}
