/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amoled: '#000000',
        discord: {
          primary: '#5865F2',
          danger: '#ED4245',
          dark: '#0a0a0a',
          darker: '#000000',
          gray: {
            900: '#0a0a0a',
            800: '#141414',
            700: '#1f1f1f',
          }
        },
      },
      spacing: {
        '18': '4.5rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      backgroundImage: {
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
