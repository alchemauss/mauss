export const isExists = <T>(i: T | 0 | '' | false | null | undefined | typeof NaN): i is T => !!i;
