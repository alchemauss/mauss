export function capitalize(text: string, lower?: boolean): string {
	return (lower ? text.toLowerCase() : text).replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

export const checkNum = <T>(text: T): T | number =>
	isNaN(text as any) ? text : parseInt(text as any);

export const random = {
	int(max: number, min = 0): number {
		[min, max] = [Math.ceil(min), Math.floor(max)];
		return Math.floor(Math.random() * (max - min)) + min;
	},
	key<T>(dict: Record<string, T>): T {
		const keys = Object.keys(dict);
		return dict[keys[this.int(keys.length)]];
	},
};

// prettier-ignore
export function shuffle<T>(arr: T[]): T[] {
	let i = arr.length - 1, j = random.int(i), k = arr[i];
	for (; i > 0; i--, j = random.int(i), k = arr[i])
		arr[i] = arr[j], arr[j] = k;
	return arr;
}
