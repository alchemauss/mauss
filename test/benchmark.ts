import { readFileSync } from 'fs';
import { performance } from 'perf_hooks';

const file = `${process.cwd()}/test/shared/data.json`;
const data = JSON.parse(readFileSync(file, 'utf-8'));

export function snapshot(fn: (input: string) => boolean) {
	const initial = process.memoryUsage().heapUsed / 1024 / 1024;
	const time = performance.now();

	for (let i = 0; i < data.length; i++) {
		if (fn(data[i]['body'])) continue;
	}

	const final = process.memoryUsage().heapUsed / 1024 / 1024;

	return {
		memory: final - initial,
		time: performance.now() - time,
	};
}

type Snapshot = ReturnType<typeof snapshot>;
export function comparator(mauss: Snapshot, other: Snapshot) {
	const time = mauss.time - other.time;
	const memory = mauss.memory - other.memory;
	return (tolerance: number) => ({
		faster: time <= tolerance,
		lighter: memory <= tolerance,
		diff: { time, memory },
	});
}
