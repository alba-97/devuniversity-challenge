/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable dark mode with class-based toggling
  theme: {
    extend: {
      colors: {
        // Custom color palette with dark mode variants
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          // Dark mode variants
          'dark-50': '#1e293b',
          'dark-100': '#334155',
          'dark-200': '#475569',
          'dark-300': '#64748b',
          'dark-400': '#94a3b8',
          'dark-500': '#cbd5e1',
          'dark-600': '#e2e8f0',
          'dark-700': '#f1f5f9',
          'dark-800': '#f8fafc',
          'dark-900': '#ffffff',
        },
        background: {
          light: '#f4f4f5',
          dark: '#0f172a',
        },
        text: {
          light: '#18181b',
          dark: '#f4f4f5',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#18181b',
            a: {
              color: '#0369a1',
              '&:hover': {
                color: '#075985',
              },
            },
          },
        },
        dark: {
          css: {
            color: '#f4f4f5',
            a: {
              color: '#38bdf8',
              '&:hover': {
                color: '#7dd3fc',
              },
            },
          },
        },
      },
      boxShadow: {
        'light-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'dark-md': '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional: for more styled form elements
    require('@tailwindcss/typography'), // Optional: for rich text styling
  ],
};
