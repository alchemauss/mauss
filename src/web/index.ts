import * as cookies from './cookies';

export { cookies };

/**
 * qpm - query string pathname maker
 * @param bound object with key-value pair to be updated in the URL
 * @param prefix string to prepend on the final output
 * @returns final pathname with query string
 */
export function qpm(bound: Record<string, string | number | boolean>, prefix = ''): string {
	if (typeof window === 'undefined') return '';
	const kvs = Object.entries(bound).reduce((a, [k, v]) => {
		if (typeof v === 'string') v = v.trim();
		if (typeof v === 'string' && !v) return a;
		if (!a) a = '?';
		if (a !== '?') a += '&';
		return `${a}${k}=${encodeURIComponent(v)}`;
	}, '');
	const path = location.pathname;
	return kvs ? path + kvs : path;
}
