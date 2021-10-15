import * as cookies from './cookies';

/**
 * qpm - Query string Pathname Maker
 * @param bound object with key-value pair to be updated in the URL
 * @returns final pathname with query string
 */
export function qpm(bound: Record<string, string>): string {
	if (typeof window === 'undefined') return '';
	const kvs = Object.entries(bound).reduce((a, [k, v]) => {
		v = v.trim();
		if (!v) return a;
		if (!a) a = '?';
		if (a !== '?') a += '&';
		return `${a}${k}=${encodeURIComponent(v)}`;
	}, '');
	const path = location.pathname;
	return kvs ? path + kvs : path;
}

export { cookies };

export default {
	cookies,
};
