/** Possible cookie inputs, `null | undefined` from headers */
type CookieInput = string | null | undefined;

interface CookieOptions {
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
}

export function parse(source: CookieInput = '') {
	if (!source && typeof window !== 'undefined') source = document.cookie;

	type CookieJar = Record<string, string | undefined>;
	const jar: CookieJar = Object.create(null);
	for (const cookie of source ? source.split(';') : []) {
		const trimmed = cookie.trim();
		if (!trimmed || trimmed.slice(-1) === '=') continue;
		const [name, value] = trimmed.split('=');
		const quoted = value[0] === '"' && value.slice(-1) === '"';
		const sliced = value.slice(quoted ? 1 : 0, quoted ? -1 : void 0);
		jar[name] = decodeURIComponent(sliced);
	}
	return {
		has: (key: string) => key in jar,
		get: (key: string) => jar[key],
		keys: () => Object.keys(jar),
		values: () => Object.values(jar),
		entries: () => Object.entries(jar),
	};
}

/**
 * Locates a cookie and immediately returns the raw value
 * @param source cookie source to parse
 * @param name cookie name to search for
 * @param trim remove quotes in cookie value, if there is any
 * @returns the value of cookie name and empty string if it doesn't exist
 */
export function raw(source: CookieInput, name: string, trim = false) {
	if (!name || !source) return void 0;
	for (let i = 0, c = 0; i < source.length; i++, c = 0) {
		if (name[c] !== source[i]) continue;
		if (i === 0 || source[i - 1] === ' ') {
			while (source[i] !== '=' && name[c++] === source[i++]);
			if (source[i] !== '=') continue;
			let end = i + 1;
			while (source[end] !== ';' && end < source.length) end++;
			const quoted = source[i + 1] === '"' && source[end] === '"';
			i += trim && quoted ? 2 : 1;
			if (trim && quoted) end -= 1;
			return source.slice(i, end);
		}
	}
	return void 0;
}

/**
 * @param name name for cookie
 * @param value value to be saved as cookie name
 * @param options cookie settings
 * @returns the complete 'Set-Cookie' value
 */
export function create(name: string, value: string, options: CookieOptions = {}) {
	const { maxAge, expires, path, domain, sameSite, secure, httpOnly }: CookieOptions = {
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
 * @param options cookie settings, @see CookieOptions type definition
 * @returns array of the complete 'Set-Cookie' values
 */
export function bulk(values: Record<string, string>, options: CookieOptions = {}) {
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
