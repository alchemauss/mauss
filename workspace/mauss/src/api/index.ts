import type { Nullish } from '../typings/aliases.js';
import type { AlsoPromise } from '../typings/extenders.js';

type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface FetcherConfig {
	/**
	 * Prepares a `RequestInit` object to pass into fetch
	 * @param {RequestInit} opts request init options
	 */
	prepare?(opts: {
		method: HTTPMethods;
		to: string;
		body?: BodyInit;
		from?: URL;
		headers?: Record<string, string>;
	}): RequestInit;
	/**
	 * Intercepts url before getting passed to fetch
	 * @param {string} path url received from all api methods
	 */
	intercept?(path: string): string;
	/**
	 * Catches error from `fetch` failure and returns a string
	 */
	sweep?(exception: unknown): string;
	/**
	 * Transforms raw response to desired data structure
	 * @param {Response} res response object from fetch
	 */
	transform?(res: Response): Promise<unknown>;
	/**
	 * Determines if fetcher should exit with an error
	 * @param {Response} res response object from fetch
	 */
	exit?(res: Response, payload: any): AlsoPromise<string | false | Nullish>;
}

export interface SendOptions {
	from?: URL;
	headers?: Record<string, string>;
	using?: typeof fetch;
}

export function fetcher({
	prepare = ({ method, body }) => ({ method, body: JSON.stringify(body) }),
	intercept = (url) => url,
	sweep = () => 'NetworkError: Please try again later.',
	transform = (r) => r.json().catch(() => ({})),
	exit = ({ ok }) => !ok && 'UnexpectedError: Try again later.',
}: FetcherConfig) {
	async function send<T>(
		{ headers, from, using }: SendOptions,
		method: HTTPMethods,
		url: string,
		body?: any,
	): Promise<{ kind: 'error'; error: string } | { kind: 'success'; value: T }> {
		let response: Response;
		try {
			const opts = prepare({ method, to: url, body, from, headers });
			response = await (using || fetch)(intercept(url), opts);
		} catch (exception) {
			return { kind: 'error', error: sweep(exception) };
		}

		const payload = (await transform(response.clone())) as T;
		const error = await exit(response.clone(), payload);
		if (error) return { kind: 'error', error };
		return { kind: 'success', value: payload };
	}

	return function http(url: string, options: SendOptions = {}) {
		return {
			get<T>() {
				return send<T>(options, 'GET', url);
			},
			post<T>(payload?: any) {
				return send<T>(options, 'POST', url, payload);
			},
			put<T>(payload?: any) {
				return send<T>(options, 'PUT', url, payload);
			},
			delete<T>() {
				return send<T>(options, 'DELETE', url);
			},
		};
	};
}
