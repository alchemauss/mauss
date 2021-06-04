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

type SendOptions = { relayed: typeof fetch };
type SendParams = { method: string; path: string; data?: BodyInit; token?: string };
type SendOutput = Promise<{ response: Response; body: string | Record<string, any> }>;
async function send(
	{ relayed }: SendOptions,
	{ method, path, data, token }: SendParams
): SendOutput {
	const browser = typeof window !== 'undefined';

	const opts: RequestInit = { method };
	opts.headers = {}; // TS workaround for "Object is possibly 'undefined'."
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

	const res = await relayed(url, opts);
	const body = await (res.ok ? res.json() : res.text());
	return { response: res, body };
}

function relay() {
	if (typeof window !== 'undefined') return window.fetch;
	if (typeof fetch !== 'undefined') return fetch;
	if (typeof options.fetch !== 'undefined') return options.fetch;
	throw new Error('No fetch provided. Use browser only or pass in a fetch function');
}

type MethodInit = string | { fetch?: typeof fetch; path: string };
/**	GET request with fetch */
export const get = async (init: MethodInit, token?: string) => {
	const { fetch = relay(), path } = typeof init !== 'string' ? init : { path: init };
	return await send({ relayed: fetch }, { method: 'GET', path, token });
};
/**	DELETE request with fetch */
export const del = async (init: MethodInit, token?: string) => {
	const { fetch = relay(), path } = typeof init !== 'string' ? init : { path: init };
	return await send({ relayed: fetch }, { method: 'DELETE', path, token });
};
/**	POST request with fetch */
export const post = async (init: MethodInit, data: any, token?: string) => {
	const { fetch = relay(), path } = typeof init !== 'string' ? init : { path: init };
	return await send({ relayed: fetch }, { method: 'POST', path, data, token });
};
/**	PUT request with fetch */
export const put = async (init: MethodInit, data: any, token?: string) => {
	const { fetch = relay(), path } = typeof init !== 'string' ? init : { path: init };
	return await send({ relayed: fetch }, { method: 'PUT', path, data, token });
};

export default {
	/** Use api with additional options by initializing this function */
	init({ host, intercept, fetch }: typeof options) {
		options.host = host && /^https?/.test(host) ? host : '';
		options.intercept = typeof intercept === 'function' ? intercept : undefined;
		try {
			options.fetch = fetch || relay();
		} catch (error) {
			if (typeof window === 'undefined') console.warn(error);
		}
	},
	get,
	del,
	post,
	put,
};
