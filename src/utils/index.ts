import { random } from './toolbox';

export { random };

export const capitalize = (text: string, normalize?: boolean): string =>
	(normalize ? text.toLowerCase() : text).replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

export const tryNumber = <T>(text: T): T | number => (Number.isNaN(+text) ? text : +text);

export default {
	capitalize,
	tryNumber,
	random,
};
