module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#165DFF',
        secondary: '#0FC6C2',
        success: '#00B42A',
        warning: '#FF7D00',
        danger: '#F53F3F',
        dark: '#1D2129',
        'dark-2': '#4E5969',
        'dark-3': '#86909C',
        'light-1': '#F2F3F5',
        'light-2': '#F7F8FA',
        'light-3': '#FFFFFF',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      opacity: {
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
      }
    },
  },
  plugins: [],
}