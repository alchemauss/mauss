import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import * as obj from './object.js';

const basics = {
	iterate: suite('obj:iterate'),
};

basics.iterate('iterate over nested objects', () => {
	const months = 'jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec'.split(',');
	const currencies = 'usd,eur,sgd,gbp,aud,jpy'.split(',');

	const statement = currencies.reduce(
		(cs, c) => ({ ...cs, [c]: { income: 100, expense: 40 } }),
		{} as { [k: string]: { income: number; expense: number } }
	);
	const nested = months.reduce(
		(ms, m) => ({ ...ms, [m]: statement }),
		{} as { [k: string]: typeof statement }
	);

	assert.equal(
		obj.iterate(nested, ([month, v]) => {
			const updated = obj.iterate(v, ([currency, { income, expense }]) => {
				return [currency, { balance: income - expense }];
			});
			return [month, updated];
		}),
		months.reduce((a, m) => {
			a[m] = {
				usd: { balance: 60 },
				eur: { balance: 60 },
				sgd: { balance: 60 },
				gbp: { balance: 60 },
				aud: { balance: 60 },
				jpy: { balance: 60 },
			};
			return a;
		}, {})
	);
});

Object.values(basics).forEach((v) => v.run());
