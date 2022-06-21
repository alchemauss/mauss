export function permutation<T, K>(input: T[], fn?: (i: T[]) => K) {
	const results: Array<T[] | K> = [];
	const permute = (arr: T[], m: T[] = []): void | number => {
		if (!arr.length) return results.push(fn ? fn(m) : m);
		for (let i = 0; i < arr.length; i++) {
			const curr = arr.slice();
			const next = curr.splice(i, 1);
			permute(curr.slice(), m.concat(next));
		}
	};
	return permute(input), results;
}
