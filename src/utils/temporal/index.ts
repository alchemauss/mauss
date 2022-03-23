type DateValue = string | number | Date;
function current(d?: DateValue): Date {
	if (d instanceof Date) return d;
	return d ? new Date(d) : new Date();
}
export { current as new };

const word = {
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	months: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
};

const REGEX = /D{1,4}|M{1,4}|YY(?:YY)?|([hHmsAPap])\1?|Z{1,3}|\[([^\]\[]|\[[^\[\]]*\])*\]/g;
interface FormatOptions {
	base?: 'UTC';
}
export function format({ base }: FormatOptions = {}) {
	const method = base === 'UTC' ? 'getUTC' : 'get';
	const now: Record<string, (d: Date) => number> = {
		date: (d) => d[`${method}Date`](),
		day: (d) => d[`${method}Day`](),
		month: (d) => d[`${method}Month`](),
		year: (d) => d[`${method}FullYear`](),
		hours: (d) => d[`${method}Hours`](),
		minutes: (d) => d[`${method}Minutes`](),
		seconds: (d) => d[`${method}Seconds`](),
		tzo: (d) => (base === 'UTC' ? 0 : d.getTimezoneOffset()),
	};

	const s = (v: string | number | Date) => `${v}`;
	const p = (v: string | number, len = 2) => s(v).padStart(len, '0');

	const marker = (d: Date) => (now.hours(d) < 12 ? 'AM' : 'PM');
	const timezone = (d: Date) => {
		const abs = Math.abs(now.tzo(d));
		return [Math.floor(abs / 60), abs % 60];
	};

	return (date?: DateValue) => {
		const check = current(date);
		if (Number.isNaN(check)) {
			throw SyntaxError('Invalid Date');
		}

		const sign = now.tzo(check) > 0 ? '-' : '+';
		const tokens = {
			D: () => s(now.date(check)),
			DD: () => p(now.date(check)),
			DDD: () => word.days[now.day(check)].slice(0, 3),
			DDDD: () => word.days[now.day(check)],
			M: () => s(now.month(check) + 1),
			MM: () => p(now.month(check) + 1),
			MMM: () => word.months[now.month(check)].slice(0, 3),
			MMMM: () => word.months[now.month(check)],
			YY: () => s(now.year(check)).slice(2),
			YYYY: () => s(now.year(check)),
			H: () => s(now.hours(check)),
			HH: () => p(now.hours(check)),
			h: () => s(now.hours(check) % 12 || 12),
			hh: () => p(now.hours(check) % 12 || 12),
			m: () => s(now.minutes(check)),
			mm: () => p(now.minutes(check)),
			s: () => s(now.seconds(check)),
			ss: () => p(now.seconds(check)),
			a: marker,
			p: marker,
			A: marker,
			P: marker,
			Z: () => `${sign}${timezone(check)[0]}`,
			ZZ: () => {
				const [h, m] = timezone(check);
				return `${sign}${p(h)}${p(m)}`;
			},
			ZZZ: () => {
				const [h, m] = timezone(check);
				return `${sign}${p(h)}:${p(m)}`;
			},
		};

		function replacer($: string, d: Date) {
			const exe = tokens[$ as keyof typeof tokens];
			return exe ? exe(d) : $.slice(1, $.length - 1);
		}

		return function (mask = 'DDDD, DD MMMM YYYY') {
			return mask.replace(REGEX, ($) => replacer($, check));
		};
	};
}

interface TravelOptions {
	/** relative point of reference to travel */
	from?: DateValue;
	/** relative days to travel in number */
	to: number;
}
export function travel({ from, to }: TravelOptions) {
	if (Number.isNaN((from = current(from)))) {
		throw SyntaxError('Invalid Date');
	}

	const [days, fragment = '0'] = `${to}`.split('.');
	const sign = days[0] === '-' ? -1 : 1;
	const hours = Math.round(+`0.${fragment}` * 24);
	const epoch = sign * (Math.abs(+days * 24) + hours);
	return current(+from + epoch * /* 1 hour */ 36e5);
}
