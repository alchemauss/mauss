export const nullish = <T>(i: T | null | undefined): i is T => i == null;
export const truthy = <T>(i: T | 0 | '' | false | null | undefined | typeof NaN): i is T => !!i;
