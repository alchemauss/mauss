export async function pause(ms: number): Promise<string> {
	return new Promise((fulfil) => setTimeout(fulfil, ms));
}
