import type { BodyInit, RequestInit, Response } from 'node-fetch';
type InitOpts = { host?: string; check?: (path: string) => string };
type SendParams = { method: string; path: string; data?: BodyInit; token?: string };
type MaussFetch = (url: string, init?: RequestInit) => Promise<Response>;

const options: InitOpts & { fetch?: MaussFetch } = {};
async function send({ method, path, data, token }: SendParams) {
	const browser = typeof window !== 'undefined';
	if (!browser && !options.fetch) {
		options.fetch = await import('node-fetch').then((m) => m.default);
	}

	const opts: RequestInit = { method };
	opts.headers = {}; // Workaround TypeScript not correctly implying if put above
	if (browser && typeof FormData !== 'undefined' && data instanceof FormData) {
		opts.body = data;
	} else if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`;
	}

	const { host: base, check } = options;
	const fetch: MaussFetch = browser ? (window.fetch as any) : options.fetch;
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

export const init = async ({ host, check }: InitOpts) => {
	const browser = typeof window !== 'undefined';
	options.host = host && host.startsWith('http') ? host : undefined;
	options.check = typeof check === 'function' ? check : undefined;
	if (!browser) options.fetch = await import('node-fetch').then((m) => m.default);
};

export function get(path: string, token?: string): Promise<Response> {
	return send({ method: 'GET', path, token });
}

export function del(path: string, token?: string): Promise<Response> {
	return send({ method: 'DELETE', path, token });
}

export function post(path: string, data: any, token?: string): Promise<Response> {
	return send({ method: 'POST', path, data, token });
}

export function put(path: string, data: any, token?: string): Promise<Response> {
	return send({ method: 'PUT', path, data, token });
}
