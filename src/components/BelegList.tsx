import { KolButton, KolTable } from '@public-ui/react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { getRoot } from '../react-roots';
import { getBelege, removeBeleg, subscribeBelege } from '../shared/store';
import { Beleg } from '../shared/types';

export const BelegList: FunctionComponent = () => {
	const [belege, setBelege] = useState<Map<string, Beleg>>(getBelege());

	useEffect(console.log, [belege]);

	const belege$ = subscribeBelege(setBelege);

	useEffect(() => {
		return () => {
			belege$.unsubscribe();
		};
	}, []);

	return (
		<KolTable
			_caption="Belegliste"
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
							label: 'Zahlung',
							key: 'payment',
							render: (el, _cell, tupel) => {
								getRoot(el).render(
									<kol-span
										_icon={`fa-solid fa-arrow-${tupel.payment === 'in' ? 'right' : 'left'}`}
										_label={tupel.payment === 'in' ? 'Einzahlung' : 'Auszahlung'}
									></kol-span>
								);
							},
						},
						{
							label: 'Art',
							key: 'kind',
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
							label: 'Betrag',
							key: 'amount',
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
										{index + 1} €
									</span>
								);
							},
						},
						{
							label: 'Verwendungszweck',
							key: 'reason',
						},
						{
							label: 'Empfänger:in',
							key: 'receiver',
						},
						{
							label: 'Aktionen',
							key: '',
							textAlign: 'center',
							render: (el, _cell, tupel) => {
								getRoot(el).render(
									<div style={{ display: 'flex', gap: '.5em', justifyContent: 'center' }}>
										<KolButton _icon="fa-solid fa-edit" _iconOnly _label="Bearbeiten" _variant="secondary"></KolButton>
										<KolButton
											_icon="fa-solid fa-trash"
											_on={{
												onClick: () => {
													removeBeleg(tupel as Beleg);
												},
											}}
											_iconOnly
											_label="Löschen"
											_variant="secondary"
										></KolButton>
									</div>
								);
							},
						},
					],
				],
			}}
			_data={Array.from(belege.values())}
			_pagination
			_minWidth="75em"
			className="contents"
		></KolTable>
	);
};
