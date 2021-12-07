export function unique<T extends any[]>(array: T): T[] {
	return [...new Set(array)];
}

/**
 * regexp - implementation of global RegExp constructor with escaped pattern
 * @param exp pattern in the form of string literal
 * @param flags unique set of characters from `d|g|i|m|s|u|y`
 * @returns dynamically constructed RegExp object
 */
export function regexp(pattern: string, flags?: string): RegExp {
	return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
}
