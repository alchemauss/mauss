const options = { base: '', check: undefined, fetch: undefined };
async function send(params: SendParams) {
	const { method, path, data, token } = params;
	const browser = typeof window !== 'undefined';

	const opts: RequestOpts = { method, headers: {} };
	if (browser && typeof FormData !== 'undefined' && data instanceof FormData) {
		opts.body = data;
	} else if (data) {
		opts.headers!['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers!['Authorization'] = `Bearer ${token}`;
	}

	const { base, check } = options;
	const fetch = browser ? window.fetch : options.fetch;
	/**
	 * 1: check function precedes everything
	 * 2: use native fetch functionality w/o base
	 * 3: force base domain for server side fetch
	 */
	const url =
		(check && check(path)) ||
		(browser && (base ? `${base}/${path}` : path)) ||
		`${base || 'localhost:3000'}/${path}`;

	const res = await fetch(url, opts);
	const text = await res.text();
	try {
		return JSON.parse(text);
	} catch (err) {
		return text;
	}
}

export const init = ({ host, check, fetch }: InitOpts) => {
	const browser = typeof window !== 'undefined';
	options.base = host;
	options.check = check;
	options.fetch = fetch;
	if (!browser && !options.fetch) {
		try {
			options.fetch = require('node-fetch').default;
		} catch (error) {
			console.error('API warning, fetch cannot be used on the server!');
		}
	}
};

export function get(path: string, token?: string) {
	return send({ method: 'GET', path, token });
}

export function del(path: string, token?: string) {
	return send({ method: 'DELETE', path, token });
}

export function post(path: string, data: BodyInit, token?: string) {
	return send({ method: 'POST', path, data, token });
}

export function put(path: string, data: BodyInit, token?: string) {
	return send({ method: 'PUT', path, data, token });
}

type BodyInit = ArrayBuffer | ArrayBufferView | string | URLSearchParams | FormData;
type SendParams = { method: string; path: string; data?: BodyInit; token?: string };
type RequestOpts = {
	body?: BodyInit;
	headers?: Record<string, string>;
	method?: string;
	redirect?: RequestRedirect;
	signal?: AbortSignal | null;
};
type InitOpts = {
	host: string;
	check: (path: string) => string;
	fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
};
