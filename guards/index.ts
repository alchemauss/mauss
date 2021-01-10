export const isExists = <T>(i: T | 0 | '' | false | null | undefined | typeof NaN): i is T => !!i;
export const notNullish = <T>(i: T | null | undefined): i is T => i !== null && i !== undefined;
