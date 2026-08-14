/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        verde: {
          principal: "#159447",
          oscuro: "#087A38",
          profundo: "#075B2B",
          brillante: "#65C91A",
          lima: "#A7D92B",
        },
        grisclaro: "#F4F7F4",
        gristexto: "#374151",
        negrosuave: "#111827",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
