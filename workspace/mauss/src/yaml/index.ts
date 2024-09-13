type Primitives = null | boolean | string;
type FrontMatter = { [key: string]: Primitives | Primitives[] | FrontMatter | FrontMatter[] };
export function read(raw: string, memo: Record<string, any> = {}): FrontMatter[string] {
	const indent = indentation(raw);
	if (!/[:\-\[\]|#]/gm.test(raw)) {
		return indent > 1 ? dedent(raw) : coerce(raw.trim());
	}
	if (indent <= 1) raw = raw.trimStart();
	if (/^(".*"|'.*')$/.test(raw.trim())) {
		return raw.trim().slice(1, -1);
	}

	const PATTERN = /(^[^:\s]+):(?!\/)\n?([\s\S]*?(?=^\S)|[\s\S]*$)/gm;
	let match: null | RegExpExecArray;
	while ((match = PATTERN.exec(raw))) {
		const [, key, value] = match;
		const i = indentation(value);
		const data = read(i ? dedent(value) : value, memo[key]);
		if (Array.isArray(data) || typeof data !== 'object') memo[key] = data;
		else memo[key] = { ...memo[key], ...data };
	}

	if (Object.keys(memo).length) return memo;

	const cleaned = raw.replace(/#.*$/gm, '').trim();
	switch (cleaned[0]) {
		case '-': {
			const sequence = cleaned.split('-').filter((v) => v);
			type Possibly = Primitives & FrontMatter; // what..?
			return sequence.map((v) => read(dedent(v)) as Possibly);
		}
		case '[': {
			const pruned = cleaned.slice(1, -1);
			return pruned.split(',').map(coerce);
		}
		case '|': {
			return dedent(cleaned.slice(1).replace('\n', ''));
		}
		default: {
			return coerce(cleaned.trim());
		}
	}
}

// ---- internal functions ----

function coerce(u: string) {
	const v = u.trim(); // argument can be passed as-is
	const map = { true: true, false: false, null: null };
	if (v in map) return map[v as keyof typeof map];
	// if (!Number.isNaN(Number(v))) return Number(v);
	return /^(".*"|'.*')$/.test(v) ? v.slice(1, -1) : v;
}

function dedent(input: string) {
	const indent = indentation(input);
	const lines = input.split(/\r?\n/);
	return lines.map((l) => l.slice(indent)).join('\n');
}

function indentation(line: string) {
	return (/^\s*/.exec(line) || [''])[0].length;
}
