/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
		primary: {
			DEFAULT: 'rgb(var(--primary))',
			foreground: 'rgb(var(--primary-foreground))'
		},
		secondary: {
			DEFAULT: 'rgb(var(--secondary))',
			foreground: 'rgb(var(--secondary-foreground))'
		},
		accent: {
			DEFAULT: 'rgb(var(--accent))',
			foreground: 'rgb(var(--accent-foreground))'
		},
		background: 'rgb(var(--background))',
		foreground: 'rgb(var(--foreground))',
		card: {
			DEFAULT: 'rgb(var(--card))',
			foreground: 'rgb(var(--card-foreground))'
		},
		border: 'rgb(var(--border))',
		input: 'rgb(var(--input))',
		ring: 'rgb(var(--ring))',
		muted: {
			DEFAULT: 'rgb(var(--muted))',
			foreground: 'rgb(var(--muted-foreground))'
		},
		popover: {
			DEFAULT: 'rgb(var(--popover))',
			foreground: 'rgb(var(--popover-foreground))'
		},
			'mint-green': 'rgb(var(--mint-green))',
			'pale-lavender': 'rgb(var(--pale-lavender))',
			'light-pink': 'rgb(var(--light-pink))',
			'pastel-yellow': 'rgb(var(--pastel-yellow))',
			'light-mint': 'rgb(var(--light-mint))',
			'light-purple': 'rgb(var(--light-purple))',
			'cream-yellow': 'rgb(var(--cream-yellow))',
			'mint-tint': 'rgb(var(--mint-tint))',
			'pale-lavender-bg': 'rgb(var(--pale-lavender-bg))',
			'primary-bg': 'rgb(var(--primary-bg))',
			'text-primary': 'rgb(var(--text-primary))',
			'text-secondary': 'rgb(var(--text-secondary))',
			'text-tertiary': 'rgb(var(--text-tertiary))',
			'success': {
				DEFAULT: 'rgb(var(--success))',
				foreground: 'rgb(var(--success-foreground))'
			},
			'warning': {
				DEFAULT: 'rgb(var(--warning))',
				foreground: 'rgb(var(--warning-foreground))'
			},
			'error': {
				DEFAULT: 'rgb(var(--error))',
				foreground: 'rgb(var(--error-foreground))'
			},
			'info': {
				DEFAULT: 'rgb(var(--info))',
				foreground: 'rgb(var(--info-foreground))'
			},
			'auth-bg': 'rgb(var(--auth-bg))',
			'auth-card': 'rgb(var(--auth-card))',
			'auth-border': 'rgb(var(--auth-border))',
			'auth-input': 'rgb(var(--auth-input))',
			'auth-focus': 'rgb(var(--auth-focus))'
		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'Poppins',
  				'Nunito',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'2xl': '1rem',
  			'3xl': '1.5rem'
  		},
  		boxShadow: {
  			card: '0 2px 8px rgba(0, 0, 0, 0.06)',
  			'card-hover': '0 4px 16px rgba(0, 0, 0, 0.1)'
  		},
		animation: {
			'fade-in': 'fadeIn 0.4s ease-out',
			'fade-in-up': 'fadeInUp 0.4s ease-out',
			'fade-in-down': 'fadeInDown 0.4s ease-out',
			'slide-in-left': 'slideInLeft 0.3s ease-out',
			'slide-in-right': 'slideInRight 0.3s ease-out',
			'scale-in': 'scaleIn 0.2s ease-out',
			'bounce-in': 'bounceIn 0.6s ease-out',
			stagger: 'fadeInUp 0.4s ease-out',
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			'spin': 'spin 1s linear infinite'
		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			fadeInUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			fadeInDown: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(-20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideInLeft: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(-20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			slideInRight: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			bounceIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.3)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'scale(1.05)'
  				},
  				'70%': {
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
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
					opacity: '1'
				},
				'50%': {
					opacity: '0.5'
				}
			},
			spin: {
				to: {
					transform: 'rotate(360deg)'
				}
			}
		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}