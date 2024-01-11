import { createBundle } from 'dts-buddy';
// import { exports } from '../package.json';

await createBundle({
	output: 'index.d.ts',
	project: 'src/tsconfig.json',
	// modules: Object.entries(exports).reduce((acc, [key, entry]) => {
	// 	if (key.slice(2).includes('.')) return acc; // skip non-modules
	// 	return { ...acc, ['mauss' + key.slice(1)]: entry };
	// }, {}),
	modules: {
		// mauss: './src/core/index.js',
		'mauss/api': './src/api/index.js',
		'mauss/bits': './src/bits/index.js',
		'mauss/guards': './src/guards/index.js',
		'mauss/math': './src/math/index.js',
		// 'mauss/std': './src/std/index.js',
		// 'mauss/web': './src/web/index.js',
		'mauss/typings': './src/typings/index.d.ts',
	},
});
