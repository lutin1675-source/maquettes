const palette = {
	space: '#030712',
	midnight: '#0b1326',
	panel: '#101b33',
	iris: '#8e7dff',
	coral: '#ff8f65',
	lagoon: '#2bd9c5',
	lumen: '#f4ff8f',
	text: '#eef2ff',
	muted: '#98a6d7',
};

/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'],
	theme: {
		extend: {
			colors: {
				tm: palette,
			},
		},
	},
};

export default config;
