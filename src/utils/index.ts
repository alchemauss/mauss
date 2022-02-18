export { dt } from './temporal';
export { random } from './toolbox';

interface CapitalizeOptions {
	/** only capitalize the very first letter */
	cap?: boolean;
	/** convert the remaining word to lowercase */
	normalize?: boolean;
}
export function capitalize(text: string, { cap, normalize }: CapitalizeOptions = {}): string {
	if (normalize) text = text.toLowerCase();
	if (cap) return `${text[0].toUpperCase()}${text.slice(1)}`;
	return text.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

export const tryNumber = <T>(text: T, fallback = text): T | number =>
	Number.isNaN(+text) ? fallback : +text;
