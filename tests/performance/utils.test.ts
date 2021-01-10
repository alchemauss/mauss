import { runtime, memory } from '../shared/benchmark';
import * as utils from '../../utils';

describe('utils-perf', () => {
	describe('capitalize', () => {
		it('perform better than using Array check', () => {
			const mapCap = (t: string) => t[0].toUpperCase() + t.slice(1);
			const native = runtime((text) => !!text.split(' ').map(mapCap).join(' '));
			const mauss = runtime((text) => !!utils.capitalize(text));
			expect(mauss).toBeLessThanOrEqual(native);
		});
		it('use less memory than using Array check', () => {
			const mapCap = (t: string) => t[0].toUpperCase() + t.slice(1);
			const native = memory((text) => !!text.split(' ').map(mapCap).join(' '));
			const mauss = memory((text) => !!utils.capitalize(text));
			expect(mauss.diff).toBeLessThanOrEqual(native.diff);
		});
	});
});
