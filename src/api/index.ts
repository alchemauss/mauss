const options: {
	/** Base url to prefix urls in fetch requests  */
	host?: string;
	/**
	 * Intercepts url before getting passed to fetch
	 * @param path url received from all api methods
	 */
	intercept?: (path: string) => string;
	fetch?: typeof fetch;
} = {};

type SendParams = { method: string; path: string; data?: BodyInit; token?: string };
type SendOutput = Promise<{ response: Response; body: string | Record<string, any> }>;
async function send(
	passed: undefined | typeof fetch = undefined,
	{ method, path, data, token }: SendParams
): SendOutput {
	const browser = typeof window !== 'undefined';
	if (!passed) passed = relay(browser);

	const opts: RequestInit = { method };
	opts.headers = {}; // init outside to satisfy TS
	if (data) {
		if (
			(typeof Blob !== 'undefined' && data instanceof Blob) ||
			(typeof FormData !== 'undefined' && data instanceof FormData)
		) {
			opts.body = data;
		} else if (typeof data === 'object') {
			opts.headers['Content-Type'] = 'application/json';
			opts.body = JSON.stringify(data);
		} else if (typeof data === 'string') {
			opts.headers['Content-Type'] = 'text/plain';
			opts.headers['Content-Length'] = `${data.length}`;
			opts.body = data;
		}
	}

	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`;
	}

	const { host: base, intercept } = options;
	/**
	 * 1: intercept function precedes everything
	 * 2: use native fetch functionality w/o base
	 * 3: force base domain for server side fetch
	 */
	const url =
		(intercept && intercept(path)) ||
		(browser && (base ? `${base}/${path}` : path)) ||
		`${base || 'localhost:3000'}/${path}`;

	const res = await passed(url, opts);
	const body = await (res.ok ? res.json() : res.text());
	return { response: res, body };
}

function relay(browser: boolean) {
	if (typeof options.fetch !== 'undefined') return options.fetch;
	if (browser || typeof fetch !== 'undefined') return fetch;
	throw new Error('No fetch provided. Use browser only or pass in a fetch function');
}

type MethodInit = string | { fetch?: typeof fetch; path: string };
/**	GET request with fetch */
export async function get(init: MethodInit, token?: string) {
	let fetch, path: string;
	if (typeof init === 'string') path = init;
	else ({ fetch, path } = init);

	return await send(fetch, { method: 'GET', path, token });
}
/**	DELETE request with fetch */
export async function del(init: MethodInit, token?: string) {
	let fetch, path: string;
	if (typeof init === 'string') path = init;
	else ({ fetch, path } = init);

	return await send(fetch, { method: 'DELETE', path, token });
}
/**	POST request with fetch */
export async function post(init: MethodInit, data: any, token?: string) {
	let fetch, path: string;
	if (typeof init === 'string') path = init;
	else ({ fetch, path } = init);

	return await send(fetch, { method: 'POST', path, data, token });
}
/**	PUT request with fetch */
export async function put(init: MethodInit, data: any, token?: string) {
	let fetch, path: string;
	if (typeof init === 'string') path = init;
	else ({ fetch, path } = init);

	return await send(fetch, { method: 'PUT', path, data, token });
}

export default {
	/** Use api with additional options by initializing this function */
	init({ host, intercept, fetch }: typeof options) {
		options.host = host || '';
		options.intercept = intercept;
		try {
			options.fetch = fetch || relay(typeof window !== 'undefined');
		} catch (error) {
			if (typeof window === 'undefined') console.warn(error);
		}
	},
	get,
	del,
	post,
	put,
};
