import type { TypedIntArray } from '../../typings/aliases.js';

export function float(max = 1, min = 0): number {
	[min, max] = [Math.ceil(min), Math.floor(max)];
	return Math.random() * (max - min) + min;
}

export function int(max = 1, min = 0): number {
	return Math.floor(float(max, min));
}

export function bool(): boolean {
	return float() < 0.5;
}

export function array(length: number, max: number, min = 0): Array<number> {
	return Array.from({ length }, () => int(max, min));
}

export function key(dict: Record<any, any>): string {
	const keys = Object.keys(dict);
	return keys[int(keys.length)];
}

export function val<T>(dict: Record<any, T>): T {
	const values = Object.values(dict);
	return values[int(values.length)];
}

export function hex(): string {
	return `#${~~(float() * (1 << 24)).toString(16)}`;
}

export function ipv4(): string {
	return [0, 1, 2, 3].map((i) => int(255) + (!i ? 1 : 0)).join('.');
}

interface WebCryptoMethods {
	getRandomValues(array: TypedIntArray): TypedIntArray;
	randomUUID(): string;
}
export function uuid<Generator extends WebCryptoMethods>(gen?: Generator): string {
	if (gen && typeof gen.randomUUID === 'function') return gen.randomUUID();
	return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) => {
		const rng = gen ? gen.getRandomValues(new Uint8Array(1))[0] : float(16);
		return (+c ^ ((Number(rng) & 15) >> (+c / 4))).toString(16);
	});
}
