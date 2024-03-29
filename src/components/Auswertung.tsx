import { SelectOption } from '@public-ui/components';
import { KolButton, KolHeading, KolSelect, KolTable } from '@public-ui/react';
import React, { FC, useEffect, useState } from 'react';
import writeXlsxFile, { Columns, SheetData } from 'write-excel-file';
import { getRoot } from '../react-roots';
import { ARTEN, currencyFormatter, dateFormatter } from '../shared/constants';
import { getBelege, getMeta, subscribeBelege } from '../shared/store';
import { Beleg, Category, CategoryEnum } from '../shared/types';
import { getBuchungsliste } from './sheets/buchungsliste';
import { getKategorieUebersicht } from './sheets/kategorie-uebersicht';
import { getKostenUebersicht } from './sheets/kosten-uebersicht';

export const Auswertung: FC = () => {
	const [belege, setBelege] = useState<Map<string, Beleg>>(getBelege());
	const [year, setYear] = useState<number>(0);
	const [kind, setKind] = useState<Category>('Verbrauchsmaterialen');

	const belege$ = subscribeBelege(setBelege);

	useEffect(() => {
		filterBelege(year, kind);
		return () => {
			belege$.unsubscribe();
		};
	}, [year, kind]);

	const downloadExcel1 = async () => {
		const sheet = getBuchungsliste(getBelege());
		await writeXlsxFile(sheet.rows, {
			fileName: 'Buchungsliste 2022.xlsx',
			columns: sheet.columns,
			dateFormat: 'dd.mm.yyyy',
			fontFamily: 'Arial',
			fontSize: 10,
		});
	};

	const downloadExcel2 = async () => {
		const belege = getBelege();
		const sheets: string[] = [];
		const data: SheetData[] = [];
		const columns: Columns[] = [];

		// 'Kostenübersicht', 'Sachkosten', 'Einzelhilfe', 'Sozialpäd. GA', 'AGs', 'Prävention'
		[
			getKostenUebersicht(belege),
			getKategorieUebersicht(belege, CategoryEnum['Projektbezogenen Verwaltungskosten']),
			getKategorieUebersicht(belege, CategoryEnum['Verbrauchsmaterialen']),
			getKategorieUebersicht(belege, CategoryEnum['Fortbildungen, Supervision']),
			getKategorieUebersicht(belege, CategoryEnum['Einzelfallhilfe']),
			getKategorieUebersicht(belege, CategoryEnum['Sozialpädagogische Gruppenarbeit']),
			getKategorieUebersicht(belege, CategoryEnum['Prävention, Gesundheitsförderung']),
			getKategorieUebersicht(belege, CategoryEnum['Innerschulische Vernetzung']),
		].forEach((sheet) => {
			sheets.push(sheet.title);
			columns.push(sheet.columns);
			data.push(sheet.rows);
		});

		await writeXlsxFile(data, {
			fileName: 'Buchungsliste SSA GOETHE Ilmenau 2022.xlsx',
			sheets,
			columns,
			dateFormat: 'dd.mm.yyyy',
			fontFamily: 'Arial',
			fontSize: 10,
			orientation: 'landscape',
		});
	};

	const getYears = () => {
		const yearsMap: Set<number> = new Set();
		getBelege().forEach((beleg) => {
			try {
				const year = parseInt(beleg.date.substring(0, 4));
				if (false === isNaN(year)) {
					yearsMap.add(year);
				}
			} catch (e) {}
		});
		const sorted: SelectOption<number>[] = [];
		Array.from(yearsMap)
			.sort()
			.reverse()
			.forEach((year) => {
				sorted.push({
					label: `${year}`,
					value: year,
				});
			});
		return sorted;
	};
	getYears();

	const renderer = (payment: string, tupel: Beleg): React.ReactNode => {
		return payment === tupel.payment ? (
			<span
				style={{
					display: 'block',
					textAlign: 'right',
					width: 'full',
				}}
			>
				{tupel.amount} €
			</span>
		) : (
			<></>
		);
	};

	const filterBelege = (year: number, kind: string) => {
		const belege: Map<string, Beleg> = new Map();
		const yearRegEx = new RegExp(`^${year}-`);
		getBelege().forEach((beleg) => {
			if (yearRegEx.test(beleg.date) && beleg.kind === kind) {
				belege.set(beleg.nr, beleg);
			}
		});
		setBelege(belege);
	};

	const meta = getMeta();

	return (
		<>
			<div className="grid sm:grid-cols-2 items-center align-center">
				<KolButton
					_on={{
						onClick: downloadExcel1,
					}}
					_label="Download Excel 1"
				></KolButton>
				<KolButton
					_on={{
						onClick: downloadExcel2,
					}}
					_label="Download Excel 2"
				></KolButton>
				<div className="sm:text-right sm:order-2">
					{/* <img alt="Logo Freistaat Thüringen" className="pt-4 pr-4" src="https://thueringen.de/styleguide/freistaat-thueringen-logo.svg" width="200" /> */}
					{/* <img alt="Logo Ilm-Kreis in Thüringen" className="pt-4 pr-4" src="https://www.ilm-kreis.de/media/custom/2778_1182_1_g.PNG" width="200" /> */}
				</div>
				<KolHeading>Belegauswertung</KolHeading>
			</div>
			<div className="not-print grid md:grid-cols-[1fr_1fr_auto]  contents-end items-end gap-2">
				<KolSelect
					_id="year"
					_list={getYears()}
					_on={{
						onChange: (_event, values: number[]) => {
							setYear(values[0]);
						},
					}}
				>
					Jahr
				</KolSelect>
				<KolSelect
					_id="kind"
					_list={ARTEN}
					_on={{
						onChange: (_event, values: Category[]) => {
							setKind(values[0]);
						},
					}}
					_value={[kind]}
				>
					Art
				</KolSelect>
				<div className="grid sm:flex gap-2">
					<KolButton
						className="w-full md:w-10em"
						_on={{
							onClick: () => {
								window.print();
							},
						}}
						_icon="fa-solid fa-printer"
						_label="Drucken"
					/>
					<KolButton className="w-full md:w-10em" _icon="fa-solid fa-download" _label="Herunterladen" _disabled />
				</div>
			</div>
			<div className="only-print grid md:grid-cols-2 gap-2">
				<div>
					<strong>Schule:</strong> {meta.school}
				</div>
				<div>
					<strong>Erfassende(r):</strong> {meta.author}
				</div>
			</div>
			<KolTable
				_caption={`Auswertung für ${kind} im Jahr ${year}`}
				_headers={{
					horizontal: [
						[
							{
								label: 'lfd. Nr.',
								key: '',
								render: (el: HTMLElement, _cell, tupel, data) => {
									const index = data.indexOf(tupel);
									getRoot(el).render(
										<span
											style={{
												display: 'block',
												textAlign: 'right',
												width: 'full',
											}}
										>
											{index + 1}
										</span>
									);
								},
							},
							{
								label: 'Beleg-Nr.',
								key: 'nr',
							},
							{
								label: 'Datum',
								key: 'date',
								textAlign: 'center',
								render: (_el, _cell, tupel) => `${tupel.date ? dateFormatter.format(new Date(tupel.date)) : '-'}`,
							},
							{
								label: 'Empfänger:in',
								key: 'receiver',
							},
							{
								label: 'Verwendungszweck',
								key: 'reason',
							},
							{
								label: 'Einnahme',
								key: 'amount',
								textAlign: 'right',
								render: (_el, _cell, tupel) => `${tupel.amount ? currencyFormatter.format(tupel.amount) : '-'}`,
							},
							{
								label: 'Ausgabe',
								key: 'amount',
								textAlign: 'right',
								render: (_el, _cell, tupel) => `${tupel.amount ? currencyFormatter.format(tupel.amount) : '-'}`,
							},
						],
					],
				}}
				_data={Array.from(belege.values())}
				_minWidth="75em"
				className="printable"
			></KolTable>
		</>
	);
};
