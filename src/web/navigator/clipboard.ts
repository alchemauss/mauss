const noop = () => {};

export function copy(
	data: string | ClipboardItem,
	handler: {
		accept?(): Promise<void>;
		reject?(): Promise<void>;
	} = {}
) {
	const ncb = navigator.clipboard;

	// check for compatibility/permissions

	let process: Promise<void>;
	if (typeof data === 'string') {
		process = ncb.writeText(data);
	} else {
		// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write
		// we can only pass one clipboard item at a time
		process = ncb.write([data]);
	}

	const { accept = noop, reject = noop } = handler;
	return process.then(accept, reject);
}

export function item(type: string, data: string | Blob, options?: ClipboardItemOptions) {
	return new ClipboardItem({ [type]: data }, options);
}

export function paste(type: 'blob'): Promise<ClipboardItems>;
export function paste(type: 'text'): Promise<string>;
export function paste(type: 'blob' | 'text') {
	const ncb = navigator.clipboard;

	// check for compatibility/permissions

	return { blob: ncb.read, text: ncb.readText }[type]();
}
