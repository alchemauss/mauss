export function cookies(cookie = (typeof window !== 'undefined' && document.cookie) || '') {
	const browser = typeof window !== 'undefined' && !!document.cookie;
	return {
		create(key: string, value: string | number = '', validDays = 0): void {
			let expiry = '';
			if (validDays) {
				const date = new Date();
				date.setTime(date.getTime() + validDays * 24 * 60 * 60 * 1e3);
				expiry = `; expires=${date.toUTCString()}`;
			}
			cookie = `${key}=${value}${expiry}; path=/;`;
		},
		get(key: string): string {
			for (let i = 0, c = 0; i < cookie.length; i++) {
				if (c === key.length && cookie[i + 1] === '=') {
					let end = i + 2;
					while (cookie[end++] !== ';');
					return cookie.slice(i + 1, end);
				}
				c = key[c] === cookie[i] ? c + 1 : 0;
			}
			return '';
		},
		remove(key: string): void {
			if (!browser) throw new Error('Not in browser, cannot remove');
			cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
		},
	};
}
