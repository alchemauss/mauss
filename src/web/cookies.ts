function cookies(source = typeof window !== 'undefined' ? document.cookie : '') {
	const map = new Map(source.split(';').map((c) => c.trim().split('=') as [string, string]));
	return {
		/**
		 * Find value of cookie in O(n) complexity
		 * @param name cookie value to get
		 * @returns the value of cookie name and empty string if it doesn't exist
		 */
		find(name: string): string {
			if (!name || !source) return source;
			for (let i = 0, c = 0; i < source.length; i++, c = 0) {
				if (name[c] !== source[i]) continue;
				if (i === 0 || source[i - 1] === ' ') {
					while (source[i] !== '=' && name[c++] === source[i++]);
					if (source[i] !== '=') continue;
					let end = i + 1;
					while (source[end] !== ';' && end < source.length) end++;
					const quoted = source[i + 1] === '"' && source[end] === '"';
					return source.slice(i + (quoted ? 2 : 1), end - (quoted ? 1 : 0));
				}
			}
			return '';
		},
		get: (name: string): string => map.get(name) || '',
		entries: () => map.entries(),
	};
}

/**
 * @param name name for cookie
 * @param value value to be saved as cookie name
 * @param options cookie settings, @see CookieOption type definition
 * @returns the complete 'Set-Cookie' value
 */
cookies.create = function (name: string, value: string, options: CookieOption = {}) {
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
		biscuit = `${biscuit}; Max-Age=${date};`;
	} else if (expires) {
		date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1e3);
		biscuit = `${biscuit}; Expires=${date.toUTCString()};`;
	} /** Defaults to expiring in 6 hours */ else {
		date.setTime(date.getTime() + 6 * 60 * 60 * 1e3);
		biscuit = `${biscuit}; Expires=${date.toUTCString()};`;
	}

	biscuit = `${biscuit}; Path=${path || '/'}`;
	biscuit = `${biscuit}; SameSite=${sameSite || 'Lax'}`;
	if (domain) biscuit = `${biscuit}; Domain=${domain}`;
	if (httpOnly) biscuit = `${biscuit}; HttpOnly`;
	if (secure || sameSite === 'None') biscuit = `${biscuit}; Secure`;

	return biscuit;
};
/**
 * @param values object of string pair as name and value for cookies
 * @param options cookie settings, @see CookieOption type definition
 * @returns array of the complete 'Set-Cookie' values
 */
cookies.bulk = function (values: Record<string, string>, options: CookieOption = {}) {
	return Object.values(values).map(([name, value]) => this.create(name, value, options));
};
/**
 * Automatically remove cookie in browser
 * @param name cookie to expire
 * @returns expiring 'Set-Cookie' value
 */
cookies.remove = function (name: string): string {
	const expire = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT`;
	if (typeof window !== 'undefined') document.cookie = expire;
	return expire;
};

export default cookies;

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
