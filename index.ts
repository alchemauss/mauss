export const cookies = {
	create(key: string, value = '', validDays = 0): void {
		let expiry = '';
		if (validDays) {
			const date = new Date();
			date.setTime(date.getTime() + validDays * 24 * 60 * 60 * 1e3);
			expiry = `; expires=${date.toUTCString()}`;
		}
		document.cookie = `${key}=${value}${expiry}; path=/;`;
	},
	get(key: string): string {
		const name = `${key}=`;
		const cookies = document.cookie.split(';');
		for (const cookie of cookies) {
			if (!cookie.trim().startsWith(name)) continue;
			return cookie.trim().slice(name.length);
		}
		return '';
	},
	remove(key: string): void {
		document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
	},
};

export function debounce(fn: any, time = 300) {
	let timeout: NodeJS.Timeout;
	return (...args: any[]) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), time);
	};
}

export function permutation<T, K>(input: T[], fn?: (i: T[]) => K) {
	const results: (T[] | K)[] = [];
	const permute = (arr: T[], m: T[] = []): void | number => {
		if (!arr.length) return results.push(fn ? fn(m) : m);
		for (let i = 0; i < arr.length; i++) {
			const curr = arr.slice();
			const next = curr.splice(i, 1);
			permute(curr.slice(), m.concat(next));
		}
	};
	return permute(input), results;
}
