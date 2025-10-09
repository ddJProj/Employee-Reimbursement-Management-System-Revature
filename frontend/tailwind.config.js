/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // primary colors
        // use with: className="bg-primary-500"
        // for active: className={isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-700'}
        primary: {
          50: '#2196f3',
          100: '#2196f3',
          200: '#2196f3',
          300: '#2196f3',
          400: '#2196f3',
          500: '#2196f3',  // main primary
          600: '#2196f3',
          700: '#2196f3',
          800: '#2196f3',
          900: '#2196f3',
        },
        // secondary colors
        secondary: {
          50: '#9c27b0',
          100: '#9c27b0',
          200: '#9c27b0',
          300: '#9c27b0',
          400: '#9c27b0',
          500: '#9c27b0',  // main secondary
          600: '#9c27b0',
          700: '#9c27b0',
          800: '#9c27b0',
          900: '#9c27b0',
        },
        // semantic colors
        success: {
          50: '#4caf50',
          100: '#4caf50',
          500: '#4caf50',  // main success 
          700: '#4caf50',
          900: '#4caf50',
        },
        warning: {
          50: '#ff9800',
          100: '#ff9800',
          500: '#ff9800',  // main warning
          700: '#ff9800',
          900: '#ff9800',
        },
        error: {
          50: '#fff3e0',
          100: '#f44336',
          500: '#f44336',  // main error 
          700: '#f44336',
          900: '#f44336',
        },
        info: {
          50: '#03a9f4',
          100: '#03a9f4',
          500: '#03a9f4',  // main info
          700: '#03a9f4',
          900: '#03a9f4',
        },
      },
      // consistent spacing for layout 
      spacing: {
        'drawer': '240px',  // set drawer width here instead of in sidenavbar, etc
      },
    },
  },  plugins: [],
}
