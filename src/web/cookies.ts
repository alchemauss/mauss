/** Possible cookie inputs, `null | undefined` from headers */
type CookieInput = string | null | undefined;

interface CookieOptions {
	/**
	 * Expiry in days
	 * @default 6
	 */
	expires?: number;
	/**
	 * MaxAge in days
	 * @default undefined */
	maxAge?: number;
	/**
	 * Domain
	 * @default undefined
	 */
	domain?: string;
	/**
	 * Path
	 * @default '/'
	 */
	path?: string;
	/**
	 * HttpOnly
	 * @default false
	 */
	secure?: boolean;
	/**
	 * HttpOnly
	 * @default true
	 */
	httpOnly?: boolean;
	/**
	 * SameSite
	 * @default 'Strict'
	 */
	sameSite?: 'Strict' | 'Lax' | 'None';
}

export function parse(source: CookieInput = '') {
	if (!source && typeof window !== 'undefined') source = document.cookie;

	type CookieJar = Record<string, string | undefined>;
	const jar: CookieJar = Object.create(null);
	for (const cookie of source ? source.split(';') : []) {
		const trimmed = cookie.trim();
		const delimiter = trimmed.indexOf('=');
		if (!trimmed || delimiter === trimmed.length - 1) continue;

		const name = trimmed.slice(0, delimiter).trim();
		let value = trimmed.slice(delimiter + 1).trim();
		const quotes = value[0] === value[value.length - 1];
		if (value[0] === '"' && quotes) value = value.slice(1, -1);

		try {
			jar[name] = decodeURIComponent(value);
		} catch (error) {
			jar[name] = value; // assign value as-is
		}
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
	if (!source || !name) return void 0;
	for (let i = 0, c = 0; i < source.length; i++, c = 0) {
		if (source[i] !== name[0]) continue;
		let matched = true;
		while (matched && source[i] !== '=') {
			matched = source[i++] === name[c++];
			if (c === name.length) {
				while (source[i] === ' ') i++;
				matched = source[i] === '=';
			}
		}
		if (!matched) continue;

		let end = i + 1;
		while (source[end] !== ';' && end < source.length) end++;
		const quoted = source[i + 1] === '"' && source[end] === '"';
		i += trim && quoted ? 2 : 1;
		if (trim && quoted) end -= 1;
		return source.slice(i, end);
	}
	return void 0;
}

/**
 * @param name name for cookie
 * @param value value to be saved as cookie name
 * @param options cookie settings
 * @returns the complete 'Set-Cookie' value
 */
export function create(
	name: string,
	value: string,
	{
		path = '/',
		domain,
		maxAge,
		expires = 6,
		sameSite = 'Lax',
		secure = false,
		httpOnly = true,
	}: CookieOptions = {}
) {
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

	biscuit = `${biscuit}; Path=${path}`;
	biscuit = `${biscuit}; SameSite=${sameSite || 'Lax'}`;
	if (domain) biscuit = `${biscuit}; Domain=${domain}`;
	if (httpOnly) biscuit = `${biscuit}; HttpOnly`;
	if (secure || sameSite === 'None') biscuit = `${biscuit}; Secure`;

	return biscuit;
}

/**
 * @param values object of string pair as name and value for cookies
 * @param options cookie settings
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
