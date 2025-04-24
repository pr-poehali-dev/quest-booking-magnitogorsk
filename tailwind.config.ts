import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
			"./1745492141505274949.html"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
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
				},
				yellow: {
					DEFAULT: '#f1c40f',
                    bright: '#FFDD00',
                    neon: '#FFFF00'
				},
				orange: {
					DEFAULT: '#e67e22',
                    bright: '#FF8C00',
                    neon: '#FFA500'
				},
				black: {
					DEFAULT: '#000000'
				},
				brick: {
					DEFAULT: '#8B0000',
                    dark: '#5B0000'
				},
                toxic: {
                    DEFAULT: '#39FF14',
                    dark: '#32CD32'
                },
                gold: {
                    DEFAULT: '#FFD700',
                    light: '#FFF8DC',
                    dark: '#B8860B'
                }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                pulse: {
                    '0%, 100%': { 
                        opacity: '1',
                        transform: 'scale(1)'
                    },
                    '50%': { 
                        opacity: '0.85',
                        transform: 'scale(1.05)'
                    }
                },
                glow: {
                    '0%, 100%': { 
                        boxShadow: '0 0 15px rgba(241, 196, 15, 0.7)'
                    },
                    '50%': { 
                        boxShadow: '0 0 30px rgba(241, 196, 15, 0.9)'
                    }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s infinite alternate'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
