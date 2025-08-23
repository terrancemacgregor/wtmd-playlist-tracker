/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wtmd-teal': '#02383b',
        'wtmd-orange': '#f8951d',
        'wtmd-light-teal': '#0a5458',
      },
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}