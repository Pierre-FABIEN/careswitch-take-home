import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$server: 'src/lib/server',
			$components: 'src/lib/components',
			$lib: 'src/lib',
			$ui: 'src/lib/components/ui'
		}
	}
};

export default config;
