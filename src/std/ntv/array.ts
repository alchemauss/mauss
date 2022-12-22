export function zip<T extends readonly any[]>(...arrays: T[]): T[number][] {
	const items: T[number][] = [];
	for (let idx = 0; idx < Math.max(...arrays.map((a) => a.length)); idx++) {
		const zipped: T[number] = [];
		for (const a of arrays) zipped.push(a[idx]);
		items.push(zipped);
	}
	return items;
}
