/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@progress/kendo-react-*/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // tailwind blue-500
        secondary: "#64748b", // slate-500
      },
    },
  },
  plugins: [],
};
