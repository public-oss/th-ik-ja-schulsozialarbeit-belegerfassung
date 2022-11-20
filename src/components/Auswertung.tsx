import { SelectOption } from '@public-ui/components';
import { KolHeading, KolSelect, KolTable } from '@public-ui/react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { getRoot } from '../react-roots';
import { ARTEN } from '../shared/constants';
import { getBelege, getMeta, subscribeBelege } from '../shared/store';
import { Beleg, Kind } from '../shared/types';

export const Auswertung: FunctionComponent = () => {
	const [belege, setBelege] = useState<Map<string, Beleg>>(getBelege());
	const [year, setYear] = useState<number>(0);
	const [kind, setKind] = useState<Kind>('Verbrauchsmaterialen');

	const belege$ = subscribeBelege(setBelege);

	useEffect(() => {
		filterBelege(year, kind);
		return () => {
			belege$.unsubscribe();
		};
	}, [year, kind]);

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
				{/* <div className="sm:text-right sm:order-2">
					<img alt="Logo Freistaat Thüringen" className="pt-4 pr-4" src="https://thueringen.de/styleguide/freistaat-thueringen-logo.svg" width="200" />
					<img alt="Logo Ilm-Kreis in Thüringen" className="pt-4 pr-4" src="https://www.ilm-kreis.de/media/custom/2778_1182_1_g.PNG" width="200" />
				</div> */}
				<KolHeading>Belegauswertung</KolHeading>
			</div>
			<div className="not-print grid md:grid-cols-2 gap-4">
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
						onChange: (_event, values: Kind[]) => {
							setKind(values[0]);
						},
					}}
					_value={[kind]}
				>
					Art
				</KolSelect>
			</div>
			<div className="only-print grid md:grid-cols-2 gap-4">
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
								render: (el, _cell, tupel, data) => {
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
								render: (el, _cell, tupel) => {
									getRoot(el).render(renderer('in', tupel as Beleg));
								},
							},
							{
								label: 'Ausgabe',
								key: 'amount',
								render: (el, _cell, tupel) => {
									getRoot(el).render(renderer('out', tupel as Beleg));
								},
							},
						],
					],
				}}
				_data={Array.from(belege.values())}
				className="printable"
			></KolTable>
		</>
	);
};
