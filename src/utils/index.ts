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

type Numeric = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type TryValidator<Text extends string> = Text extends `${infer Character}${infer Rest}`
	? [Character, TryValidator<Rest>] extends [Numeric, infer Validated]
		? [Validated] extends ['']
			? number
			: Validated extends string
			? Text
			: number
		: Text
	: Text;

export function tryNumber<T extends string | number>(text: T, fallback = text) {
	type TryReturned = T extends string ? TryValidator<T> : number;
	return (Number.isNaN(+text) ? fallback : +text) as TryReturned;
}
