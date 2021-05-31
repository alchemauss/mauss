const options: { host?: string; check?: (path: string) => string; fetch?: typeof fetch } = {};
async function send(
	relayed: typeof fetch,
	params: { method: string; path: string; data?: BodyInit; token?: string }
) {
	const browser = typeof window !== 'undefined';
	const { method, path, data, token } = params;

	const opts: RequestInit = { method };
	opts.headers = {}; // TS workaround for "Object is possibly 'undefined'."
	if (typeof FormData !== 'undefined' && data instanceof FormData) {
		opts.body = data;
	} else if (typeof Blob !== 'undefined' && data instanceof Blob) {
		opts.body = data;
	} else if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`;
	}

	const { host: base, check } = options;
	/**
	 * 1: check function precedes everything
	 * 2: use native fetch functionality w/o base
	 * 3: force base domain for server side fetch
	 */
	const url =
		(check && check(path)) ||
		(browser && (base ? `${base}/${path}` : path)) ||
		`${base || 'localhost:3000'}/${path}`;

	const res = await relayed(url, opts);
	const body = await (res.ok ? res.json() : res.text());
	const err = res.ok ? undefined : new Error(body);
	return { body, error: err, response: res };
}

async function tryImport() {
	if (typeof window !== 'undefined') return window.fetch;
	if (typeof fetch !== 'undefined') return fetch;
	try {
		const module = await import('node-fetch');
		return module.default as unknown as typeof fetch;
	} catch (err) {
		return 'Cannot use fetch, "node-fetch" not available';
	}
}
async function acquireFetch() {
	if (!options.fetch) {
		const module = await tryImport();
		if (typeof module !== 'string') {
			options.fetch = module;
		} else throw new Error(module);
	}
	return options.fetch;
}

const api = {
	async init({ host, check }: Omit<typeof options, 'fetch'>) {
		options.host = host && /^https?/.test(host) ? host : '';
		options.check = typeof check === 'function' ? check : undefined;
		const module = await tryImport();
		if (typeof module !== 'string') {
			options.fetch = module;
		} else console.warn(module);
	},
	async get(init: MethodInit, token?: string): SendOutput {
		const { path, fetch = await acquireFetch() } = typeof init !== 'string' ? init : { path: init };
		return await send(fetch, { method: 'GET', path, token });
	},
	async del(init: MethodInit, token?: string): SendOutput {
		const { path, fetch = await acquireFetch() } = typeof init !== 'string' ? init : { path: init };
		return await send(fetch, { method: 'DELETE', path, token });
	},
	async post(init: MethodInit, data: any, token?: string): SendOutput {
		const { path, fetch = await acquireFetch() } = typeof init !== 'string' ? init : { path: init };
		return await send(fetch, { method: 'POST', path, data, token });
	},
	async put(init: MethodInit, data: any, token?: string): SendOutput {
		const { path, fetch = await acquireFetch() } = typeof init !== 'string' ? init : { path: init };
		return await send(fetch, { method: 'PUT', path, data, token });
	},
};

export const get = api.get;
export const del = api.del;
export const post = api.post;
export const put = api.put;
export default api;

type MethodInit = string | { path: string; fetch?: typeof fetch };
type SendOutput = Promise<{ body: any; error?: Error; response: Response }>;
