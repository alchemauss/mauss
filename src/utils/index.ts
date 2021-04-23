export { random } from './toolbox';

export const capitalize = (text: string, normalize?: boolean): string =>
	(normalize ? text.toLowerCase() : text).replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

export const checkNum = <T>(text: T): T | number => (Number.isNaN(+text) ? text : +text);
