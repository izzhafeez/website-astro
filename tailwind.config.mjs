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
					100: '#E6F4E6',
					200: '#B3E0B3',
					300: '#56CD94',
					400: '#42B862',
					500: '#3CA877',
					600: '#359963',
					700: '#2E8A5C',
					800: '#267B4F',
					900: '#1F5D3A'
				},
				ns: {
					mrt: '#D42E12',
					100: '#FFECEB',
					200: '#FFB2AE',
					300: '#FF8863',
					400: '#FF6A3D',
					500: '#FF3E00',
					600: '#E63600',
					700: '#C92A00',
					800: '#A82400',
					900: '#7A1800',
				},
				ne: {
					mrt: '#9900AA',
					100: '#F5E6F7',
					300: '#9A7ACE',
					500: '#673AB8',
					700: '#4A148C',
					900: '#320B6F',
				},
				cc: {
					mrt: '#FA9E0D',
					100: '#FFF3E0',
					300: '#FFCB2C',
					500: '#FA9E0D',
					700: '#D17800',
					900: '#8F5C00',
				},
				dt: {
					mrt: '#005EC4',
					100: '#E6F4F9',
					300: '#61DAFB',
					500: '#139ECA',
					700: '#005EC4',
					900: '#004A9B',
				},
				te: {
					mrt: '#9D5B25',
					100: '#EFD4BD',
					300: '#E0A87B',
					500: '#C6732F',
					700: '#844D1F',
					900: '#633917'
				},
				jr: {
					// mrt: '#23CAFC',97C616
					mrt: '#0099AA',
					100: '#70F1FF',
					300: '#0AE7FF',
					500: '#00B8CC',
					700: '#0099AA',
					900: '#006E7A'
				},
				sl: {
					mrt: '#FF86FE',
					100: '#FFD6FF',
					300: '#FF86FE',
					500: '#FF0AFF',
					700: '#CC00CC',
					900: '#8F008F'
				},
				cr: {
					mrt: '#97C616',
					100: '#E5F7B6',
					300: '#B9E935',
					500: '#97C616',
					700: '#7EA512',
					900: '#546E0C'
				},
				hp: {
					mrt: '#10C8FA',
					500: '#10C8FA',
				},
				mp: {
					mrt: '#9B9900',
					500: '#9B9900',
				},
				tw: {
					mrt: '#FC4D04',
					500: '#FC4D04',
				},
				lrt: {
					mrt: '#748477',
					500: '#748477'
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
		require('tailwindcss-3d'),
		require('flowbite/plugin'),
		require('tailwind-scrollbar'),
		require('tailwindcss-animation-delay')
	]
}
