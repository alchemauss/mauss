import type { AlsoPromise } from '../../typings/extenders.js';

const noop = () => {};

function copy(
	data: string | ClipboardItem,
	handler: {
		accept?(): AlsoPromise<void>;
		reject?(): AlsoPromise<void>;
	} = {},
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

function paste(type: 'blob'): Promise<ClipboardItems>;
function paste(type: 'text'): Promise<string>;
function paste(type: 'blob' | 'text') {
	const ncb = navigator.clipboard;

	// check for compatibility/permissions

	return { blob: ncb.read, text: ncb.readText }[type]();
}

/**
 * This namespace extends the [`Navigator` object](https://developer.mozilla.org/en-US/docs/Web/API/Navigator), make sure to execute the function in environments where `window.navigator` exists
 */
export const clipboard = {
	copy,
	paste,
	item(type: string, data: string | Blob, options?: ClipboardItemOptions) {
		return new ClipboardItem({ [type]: data }, options);
	},
};
