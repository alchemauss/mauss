import mutate from './mutate';

export const shuffle = (arr: any[]) => {
	const acc = arr.slice();
	return mutate.shuffle(acc), acc;
};
