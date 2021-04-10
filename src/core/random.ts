export const int = (max = 1, min = 0): number => {
	[min, max] = [Math.ceil(min), Math.floor(max)];
	return Math.floor(float(max, min));
};
export const key = <T>(dict: Record<string, T>): string => {
	const keys = Object.keys(dict);
	return keys[int(keys.length)];
};
export const val = <T>(dict: Record<string, T>): T => {
	const values = Object.values(dict);
	return values[int(values.length)];
};

export const array = (length: number, max: number, min = 0) =>
	Array.from({ length }, () => int(max, min));

export const bool = (): boolean => !!int();
export const hex = (): string => `#${~~(float() * (1 << 24)).toString(16)}`;
export const ipv4 = (): string => [0, 1, 2, 3].map((i) => int(255) + (!i ? 1 : 0)).join('.');
export const float = (max = 1, min = 0): number => Math.random() * (max - min) + min;
