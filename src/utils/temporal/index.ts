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

const str = (v: DateValue) => `${v}`;
const pad = (v: DateValue, len = 2) => str(v).padStart(len, '0');

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
	};

	return (date?: DateValue) => {
		const check = current(date);
		if (Number.isNaN(check)) {
			throw SyntaxError('Invalid Date');
		}

		const tzo = base === 'UTC' ? 0 : check.getTimezoneOffset();
		const marker = now.hours(check) < 12 ? 'AM' : 'PM';
		const timezone = [Math.floor(Math.abs(tzo) / 60), Math.abs(tzo) % 60];
		const sign = tzo > 0 ? '-' : '+';

		const tokens = {
			D: () => str(now.date(check)),
			DD: () => pad(now.date(check)),
			DDD: () => word.days[now.day(check)].slice(0, 3),
			DDDD: () => word.days[now.day(check)],
			M: () => str(now.month(check) + 1),
			MM: () => pad(now.month(check) + 1),
			MMM: () => word.months[now.month(check)].slice(0, 3),
			MMMM: () => word.months[now.month(check)],
			YY: () => str(now.year(check)).slice(2),
			YYYY: () => str(now.year(check)),
			H: () => str(now.hours(check)),
			HH: () => pad(now.hours(check)),
			h: () => str(now.hours(check) % 12 || 12),
			hh: () => pad(now.hours(check) % 12 || 12),
			m: () => str(now.minutes(check)),
			mm: () => pad(now.minutes(check)),
			str: () => str(now.seconds(check)),
			ss: () => pad(now.seconds(check)),
			a: marker,
			p: marker,
			A: marker,
			P: marker,
			Z: () => `${sign}${timezone[0]}`,
			ZZ: () => `${sign}${pad(timezone[0])}${timezone[1]}`,
			ZZZ: () => `${sign}${pad(timezone[0])}:${timezone[1]}`,
		};

		return (mask = 'DDDD, DD MMMM YYYY') => {
			return mask.replace(REGEX, ($) => {
				const exe = tokens[$ as keyof typeof tokens];
				if (!exe) return $.slice(1, $.length - 1);
				return typeof exe === 'string' ? exe : exe();
			});
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
