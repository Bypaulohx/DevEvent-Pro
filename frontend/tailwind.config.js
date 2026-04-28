/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(99, 102, 241, 0.35), 0 10px 40px rgba(99, 102, 241, 0.18)"
      }
    }
  },
  plugins: []
};

