export interface FetcherOptions extends RequestInit {
	/** Base url to prefix urls in fetch requests  */
	base?: string;
	/** Determines if fetcher is created in browser environment */
	browser?: boolean;
	/**
	 * Intercepts url before getting passed to fetch
	 * @param {string} path url received from all api methods
	 */
	intercept?(path: string): string;
	/**
	 * Prepares a `RequestInit` object to pass into fetch
	 * @param {RequestInit} opts request init options
	 */
	prepare?(opts: RequestInit): RequestInit;
	/**
	 * Transforms raw response to desired data structure
	 * @param {Response} res response object from fetch
	 */
	transform?(res: Response): Promise<unknown>;
}

interface SendParams {
	data?: unknown;
	method: string;
	passed?: typeof fetch;
	path: string;
	token?: string;
}

export function fetcher(options: FetcherOptions) {
	async function send({ method, path, data }: SendParams) {
		const browser = options.browser ?? typeof window !== 'undefined';
		const { base, intercept, prepare = (r) => r, transform = (r) => r.json() } = options;

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

		/**
		 * 1: intercept function precedes everything
		 * 2: use native fetch functionality w/o base
		 * 3: force base domain for server side fetch
		 */
		const url =
			(intercept && intercept(path)) ||
			(browser && (base ? base + path : path)) ||
			(base || 'localhost:3000') + path;

		const res = await fetch(url, prepare(opts));
		return await transform(res);
	}

	return Object.freeze({
		async get(path: string, token?: string) {
			return await send({ method: 'GET', path, token });
		},

		async del(path: string, token?: string) {
			return await send({ method: 'DELETE', path, token });
		},

		async post(path: string, data: any, token?: string) {
			return await send({ method: 'POST', path, data, token });
		},

		async put(path: string, data: any, token?: string) {
			return await send({ method: 'PUT', path, data, token });
		},
	});
}

const type = fetcher({});

// function relay(browser: boolean) {
// 	if (typeof options.fetch !== 'undefined') return options.fetch;
// 	if (browser || typeof fetch !== 'undefined') return fetch;
// 	throw new Error('No fetch provided. Use browser only or pass in a fetch function');
// }
