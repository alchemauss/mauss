export * as dt from './temporal';
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

type Possibilities = string | number | null | undefined;
export function tryNumber<Input extends Possibilities, Fallback = Input>(
	input: Input,
	fallback: Fallback = input as unknown as Fallback
) {
	type Narrow<Other> = Other extends number | null ? number : Fallback;
	type TryReturned = Input extends string ? TryValidator<Input> : Narrow<Input>;
	return (Number.isNaN(+input) ? fallback : +input) as TryReturned;
}
