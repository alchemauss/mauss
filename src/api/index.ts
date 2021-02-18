let options: InitOpts = {};
async function send({ method, path, data, token }: SendParams) {
	const browser = typeof window !== 'undefined';

	const opts: RequestOpts = { method, headers: {} };
	if (browser && typeof FormData !== 'undefined' && data instanceof FormData) {
		opts.body = data;
	} else if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers!['Authorization'] = `Bearer ${token}`;
	}

	const { host: base, check } = options;
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

	const res = await fetch!(url, opts);
	const text = await res.text();
	try {
		return JSON.parse(text);
	} catch (err) {
		return text;
	}
}

export const init = ({ host, check, fetch }: InitOpts) => {
	const browser = typeof window !== 'undefined';
	options = { host, check, fetch };
	if (!browser && !options.fetch) {
		try {
			options.fetch = require('node-fetch').default;
		} catch (error) {
			console.warn(
				"Warning! API cannot be used on the server. If you do not intent to use 'mauss/api' server-side, you can safely ignore this message."
			);
		}
	}
};

export function get<T>(path: string, token?: string): Promise<T> {
	return send({ method: 'GET', path, token });
}

export function del<T>(path: string, token?: string): Promise<T> {
	return send({ method: 'DELETE', path, token });
}

export function post<T>(path: string, data: any, token?: string): Promise<T> {
	return send({ method: 'POST', path, data, token });
}

export function put<T>(path: string, data: any, token?: string): Promise<T> {
	return send({ method: 'PUT', path, data, token });
}

type BodyInit = ArrayBuffer | ArrayBufferView | FormData | URLSearchParams | string;
type SendParams = { method: string; path: string; data?: BodyInit; token?: string };
type RequestOpts = { method: string; headers: Record<string, string>; body?: BodyInit };
type InitOpts = {
	host?: string;
	check?: (path: string) => string;
	fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
};
