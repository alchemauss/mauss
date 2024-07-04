import { createBundle } from 'dts-buddy';
import { exports } from '../package.json';

await createBundle({
	output: 'index.d.ts',
	project: 'src/tsconfig.json',
	modules: Object.entries(exports).reduce((acc, [key, exp]) => {
		if (key.slice(2).includes('.')) return acc;
		const entry = typeof exp === 'object' ? exp.default : exp;
		return { ...acc, ['mauss' + key.slice(1)]: entry };
	}, {}),
});
