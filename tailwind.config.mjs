/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/flowbite/**/*.js',
	],
	theme: {
		extend: {
			colors: {
				bc: {
					bg: '#0F172A',
					light: '#E2E8F0',
					dark: '#64748B'
				},
				ew: {
					mrt: '#009645',
					300: '#56CD94',
					500: '#3CA877'
				},
				ns: {
					mrt: '#D42E12',
					300: '#F96843',
					500: '#FF3E00'
				},
				ne: {
					mrt: '#9900AA',
					300: '#9A7ACE',
					500: '#673AB8'
				},
				cc: {
					mrt: '#FA9E0D',
					300: '#FFCB2C',
					500: '#FA9E0D'
				},
				dt: {
					mrt: '#005EC4',
					300: '#61DAFB',
					500: '#139ECA'
				},
				te: {
					mrt: '#9D5B25',
				},
				jr: {
					mrt: '#97C616',
				},
				sl: {
					mrt: '#FF86FE',
				},
				cr: {
					mrt: '#23CAFC',
				},
				hp: {
					mrt: '#10C8FA',
				},
				mp: {
					mrt: '#9B9900',
				},
				tw: {
					mrt: '#FC4D04',
				},
				lrt: {
					mrt: '#748477'
				},
				gray: {
					mrt: '#748477',
					100: '#F8F8F8',
					200: '#C9C9C9',
					300: '#A0A0A0',
					400: '#999999',
					500: '#848484',
					600: '#555555',
					700: '#232323',
					800: '#161616',
					900: '#0D0D0D',
				},
				white: '#FFFFFF',
				black: '#000000'
			},
      animation: {
        linear: 'backgroundLinear 3s linear infinite',
      },
      keyframes: {
        backgroundLinear: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
			boxShadow: {
				'solid-black': '5px 5px 0 0 rgb(0 0 0)',
				'solid-white': '5px 5px 0 0 rgb(255 255 255)',
			}
    },
	},
	plugins: [
		plugin(({ theme, addUtilities }) => {
			const neonUtilities = {};
			const colors = theme('colors');
			for (const color in colors) {
				if (typeof colors[color] === 'object') {
					const color1 = colors[color][400];
					const color2 = colors[color][800];
					neonUtilities[`.neon-${color}`] = {
						boxShadow: `0 0 8px ${color1}, 0 0 24px ${color2}`,
					}
				}
			}
			addUtilities(neonUtilities);
		}),
		require('flowbite/plugin'),
		require('tailwind-scrollbar')
	]
}
