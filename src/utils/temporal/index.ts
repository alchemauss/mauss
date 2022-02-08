import tokenizer from './masks';

type DateValue = string | number | Date;
interface TravelOptions {
	/** relative point of reference to travel */
	from?: DateValue;
	/** relative days to travel in number */
	to?: number;
}

export const dt = {
	new: (d?: DateValue) => ((d instanceof Date && d) || d ? new Date(d) : new Date()),
	get now() {
		return new Date();
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

	travel({ from, to }: TravelOptions = {}) {
		if (Number.isNaN((from = this.new(from)))) {
			throw SyntaxError('Invalid Date');
		}

		const [days, fragment = '0'] = `${to}`.split('.');
		const sign = days[0] === '-' ? -1 : 1;
		const hours = Math.round(+`0.${fragment}` * 24);
		const epoch = sign * (Math.abs(+days * 24) + hours);
		return this.new(+from + epoch * /* 1 hour */ 36e5);
	},
};
