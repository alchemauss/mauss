export function date(x: string | Date, y: string | Date) {
	return new Date(y).getTime() - new Date(x).getTime();
}
export function time(x: string | Date, y: string | Date) {
	return Date.parse(`2017/08/28 ${y}`) - Date.parse(`2017/08/28 ${x}`);
}
