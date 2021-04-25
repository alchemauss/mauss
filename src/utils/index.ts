export const capitalize = (text: string, lower?: boolean): string =>
	(lower ? text.toLowerCase() : text).replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
export const checkNum = <T>(text: T): T | number => (Number.isNaN(+text) ? text : +text);
