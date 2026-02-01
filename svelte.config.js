// import adapter from '@sveltejs/adapter-static';

// /** @type {import('@sveltejs/kit').Config} */
// const config = { kit: { adapter: adapter() } };

// export default config;

import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	kit: {
		adapter: adapter()
	},
	preprocess: vitePreprocess()
};

export default config;
