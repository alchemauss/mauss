export declare const init: (opts: {
	host: string;
	check: (path: string) => string;
	fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
}) => void;

export declare function get<T>(path: string, token?: string): Promise<T>;
export declare function del<T>(path: string, token?: string): Promise<T>;
export declare function post<T>(path: string, data?: any, token?: string): Promise<T>;
export declare function put<T>(path: string, data?: any, token?: string): Promise<T>;
