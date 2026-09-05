/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          DEFAULT: '#0D3B4F',
          deep: '#082733',
          dark: '#082733',
          light: '#9BB6BE',
        },
        gold: {
          DEFAULT: '#C68A3D',
          light: '#E4B368',
          dark: '#B67B30',
        },
        amber: {
          DEFAULT: '#C68A3D',
          light: '#E4B368',
          dark: '#B67B30',
        },
        ink: '#16262D',
        muted: '#52666D',
        faint: '#7C8D93',
        line: '#E4EAEA',
        mist: '#EEF3F3',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
