export const capitalize = (text: string, lower?: boolean): string =>
	(lower ? text.toLowerCase() : text).replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
export const checkNum = <T>(text: T): T | number => (Number.isNaN(+text) ? text : +text);

export const random = {
	int(max: number, min = 0): number {
		[min, max] = [Math.ceil(min), Math.floor(max)];
		return Math.floor(Math.random() * (max - min)) + min;
	},
	key<T>(dict: Record<string, T>): string {
		const keys = Object.keys(dict);
		return keys[this.int(keys.length)];
	},
	val<T>(dict: Record<string, T>): T {
		const values = Object.values(dict);
		return values[this.int(values.length)];
	},
};
