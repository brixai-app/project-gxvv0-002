export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#FFFFFF',
          surface: '#F6F8FB',
          'surface-hover': '#EEF2F7',
          border: '#B0B8C1',
          primary: '#0B1220',
          muted: '#4B5563',
          accent: '#003366',
          'accent-hover': '#0A3E7A',
          'accent-text': '#ffffff',
        },
        bg: '#FFFFFF',
        surface: '#F6F8FB',
        'surface-hover': '#EEF2F7',
        accent: '#003366',
        'accent-hover': '#0A3E7A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'sans-serif'],
      },
      borderRadius: {
        theme: '14px',
      },
    },
  },
  plugins: [],
};