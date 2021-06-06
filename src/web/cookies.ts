export function parse(source: string | undefined = '') {
	if (!source && typeof window !== 'undefined') source = document.cookie;

	const jar: Map<string, any> = new Map();
	for (const cookie of source ? source.split(';') : []) {
		if (cookie.trim().slice(-1) === '=') continue;
		const [name, value] = cookie.trim().split('=');
		const quoted = value[0] === '"' && value.slice(-1) === '"';
		jar.set(name, decodeURIComponent(value.slice(quoted ? 1 : 0, quoted ? -1 : 0)));
	}
	return {
		/**
		 * Get raw value of cookie
		 * @param name cookie value to get
		 * @returns the value of cookie name and empty string if it doesn't exist
		 */
		raw(name: string, trimQuoted = false): string {
			if (!name || !source) return '';
			for (let i = 0, c = 0; i < source.length; i++, c = 0) {
				if (name[c] !== source[i]) continue;
				if (i === 0 || source[i - 1] === ' ') {
					while (source[i] !== '=' && name[c++] === source[i++]);
					if (source[i] !== '=') continue;
					let end = i + 1;
					while (source[end] !== ';' && end < source.length) end++;
					const quoted = source[i + 1] === '"' && source[end] === '"';
					const inc = quoted && trimQuoted ? 2 : 1;
					const dec = quoted && trimQuoted ? 1 : 0;
					return source.slice(i + inc, end - dec);
				}
			}
			return '';
		},
		has: jar.has,
		get: jar.get,
		keys: jar.keys,
		values: jar.values,
		entries: jar.entries,
	};
}

/**
 * @param name name for cookie
 * @param value value to be saved as cookie name
 * @param options cookie settings, @see CookieOption type definition
 * @returns the complete 'Set-Cookie' value
 */
export function create(name: string, value: string, options: CookieOption = {}) {
	const { maxAge, expires, path, domain, sameSite, secure, httpOnly }: CookieOption = {
		sameSite: 'Lax',
		secure: false,
		httpOnly: true,
		...options,
	};

	if (/[\s\t()<>@,;:\\"/\[\]?={}\u0080-\u00ff]/.test(name)) {
		name = name.replace(/[\s\t]/g, '-').replace(/-+/g, '-');
		name = name.replace(/[()<>@,;:\\"/\[\]?={}\u0080-\u00ff]/g, '');
		console.warn(`Illegal cookie name, creating "${name}" instead`);
	}

	let biscuit = `${name}=${encodeURIComponent(value)}`;
	const date = new Date();
	if (maxAge /** Max-Age has precedence over Expires */) {
		date.setTime(date.getTime() + maxAge * 24 * 60 * 60 * 1e3);
		biscuit = `${biscuit}; Max-Age=${date}`;
	} else if (expires) {
		date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1e3);
		biscuit = `${biscuit}; Expires=${date.toUTCString()}`;
	} /** Defaults to expiring in 6 hours */ else {
		date.setTime(date.getTime() + 6 * 60 * 60 * 1e3);
		biscuit = `${biscuit}; Expires=${date.toUTCString()}`;
	}

	biscuit = `${biscuit}; Path=${path || '/'}`;
	biscuit = `${biscuit}; SameSite=${sameSite || 'Lax'}`;
	if (domain) biscuit = `${biscuit}; Domain=${domain}`;
	if (httpOnly) biscuit = `${biscuit}; HttpOnly`;
	if (secure || sameSite === 'None') biscuit = `${biscuit}; Secure`;

	return biscuit;
}

/**
 * @param values object of string pair as name and value for cookies
 * @param options cookie settings, @see CookieOption type definition
 * @returns array of the complete 'Set-Cookie' values
 */
export function bulk(values: Record<string, string>, options: CookieOption = {}) {
	return Object.entries(values).map(([name, value]) => create(name, value, options));
}

/**
 * Automatically remove cookie in browser
 * @param name cookie to expire
 * @returns expiring 'Set-Cookie' value
 */
export function remove(name: string): string {
	const expire = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT`;
	if (typeof window !== 'undefined') document.cookie = expire;
	return expire;
}

type CookieOption = {
	/** Expiry, number in days */
	expires?: number;
	/** MaxAge, number in days */
	maxAge?: number;
	/** Domain, default to current document URL */
	domain?: string;
	/** Path, defaults to '/' */
	path?: string;
	/** HttpOnly, defaults to false */
	secure?: boolean;
	/** HttpOnly, defaults to true */
	httpOnly?: boolean;
	/** SameSite, defaults to 'Strict' */
	sameSite?: 'Strict' | 'Lax' | 'None';
};
