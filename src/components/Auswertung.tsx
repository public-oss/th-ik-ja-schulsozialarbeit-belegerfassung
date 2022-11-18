import { KolHeading, KolSelect, KolTable } from '@public-ui/react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { getRoot } from '../react-roots';
import { ARTEN } from '../shared/constants';
import { getBelege, subscribeBelege } from '../shared/store';
import { Beleg, Kind } from '../shared/types';

export const Auswertung: FunctionComponent = () => {
	const [belege, setBelege] = useState<Map<string, Beleg>>(getBelege());
	const [kind, setKind] = useState<Kind>('Verbrauchsmaterialen');

	const belege$ = subscribeBelege(setBelege);

	useEffect(() => {
		return () => {
			belege$.unsubscribe();
		};
	}, []);

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

	return (
		<>
			<div className="grid sm:grid-cols-2 items-center align-center">
				<div className="sm:text-right sm:order-2">
					<img alt="Logo Freistaat Thüringen" className="pt-4 pr-4" src="https://thueringen.de/styleguide/freistaat-thueringen-logo.svg" width="250" />
				</div>
				<KolHeading>Belegauswertung</KolHeading>
			</div>
			<KolSelect
				_id="kind"
				_list={ARTEN}
				_on={{
					onChange: (_event, values) => {
						const belege: Map<string, Beleg> = new Map();
						getBelege().forEach((beleg) => {
							if (beleg.kind === values[0]) {
								belege.set(beleg.nr, beleg);
							}
						});
						setBelege(belege);
					},
				}}
				_value={[kind]}
			>
				Art
			</KolSelect>
			<KolTable
				_caption="Auswertung für ..."
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
			></KolTable>
		</>
	);
};
