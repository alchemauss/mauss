import { json } from '@sveltejs/kit';
import { exports } from '$ws/mauss/package.json';

export const prerender = true;

export interface Schema {
	[modules: string]: Array<{
		name: string;
		docs: string;
		signature: string;
	}>;
}

export async function GET() {
	const schema: Schema = {};

	for (const module in exports) {
		if (module.slice(2).includes('.')) continue;
		schema[module.slice(2) || 'core'] = [];
	}

	return json(schema);
}
