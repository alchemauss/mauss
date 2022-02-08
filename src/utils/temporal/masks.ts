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

const s = (v: string | number | Date) => `${v}`;
const p = (v: string | number, len = 2) => s(v).padStart(len, '0');

type MaskOptions = { date: Date; base?: 'UTC' };
export default ({ date, base }: MaskOptions): Record<MaskToken, () => string> => {
	const method = base === 'UTC' ? 'getUTC' : 'get';
	const now = {
		date: () => date[`${method}Date`](),
		day: () => date[`${method}Day`](),
		month: () => date[`${method}Month`](),
		year: () => date[`${method}FullYear`](),
		hours: () => date[`${method}Hours`](),
		minutes: () => date[`${method}Minutes`](),
		seconds: () => date[`${method}Seconds`](),
		tzo: base === 'UTC' ? 0 : date.getTimezoneOffset(),
	};

	const marker = () => (now.hours() < 12 ? 'AM' : 'PM');
	const timezone = (colon = '') => {
		const sign = now.tzo > 0 ? '-' : '+';
		const abs = Math.abs(now.tzo);
		const h = p(Math.floor(abs / 60));
		const m = p(abs % 60);
		return `${sign}${h}${colon}${m}`;
	};

	return {
		D: () => s(now.date()),
		DD: () => p(now.date()),
		DDD: () => word.days[now.day()].slice(0, 3),
		DDDD: () => word.days[now.day()],
		M: () => s(now.month() + 1),
		MM: () => p(now.month() + 1),
		MMM: () => word.months[now.month()].slice(0, 3),
		MMMM: () => word.months[now.month()],
		YY: () => s(now.year()).slice(2),
		YYYY: () => s(now.year()),
		H: () => s(now.hours()),
		HH: () => p(now.hours()),
		h: () => s(now.hours() % 12 || 12),
		hh: () => p(now.hours() % 12 || 12),
		m: () => s(now.minutes()),
		mm: () => p(now.minutes()),
		s: () => s(now.seconds()),
		ss: () => p(now.seconds()),
		a: marker,
		p: marker,
		A: marker,
		P: marker,
		Z: () => timezone(),
		ZZ: () => timezone(':'),
	};
};

type TokenDays = 'D' | 'DD' | 'DDD' | 'DDDD';
type TokenMonths = 'M' | 'MM' | 'MMM' | 'MMMM';
type TokenYears = 'YY' | 'YYYY';
type TokenHours = 'H' | 'HH' | 'h' | 'hh';
type TokenMinutes = 'm' | 'mm';
type TokenSeconds = 's' | 'ss';
/** time marker, AM / PM */
type TokenMarker = 'a' | 'p' | 'A' | 'P';
/** timezone offset */
type TokenOffset = 'Z' | 'ZZ';
type MaskToken =
	| TokenDays
	| TokenMonths
	| TokenYears
	| TokenHours
	| TokenMinutes
	| TokenSeconds
	| TokenMarker
	| TokenOffset;
