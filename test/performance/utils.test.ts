import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as utils from '../../src/utils';
import snapshot from '../benchmark';

const mapCap = (t: string) => t[0].toUpperCase() + t.slice(1);
const native = (text: string) => !!text.split(' ').map(mapCap).join(' ');
const mauss = (text: string) => !!utils.capitalize(text);

test('comparison with Array check', () => {
	const [m, n] = [snapshot(mauss), snapshot(native)];
	const ms = m.time - n.time;
	const kb = m.memory - n.memory;
	assert.ok(ms <= 1, `native is ${ms} faster`);
	assert.ok(kb <= 1, `native is ${kb} lighter`);
});

test.run();