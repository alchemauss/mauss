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
			const name = `${key}=`;
			for (const c of cookie.split(';')) {
				if (!c.trim().startsWith(name)) continue;
				return c.trim().slice(name.length);
			}
			return '';
		},
		remove(key: string): Error | void {
			if (!browser) return new Error('Not in browser, cannot remove');
			cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
		},
	};
}

export function debounce(fn: any, time = 300) {
	let timeout: NodeJS.Timeout;
	return (...args: any[]) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), time);
	};
}
