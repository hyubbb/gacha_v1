/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      height: {
        'real-screen': 'calc(var(--vh) * 100)',
        'appbar-size': 'var(--appBar-height)',
        'appbar-size-lg': 'var(--appBar-height-lg)'
      },
      minHeight: {
        'real-screen': 'calc(var(--vh) * 100)',
        'appbar-size': 'var(--appBar-height)',
        'appbar-size-lg': 'var(--appBar-height-lg)'
      },
      maxHeight: {
        'real-screen': 'calc(var(--vh) * 100)',
        'appbar-size': 'var(--appBar-height)',
        'appbar-size-lg': 'var(--appBar-height-lg)'
      },
      padding: {
        'appbar-size': 'var(--appbar-height)',
        'appbar-size-lg': 'var(--appbar-height-lg)'
      }
    },
    screens: {
      xs: '375px',
      sm: '390px',
      md: '412px',
      lg: '820px',
      xl: '960px',
      xxl: '1180px',
      '3xl': '1920px'
    },
    container: {
      padding: {
        DEFAULT: '20px',
        xs: '20px',
        sm: '20px',
        md: '20px',
        lg: '24px',
        xl: '24px'
      }
    },
    minHeight: {
      'real-screen': 'calc(var(--vh) * 100)',
      'appbar-size': 'var(--appbar-height)',
      'appbar-size-lg': 'var(--appbar-height-lg)'
    },
    maxHeight: {
      'appbar-size': 'var(--appbar-height)',
      'appbar-size-lg': 'var(--appbar-height-lg)'
    }
  },
  plugins: [require('tailwindcss-animate')]
};
