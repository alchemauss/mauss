export function binary<T>(
	array: T[],
	check: {
		item: (item: T) => false | ((item: T) => any);
		pointer: (item: T) => boolean;
	}
): T | undefined {
	let start = 0, end = array.length - 1; // prettier-ignore
	while (start <= end) {
		const midpoint = (start + end) >> 1;
		const current = array[midpoint];
		const passes = check.item(current);
		if (passes) return passes(current);
		if (check.pointer(current)) {
			end = midpoint - 1;
		} else start = midpoint + 1;
	}
	return;
}

export function minmax(array: number[]): [number, number] {
	if (!array.length) return [0, 0];

	let min = array[0], max = array[0]; // prettier-ignore
	for (let i = 1; i < array.length; i++) {
		min = array[i] < min ? array[i] : min;
		max = array[i] > max ? array[i] : max;
	}
	return [min, max];
}
