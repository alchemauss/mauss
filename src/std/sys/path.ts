export function join(...paths: string[]): string {
	const index = paths[0].trim();
	let final = index.replace(/[/]*$/g, '');
	for (let i = 1; i < paths.length; i += 1) {
		const part = paths[i].trim().replace(/(^[/]*|[/]*$)/g, '');
		if (part) final = final ? `${final}/${part}` : part;
	}
	return (index === '/' ? '/' : '') + final;
}
