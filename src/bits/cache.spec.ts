import { suite } from 'uvu';
import * as assert from 'uvu/assert';
// import { cache } from './cache';

function cache<K, V>(input: number | Iterable<[K, V]> = 10) {
	const map = new Map<K, V>();

	let limit = typeof input === 'number' ? input : input[Symbol.iterator].length;

	return {
		all() {
			return [...map.keys()];
		},
		get(k: K): undefined | any {
			const item = map.get(k);
			map.delete(k);
			if (item) map.set(k, item);
			return item;
		},
		set(k: any, v: any) {
			if (map.has(k)) map.delete(k);
			else if (map.size === limit) map.delete(this.top);
			map.set(k, v);
		},

		get limit() {
			return limit;
		},
		set limit(max) {
			limit = max;
		},
		get top() {
			return map.keys().next().value;
		},
	};
}

const basics = {
	cache: suite('cache'),
};

// ---- standard ----

basics.cache('cache algorithm with limited stack', () => {
	const stack = cache(5);

	stack.set('a', 1);
	stack.set('b', 1);
	stack.set('c', 1);

	assert.equal(stack.all(), ['a', 'b', 'c']);

	assert.equal(stack.top, 'a');
	assert.equal(stack.get(stack.top), 1);

	stack.set('a', 2);

	assert.equal(stack.top, 'b');

	stack.set('d', 1);
	stack.set('e', 1);
	stack.set('f', 1);

	assert.equal(stack.top, 'c');
});
basics.cache('cache algorithm with existing stack', () => {});

Object.values(basics).forEach((v) => v.run());
