export const random = {
	float(max = 1, min = 0): number {
		[min, max] = [Math.ceil(min), Math.floor(max)];
		return Math.random() * (max - min) + min;
	},
	int(max = 1, min = 0): number {
		return Math.floor(this.float(max, min));
	},
	bool(): boolean {
		return this.float() < 0.5;
	},
	array(length: number, max: number, min = 0): Array<number> {
		return Array.from({ length }, () => this.int(max, min));
	},
	key(dict: Record<any, any>): string {
		const keys = Object.keys(dict);
		return keys[this.int(keys.length)];
	},
	val<T>(dict: Record<any, T>): T {
		const values = Object.values(dict);
		return values[this.int(values.length)];
	},
	hex(): string {
		return `#${~~(this.float() * (1 << 24)).toString(16)}`;
	},
	ipv4(): string {
		return [0, 1, 2, 3].map((i) => this.int(255) + (!i ? 1 : 0)).join('.');
	},

	/** unsafe and for fast prototyping only, use with caution for production */
	uuid(): string {
		return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) =>
			(+c ^ (this.float(16) >> (+c / 4))).toString(16)
		);
	},
};
