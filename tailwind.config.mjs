/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		colors: {
			da: {
				bg: '#000',
				glow: '#101010'
			},
			li: {
				bg: '#FFF',
				glow: '#F0F0F0'
			},
			bc: {
				bg: '#0F172A',
				light: '#E2E8F0',
				dark: '#64748B'
			},
			ew: {
				100: '#0AFF7C',
				200: '#00F572',
				300: '#00E069',
				400: '#00B856',
				500: '#009645',
				600: '#007A39',
				700: '#005226',
				800: '#002913',
				900: '#00140A',
			},
			ns: {
				100: '#FFC1B2',
				200: '#FF9E8D',
				300: '#FF7A68',
				400: '#FF5744',
				500: '#D42E12',
				600: '#AD1D0D',
				700: '#871B09',
				800: '#621906',
				900: '#3C1202',
			},
			ne: {
				100: '#F0D3F7',
				200: '#E0A6EF',
				300: '#D078E8',
				400: '#C04BDF',
				500: '#9900AA',
				600: '#800086',
				700: '#660062',
				800: '#4C0040',
				900: '#32001C',
			},
			blog: {
				100: '#D2F2E2',
				200: '#A6E5C5',
				300: '#78D8A7',
				400: '#4DCB8A',
				500: '#009645',
				600: '#008238',
				700: '#006D2A',
				800: '#00581D',
				900: '#003C0F',
			},
			portfolio: {
				100: '#FFC1B2',
				200: '#FF9E8D',
				300: '#FF7A68',
				400: '#FF5744',
				500: '#D42E12',
				600: '#AD1D0D',
				700: '#871B09',
				800: '#621906',
				900: '#3C1202',
			},
			quiz: {
				100: '#F0D3F7',
				200: '#E0A6EF',
				300: '#D078E8',
				400: '#C04BDF',
				500: '#9900AA',
				600: '#800086',
				700: '#660062',
				800: '#4C0040',
				900: '#32001C',
			},
			cc: {
				100: '#FEEBCF',
				200: '#FDD89F',
				300: '#FCC56F',
				400: '#FBAC40',
				500: '#FA9E0D',
				600: '#D0890B',
				700: '#A67508',
				800: '#805204',
				900: '#5D3D02',
			},
			dt: {
				100: '#C2D9F5',
				200: '#95B3EB',
				300: '#688CE1',
				400: '#3B66D7',
				500: '#005EC4',
				600: '#0048A1',
				700: '#00327F',
				800: '#001D5C',
				900: '#000739',
			},
			te: {
				100: '#F0E5D3',
				200: '#DACBB4',
				300: '#C4B095',
				400: '#AE966F',
				500: '#9D5B25',
				600: '#854920',
				700: '#6C3B1B',
				800: '#543016',
				900: '#3A220F',
			},
			jr: {
				100: '#E2F8D1',
				200: '#C5F1A2',
				300: '#A8EB74',
				400: '#8AE547',
				500: '#97C616',
				600: '#83A512',
				700: '#6F870F',
				800: '#5B690B',
				900: '#474A08',
			},
			sl: {
				100: '#FFEEFB',
				200: '#FFD7F7',
				300: '#FFBFF3',
				400: '#FFA8EF',
				500: '#FF86FE',
				600: '#D075D8',
				700: '#A864B4',
				800: '#805391',
				900: '#5D4270',
			},
			cr: {
				100: '#D8F5FC',
				200: '#B1EAF9',
				300: '#89DEF7',
				400: '#63D3F4',
				500: '#23CAFC',
				600: '#1DA8D8',
				700: '#1786B5',
				800: '#116392',
				900: '#0C416E',
			},
			hp: {
				100: '#B3EFFF',
				200: '#80E8FF',
				300: '#4DD1FF',
				400: '#1AC2FF',
				500: '#10C8FA',
				600: '#00A0C5',
				700: '#007B96',
				800: '#005867',
				900: '#003038',
			},
			mp: {
				100: '#F0EDD2',
				200: '#E1DBA5',
				300: '#D2C878',
				400: '#C3B64B',
				500: '#9B9900',
				600: '#848800',
				700: '#6D7400',
				800: '#565B00',
				900: '#3E4300',
			},
			tw: {
				100: '#FDD2C7',
				200: '#FBAA9E',
				300: '#F98275',
				400: '#F7594C',
				500: '#FC4D04',
				600: '#D63A03',
				700: '#A72802',
				800: '#7D1601',
				900: '#520D00',
			},
			lrt: {
				100: '#E0EBE6',
				200: '#B0D6C7',
				300: '#80C0A7',
				400: '#4FA58A',
				500: '#748477',
				600: '#5D6B66',
				700: '#455255',
				800: '#2E3939',
				900: '#171C1C',
			},
			white: '#FFFFFF',
			black: '#000000'
		},
		extend: {
      animation: {
        blob: "blob 7s infinite",
				background: 'background 2s ease-in-out infinite',
        linear: 'backgroundLinear 3s linear infinite',
        slide: 'backgroundSlide 120s linear infinite alternate-reverse forwards;',
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "tranlate(0px, 0px) scale(1)",
          },
        },
				background: {
          '0%, 100%': { backgroundPosition: 'left 0% bottom 0%' },
          '50%': { backgroundPosition: 'left 200% bottom 0%' },
        },
        backgroundLinear: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        backgroundSlide: {
          '0%': { backgroundPosition: '0 0%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
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
	],
}
