type DateValue = string | number | Date;
export function current(d?: DateValue) {
	if (d instanceof Date) return d;
	return d ? new Date(d) : new Date();
}

const str = (v: DateValue) => `${v}`;
const pad = (v: DateValue, len = 2) => str(v).padStart(len, '0');

export const i18n: Record<string, { days: string[]; months: string[] }> = {
	en: {
		days: 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'.split('|'),
		months: [
			...'January|February|March|April|May|June|July'.split('|'),
			...'August|September|October|November|December'.split('|'),
		],
	},
};

interface BuildOptions {
	base?: 'UTC';
	lang?: string;
}
export function build({ base, lang }: BuildOptions) {
	const method = base === 'UTC' ? 'getUTC' : 'get';
	const { days, months } = i18n[lang || 'en'];

	return function formatter(date?: DateValue) {
		const d = current(date);
		if (Number.isNaN(+d)) throw SyntaxError('Invalid Date');

		const now: Record<string, () => number> = {
			date: () => d[`${method}Date`](),
			day: () => d[`${method}Day`](),
			month: () => d[`${method}Month`](),
			year: () => d[`${method}FullYear`](),
			hours: () => d[`${method}Hours`](),
			minutes: () => d[`${method}Minutes`](),
			seconds: () => d[`${method}Seconds`](),
		};

		const tzo = base === 'UTC' ? 0 : d.getTimezoneOffset();
		const abs = Math.abs(tzo);
		const tz = [Math.floor(abs / 60), abs % 60];
		const marker = now.hours() < 12 ? 'AM' : 'PM';
		const sign = tzo > 0 ? '-' : '+';

		const tokens = {
			D: () => str(now.date()),
			DD: () => pad(now.date()),
			DDD: () => days[now.day()].slice(0, 3),
			DDDD: () => days[now.day()],

			M: () => str(now.month() + 1),
			MM: () => pad(now.month() + 1),
			MMM: () => months[now.month()].slice(0, 3),
			MMMM: () => months[now.month()],

			YY: () => str(now.year()).slice(2),
			YYYY: () => str(now.year()),

			H: () => str(now.hours()),
			HH: () => pad(now.hours()),
			h: () => str(now.hours() % 12 || 12),
			hh: () => pad(now.hours() % 12 || 12),
			m: () => str(now.minutes()),
			mm: () => pad(now.minutes()),
			s: () => str(now.seconds()),
			ss: () => pad(now.seconds()),

			a: marker,
			p: marker,
			A: marker,
			P: marker,
			Z: () => `${sign}${tz[0]}`,
			ZZ: () => `${sign}${pad(tz[0])}${tz[1]}`,
			ZZZ: () => `${sign}${pad(tz[0])}:${tz[1]}`,
		};

		return function renderer(mask = 'DDDD, DD MMMM YYYY') {
			const EXP = /D{1,4}|M{1,4}|YY(?:YY)?|([hHmsAPap])\1?|Z{1,3}|\[([^\]\[]|\[[^\[\]]*\])*\]/g;
			return mask.replace(EXP, ($) => {
				const exe = tokens[$ as keyof typeof tokens];
				if (!exe) return $.slice(1, $.length - 1);
				return typeof exe === 'string' ? exe : exe();
			});
		};
	};
}

export const format = build({});

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
