type DateValue = string | number | Date;
export const date = {
	new: (d?: DateValue) => ((d instanceof Date && d) || d ? new Date(d) : new Date()),
	get now() {
		return new Date();
	},

	yesterday(relative?: Date) {
		if (!relative) relative = this.now;
		const diff = relative.getDate() - 1;
		return this.new(relative.setDate(diff));
	},
};

export const time = {};
