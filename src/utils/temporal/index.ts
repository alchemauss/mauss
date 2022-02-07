import tokenizer from './masks';

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

	format(date: DateValue, mask = 'DDDD, DD MMMM YYYY', base?: 'UTC') {
		if (Number.isNaN((date = this.new(date)))) {
			throw SyntaxError('Invalid Date');
		}

		const tokens = tokenizer({ date, base });

		return mask.replace(
			/D{1,4}|M{1,4}|YY(?:YY)?|([hHmsAPap])\1?|Z{1,2}|\[([^\]\[]|\[[^\[\]]*\])*\]/g,
			($) => ($ in tokens ? tokens[$ as keyof typeof tokens]() : $.slice(1, $.length - 1))
		);
	},
};
