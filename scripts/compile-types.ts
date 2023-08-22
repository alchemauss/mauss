import { createBundle } from 'dts-buddy';
import { exports } from '../package.json';

await createBundle({
	output: 'index.d.ts',
	modules: Object.entries(exports).reduce((acc, [key, entry]) => {
		if (key.slice(2).includes('.')) return acc; // skip non-modules
		return { ...acc, ['mauss' + key.slice(1)]: entry };
	}, {}),
});
