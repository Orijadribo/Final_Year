/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/index.html",
    "./pages/admin/*.{html,js}",
    "./pages/student/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Nunito Sans", "Open Sans", "Poppins"],
      },
    },
  },
  plugins: [],
};

