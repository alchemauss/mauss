export const cookies = {
	create(key: string, value: string | number | boolean = '', validDays = 0): void {
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
		for (const cookie of document.cookie.split(';')) {
			if (!cookie.trim().startsWith(name)) continue;
			return cookie.trim().slice(name.length);
		}
		return '';
	},
	remove(key: string): void {
		document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
	},
};
