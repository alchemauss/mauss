import { readFileSync } from 'fs';
import { performance } from 'perf_hooks';

const file = readFileSync(`${__dirname}/data.json`, 'utf-8');
const data = JSON.parse(file);

export function runtime(fn: (input: string) => boolean) {
	const time = performance.now();
	for (let i = 0; i < data.length; i++) {
		if (fn(data[i]['body'])) continue;
	}
	return performance.now() - time;
}

export function memory(fn: (input: string) => boolean) {
	const initial = process.memoryUsage().heapUsed / 1024 / 1024;
	for (let i = 0; i < data.length; i++) {
		if (fn(data[i]['body'])) continue;
	}
	const final = process.memoryUsage().heapUsed / 1024 / 1024;
	return { initial, final, diff: final - initial };
}
