const tryImport = async (): Promise<typeof fetch | string> => {
	if (typeof window !== 'undefined') return window.fetch;
	if (typeof fetch !== 'undefined') return fetch;
	try {
		const module = await import('node-fetch');
		return module.default as unknown as typeof fetch;
	} catch (err) {
		return 'Cannot use fetch, "node-fetch" not available';
	}
};

const options: { host?: string; check?: (path: string) => string; fetch?: typeof fetch } = {};
async function send(params: { method: string; path: string; data?: BodyInit; token?: string }) {
	const browser = typeof window !== 'undefined';
	const { method, path, data, token } = params;
	if (!options.fetch) {
		const module = await tryImport();
		if (typeof module !== 'string') {
			options.fetch = module;
		} else throw new Error(module);
	}

	const opts: RequestInit = { method };
	opts.headers = {}; // TS workaround for "Object is possibly 'undefined'."
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
	const body = await (res.ok ? res.json() : res.text());
	const err = res.ok ? undefined : new Error(body);
	return { res, body, err };
}

export const init = async ({ host, check }: Omit<typeof options, 'fetch'>) => {
	options.host = host && /^https?/.test(host) ? host : undefined;
	options.check = typeof check === 'function' ? check : undefined;
	const module = await tryImport();
	if (typeof module !== 'string') {
		options.fetch = module;
	} else console.warn(module);
};

export function get(path: string, token?: string) {
	return send({ method: 'GET', path, token });
}

export function del(path: string, token?: string) {
	return send({ method: 'DELETE', path, token });
}

export function post(path: string, data: any, token?: string) {
	return send({ method: 'POST', path, data, token });
}

export function put(path: string, data: any, token?: string) {
	return send({ method: 'PUT', path, data, token });
}
