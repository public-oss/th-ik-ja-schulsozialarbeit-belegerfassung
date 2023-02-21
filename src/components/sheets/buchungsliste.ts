import { SheetData } from 'write-excel-file';
import { Beleg, SheetPack, SheetPackGenerator } from '../../shared/types';

const HEADER_ROW: SheetData = [
	[
		{},
		{},
		{},
		{},
		{
			alignVertical: 'center',
			fontSize: 16,
			fontWeight: 'bold',
			value: 'Buchungsliste',
		},
	],
	[
		{},
		{},
		{},
		{},
		{
			alignVertical: 'center',
			fontWeight: 'bold',
			value: 'alle Ausgaben in chronologischer Reihenfolge',
		},
	],
	[
		{
			alignVertical: 'center',
			fontWeight: 'bold',
			value: 'Buchungsposition:',
		},
	],
	[
		{
			align: 'center',
			alignVertical: 'center',
			span: 6,
			value: '(Bei Bedarf weitere Zeilen einfügen!)',
		},
	],
	[],
	[
		{
			align: 'center',
			alignVertical: 'center',
			backgroundColor: '#c0c0c0',
			borderStyle: 'thin',
			fontWeight: 'bold',
			height: 30,
			value: 'lfd. Nr.',
		},
		{
			align: 'center',
			alignVertical: 'center',
			backgroundColor: '#c0c0c0',
			borderStyle: 'thin',
			fontWeight: 'bold',
			value: 'Beleg-Nr.',
		},
		{
			align: 'center',
			alignVertical: 'center',
			backgroundColor: '#c0c0c0',
			borderStyle: 'thin',
			fontWeight: 'bold',
			value: 'Zahlungsdatum*',
		},
		{
			align: 'center',
			alignVertical: 'center',
			backgroundColor: '#c0c0c0',
			borderStyle: 'thin',
			fontWeight: 'bold',
			value: 'Betrag in €',
		},
		{
			align: 'center',
			alignVertical: 'center',
			backgroundColor: '#c0c0c0',
			borderStyle: 'thin',
			fontWeight: 'bold',
			value: 'Zahlungsgrund / Verwendungszweck',
		},
		{
			align: 'center',
			alignVertical: 'center',
			backgroundColor: '#c0c0c0',
			borderStyle: 'thin',
			fontWeight: 'bold',
			value: 'Zahlungsempfänger/in',
		},
	],
];

export const getBuchungsliste: SheetPackGenerator = (belege: Map<number, Beleg>): SheetPack => {
	const rows: SheetData = [];
	let idx = 1;
	belege.forEach((beleg) => {
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
				alignVertical: 'center',
				borderStyle: 'thin',
				format: '#,##0.00',
				type: Number,
				value: beleg.amount,
			},
			{
				alignVertical: 'center',
				borderStyle: 'thin',
				value: beleg.reason,
			},
			{
				alignVertical: 'center',
				borderStyle: 'thin',
				value: beleg.receiver,
			},
		]);
	});
	rows.push([
		{
			alignVertical: 'center',
			fontSize: 8,
			span: 6,
			value: '* Hinweis: Als Zahlungsdatum ist bei unbar bezahlten Rechnungen (Überweisungen) das Datum der Wertstellung laut Kontoauszug einzutragen!',
		},
	]);

	return {
		title: 'Kostenübersicht',
		columns: [{ width: 10 }, { width: 10 }, { width: 15 }, { width: 15 }, { width: 50 }, { width: 25 }],
		rows: HEADER_ROW.concat(rows),
	};
};
