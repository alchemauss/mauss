import { Nullish } from '../../typings/aliases.js';
import { UnaryFunction } from '../../typings/helpers.js';

type Parse<T> = T extends `${string}{${infer P}}${infer R}` ? P | Parse<R> : never;
export function tsf<Input extends string>(
	template: Input extends
		| `${string}{}${string}`
		| `${string}{{${string}}}${string}`
		| `${string}{{${string}}${string}`
		| `${string}{${string}}}${string}`
		? never
		: Input
) {
	const parts: string[] = [];
	for (let i = 0, start = 0; i < template.length; i += 1) {
		if (template[i] === '{') {
			if (i > start) parts.push(template.slice(start, i));

			const end = template.indexOf('}', i);
			if (end === -1 /** missing closing */) {
				parts.push(template.slice(i));
				break;
			}

			parts.push(template.slice(i + 1, end));
			start = (i = end) + 1;
		} else if (i === template.length - 1) {
			parts.push(template.slice(start));
		}
	}

	type ConditionalString = string | false | Nullish;
	type Replacer = ConditionalString | UnaryFunction<string, ConditionalString>;
	type ExpectedProperties = string extends Input ? string : Parse<Input>;
	return function render(table: { [K in ExpectedProperties]: Replacer }) {
		let transformed = '';
		for (let i = 0; i < parts.length; i += 1) {
			const replace = table[parts[i] as ExpectedProperties];
			if (typeof replace === 'function') {
				transformed += replace(parts[i]) || '';
			} else {
				transformed += replace || parts[i];
			}
		}
		return transformed;
	};
}
