/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/*.{js,ts,tsx,jsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // Use a standard relative string path inside url() instead of an import
        'dashboard-bg': "url('../../src/static/images/bg_1.jpg')",
        'homepage-bg': "url('../../src/static/images/homepage.jpg')", 
        'auth-bg': "url('../../src/static/images/auth_bg.jpg')",
        'auth-bg2': "url('../../src/static/images/auth_bg2.jpg')",
      },
      colors: {
        'accent-color': 'rgb(153, 69, 248)',
      },
    },
  },
  plugins: [],
};
