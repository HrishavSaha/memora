/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F4EF',
        'cream-dark': '#F3E8D6',
        peach: '#F6E1CC',
        'peach-dark': '#E8B98D',
        teal: '#70C3BB',
        'teal-dark': '#125D7A',
        navy: '#4A5A8C',
        text: '#2A2420',
        'text-light': '#4A4038',
        'mascot-red': '#B5502F',
        'mascot-maroon': '#5A3161',
        'mascot-brown': '#8A5A2E'
      },
      fontFamily: {
        body: ['Inter', 'Segoe UI', 'sans-serif'],
        serif: ['Lora', 'serif'],
        head: ['Quicksand', 'Segoe UI Rounded', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
