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
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: {
          10: 'hsl(var(--surface-10))',
          15: 'hsl(var(--surface-15))',
          20: 'hsl(var(--surface-20))',
          30: 'hsl(var(--surface-30))',
          40: 'hsl(var(--surface-40))',
          50: 'hsl(var(--surface-50))'
        },
        natural: {
          10: 'hsl(var(--natural-10))',
          20: 'hsl(var(--natural-20))',
          30: 'hsl(var(--natural-30))',
          40: 'hsl(var(--natural-40))',
          50: 'hsl(var(--natural-50))'
        },
        primary: {
          10: 'hsl(var(--primary-10))',
          20: 'hsl(var(--primary-20))',
          30: 'hsl(var(--primary-30))',
          40: 'hsl(var(--primary-40))',
          50: 'hsl(var(--primary-50))',
          60: 'hsl(var(--primary-60))',
          70: 'hsl(var(--primary-70))'
        },
        accent: {
          10: 'hsl(var(--accent-10))',
          20: 'hsl(var(--accent-20))',
          30: 'hsl(var(--accent-30))',
          40: 'hsl(var(--accent-40))',
          50: 'hsl(var(--accent-50))',
          60: 'hsl(var(--accent-60))'
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))'
        },
        success: {
          DEFAULT: 'hsl(var(--success))'
        },
        info: 'hsl(var(--info))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        normal: {
          DEFAULT: 'hsl(var(--primary-50))'
        },
        solver: {
          DEFAULT: 'hsl(var(--accent-10))'
        },
        tool: {
          DEFAULT: 'hsl(var(--info))'
        }
      },
      backgroundImage: {
        'custom-gradient':
          'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFF 100%)',
        'fade-to-black':
          'linear-gradient(180deg, rgba(18, 18, 18, 0.00) 0%, #121212 100%)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        xs: '2px 2px 4px 0px rgba(193, 200, 213, 0.25)',
        sm: '4px 4px 4px 0px rgba(193, 200, 213, 0.30)',
        md: '8px 8px 10px 0px rgba(193, 200, 213, 0.40);'
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
  plugins: [require('tailwindcss-animate')],
  layers: {
    components: [
      'container-default',
      'fixed-center-layout',
      'text-tm-bol',
      'text-tm-md',
      'text-tm-reg',
      'text-ts-bol',
      'text-ts-md',
      'text-ts-reg',
      'text-bl-bol',
      'text-bl-md',
      'text-bl-reg',
      'text-bm-bol',
      'text-bm-md',
      'text-bm-reg',
      'text-bs-bol',
      'text-bs-md',
      'text-bs-reg',
      'text-btnL-bol',
      'text-btnL-md',
      'text-btnL-reg',
      'text-btnM-bol',
      'text-btnM-md',
      'text-btnM-reg',
      'text-cap-bol',
      'text-cap-md',
      'text-cap-reg'
    ]
  },
  safelist: [
    'bg-primary-30/10',
    'border-info',
    {
      pattern:
        /(bg|text|border)-(surface|natural|primary|accent|danger|warning|success|info)-(10|15|20|30|40|50|60|70)(\/[0-9]+)?/
    }
  ]
};
