import { Row, SheetData } from 'write-excel-file';
import { Beleg, CategoryEnum, SheetPack, SheetPackGenerator } from '../../shared/types';

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

const HEADER_ROW: SheetData = [
	[
		{
			value: 'Gesamtkostenübersicht',
			fontWeight: 'bold',
			fontSize: 16,
		},
		{
			align: 'center',
			value: 2022,
			fontSize: 16,
		},
	],
	[],
];
const SACHKOSTEN_ROW: SheetData = [
	[
		{
			value: 'Sachkosten',
			fontWeight: 'bold',
			fontSize: 14,
		},
		{},
		{},
		{
			align: 'center',
			value: 'Einnahme',
			fontWeight: 'bold',
			fontSize: 14,
		},
		{
			align: 'center',
			value: 'Ausgabe',
			fontWeight: 'bold',
			fontSize: 14,
		},
	],
	[],
];
const ARBEITSFELDER_ROW: SheetData = [
	[
		{
			value: 'Arbeitsfelder',
			fontWeight: 'bold',
			fontSize: 14,
		},
		{},
		{},
		{
			align: 'center',
			value: 'Einnahme',
			fontWeight: 'bold',
			fontSize: 14,
		},
		{
			align: 'center',
			value: 'Ausgabe',
			fontWeight: 'bold',
			fontSize: 14,
		},
	],
	[],
];

const getLine = (category: CategoryEnum, belege: Map<number, Beleg>): Row => {
	return [
		{
			value: category,
			fontWeight: 'bold',
		},
		{},
		{},
		{
			value: getIncome(belege, category),
			format: '#,##0.00',
			type: Number,
		},
		{
			value: getOutgoings(belege, category),
			format: '#,##0.00',
			type: Number,
		},
	];
};

const sumIncomes = (categories: CategoryEnum[], belege: Map<number, Beleg>) => {
	let sum = 0;
	categories.forEach((category) => {
		sum += getIncome(belege, category);
	});
	return sum;
};

const sumOutgoings = (categories: CategoryEnum[], belege: Map<number, Beleg>) => {
	let sum = 0;
	categories.forEach((category) => {
		sum += getOutgoings(belege, category);
	});
	return sum;
};

export const getKostenUebersicht: SheetPackGenerator = (belege: Map<number, Beleg>): SheetPack => {
	const sachRows: SheetData = [
		getLine(CategoryEnum['Einzelfallhilfe'], belege),
		getLine(CategoryEnum['Sozialpädagogische Gruppenarbeit'], belege),
		getLine(CategoryEnum['Prävention, Gesundheitsförderung'], belege),
		[
			{},
			{},
			{
				align: 'right',
				value: 'Gesamt',
				fontWeight: 'bold',
				fontSize: 12,
			},
			{
				backgroundColor: '#c0c0c0',
				value: sumIncomes(
					[CategoryEnum['Einzelfallhilfe'], CategoryEnum['Sozialpädagogische Gruppenarbeit'], CategoryEnum['Prävention, Gesundheitsförderung']],
					belege
				),
				format: '#,##0.00',
				type: Number,
				fontWeight: 'bold',
				fontSize: 12,
			},
			{
				backgroundColor: '#c0c0c0',
				value: sumOutgoings(
					[CategoryEnum['Einzelfallhilfe'], CategoryEnum['Sozialpädagogische Gruppenarbeit'], CategoryEnum['Prävention, Gesundheitsförderung']],
					belege
				),
				format: '#,##0.00',
				type: Number,
				fontWeight: 'bold',
				fontSize: 12,
			},
		],
	];

	const feldRows: SheetData = [
		getLine(CategoryEnum['Projektbezogenen Verwaltungskosten'], belege),
		getLine(CategoryEnum['Verbrauchsmaterialen'], belege),
		getLine(CategoryEnum['Fortbildungen, Supervision'], belege),
		getLine(CategoryEnum['Innerschulische Vernetzung'], belege),
		[
			{},
			{},
			{
				align: 'right',
				value: 'Gesamt',
				fontWeight: 'bold',
				fontSize: 12,
			},
			{
				backgroundColor: '#c0c0c0',
				value: sumIncomes(
					[
						CategoryEnum['Projektbezogenen Verwaltungskosten'],
						CategoryEnum['Verbrauchsmaterialen'],
						CategoryEnum['Fortbildungen, Supervision'],
						CategoryEnum['Innerschulische Vernetzung'],
					],
					belege
				),
				format: '#,##0.00',
				type: Number,
				fontWeight: 'bold',
				fontSize: 12,
			},
			{
				backgroundColor: '#c0c0c0',
				value: sumOutgoings(
					[
						CategoryEnum['Projektbezogenen Verwaltungskosten'],
						CategoryEnum['Verbrauchsmaterialen'],
						CategoryEnum['Fortbildungen, Supervision'],
						CategoryEnum['Innerschulische Vernetzung'],
					],
					belege
				),
				format: '#,##0.00',
				type: Number,
				fontWeight: 'bold',
				fontSize: 12,
			},
		],
	];

	return {
		title: 'Kostenübersicht',
		columns: [{ width: 50 }, { width: 10 }, { width: 10 }, { width: 15 }, { width: 15 }],
		rows: HEADER_ROW.concat(SACHKOSTEN_ROW).concat(sachRows).concat([[]]).concat(ARBEITSFELDER_ROW).concat(feldRows),
	};
};
