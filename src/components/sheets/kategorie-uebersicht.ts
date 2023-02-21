import { Row, SheetData } from 'write-excel-file';
import { Beleg, CategoryEnum, SheetPack, SheetPackGeneratorByCategory } from '../../shared/types';

const getIncome = (belege: Map<number, Beleg>, category: CategoryEnum) => {
	let debit = 0;
	belege.forEach((beleg) => {
		if (beleg.kind === category) {
			if (beleg.payment === 'in') {
				debit += beleg.amount;
			}
		}
	});
	return debit;
};

const getOutgoings = (belege: Map<number, Beleg>, category: CategoryEnum) => {
	let debit = 0;
	belege.forEach((beleg) => {
		if (beleg.kind === category) {
			if (beleg.payment === 'out') {
				debit += beleg.amount;
			}
		}
	});
	return debit;
};

type HeadCell<T> = {
	align: 'center';
	borderStyle: 'thin';
	fontWeight: 'bold';
	value?: T;
};

const getHeadCell = <T>(value: T): HeadCell<T> => {
	return {
		align: 'center',
		borderStyle: 'thin',
		fontWeight: 'bold',
		value,
	};
};

const getHeader = (category: CategoryEnum): SheetData => [
	[
		{
			value: 'Kostenübersicht',
			fontWeight: 'bold',
			fontSize: 16,
		},
		{},
		{},
		{
			value: category,
			fontSize: 16,
		},
	],
	[],
	[
		getHeadCell('lfd. Nr.'),
		getHeadCell('Beleg-Nr.'),
		getHeadCell('Tag der Zahlung'),
		getHeadCell('Empfänger:in'),
		getHeadCell('Grund'),
		getHeadCell('Einnahme'),
		getHeadCell('Ausgabe'),
	],
	[],
];

export const getKategorieUebersicht: SheetPackGeneratorByCategory = (belege: Map<number, Beleg>, category: CategoryEnum): SheetPack => {
	const rows: SheetData = [];
	let credit = 0;
	let debit = 0;
	let idx = 1;
	belege.forEach((beleg) => {
		if (beleg.kind === category) {
			credit += beleg.payment === 'in' ? beleg.amount : 0;
			debit += beleg.payment === 'out' ? beleg.amount : 0;
			rows.push([
				{
					alignVertical: 'center',
					borderStyle: 'thin',
					value: idx++,
				},
				{
					alignVertical: 'center',
					borderStyle: 'thin',
					value: beleg.nr,
				},
				{
					alignVertical: 'center',
					borderStyle: 'thin',
					format: 'dd.mm.yyyy',
					type: Date,
					value: new Date(beleg.date),
				},
				{
					value: beleg.receiver,
					borderStyle: 'thin',
				},
				{
					value: beleg.reason,
					borderStyle: 'thin',
				},
				{
					borderStyle: 'thin',
					value: beleg.payment === 'in' ? beleg.amount : 0,
					format: '#,##0.00',
					type: Number,
				},
				{
					borderStyle: 'thin',
					value: beleg.payment === 'out' ? beleg.amount : 0,
					format: '#,##0.00',
					type: Number,
				},
			]);
		}
	});

	rows.push(
		[],
		[
			{},
			{},
			{},
			{},
			{
				align: 'right',
				value: 'Gesamt',
				fontWeight: 'bold',
				fontSize: 12,
			},
			{
				value: credit,
				fontWeight: 'bold',
				fontSize: 12,
				backgroundColor: '#c0c0c0',
				format: '#,##0.00',
				type: Number,
			},
			{
				value: debit,
				fontWeight: 'bold',
				fontSize: 12,
				backgroundColor: '#c0c0c0',
				format: '#,##0.00',
				type: Number,
			},
		]
	);

	return {
		title: category.substring(0, 31),
		columns: [{ width: 10 }, { width: 10 }, { width: 15 }, { width: 30 }, { width: 50 }, { width: 15 }, { width: 15 }],
		rows: getHeader(category).concat(rows),
	};
};
