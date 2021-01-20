export function minmax(array: number[]): [number, number] {
	if (!array.length) return [0, 0];

	let min = array[0], max = array[0]; // prettier-ignore
	for (let i = 1; i < array.length; i++) {
		min = array[i] < min ? array[i] : min;
		max = array[i] > max ? array[i] : max;
	}
	return [min, max];
}
