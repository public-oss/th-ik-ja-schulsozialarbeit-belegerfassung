import { KoliBriDevHelper } from '@public-ui/components';
import { KolButton, KolTable } from '@public-ui/react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { getRoot } from '../react-roots';
import { currencyFormatter, dateFormatter } from '../shared/constants';
import { getBelege, subscribeBelege } from '../shared/store';
import { Beleg } from '../shared/types';

type Props = {
	edit: (beleg: Beleg) => void;
	remove: (event: PointerEvent, beleg: Beleg) => void;
};

export const BelegList: FunctionComponent<Props> = (props) => {
	const [belege, setBelege] = useState<Map<number, Beleg>>(getBelege());

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
							label: '#',
							key: '',
							width: '4em',
							textAlign: 'right',
							render: (el, _cell, tupel, data) => {
								const index = data.indexOf(tupel);
								getRoot(el).render(<span>{index + 1}</span>);
							},
						},
						{
							label: 'Zahlung',
							key: 'payment',
							width: '6em',
							textAlign: 'center',
							render: (_el, _cell, tupel) => `<kol-icon style="color:${
								tupel.payment === 'in' ? 'green' : 'red'
							}" _aria-label="" aria-labelledby="nonce" role="img"
							_icon="${`fa-solid fa-arrow-${tupel.payment === 'in' ? 'right' : 'left'}`}"
						></kol-icon><kol-tooltip _id="nonce" _label="${tupel.payment === 'in' ? 'Einzahlung' : 'Auszahlung'}"></kol-tooltip>&#160;
						<kol-icon style="color:${tupel.payment === 'in' ? 'blue' : 'purple'}" _aria-label="" aria-labelledby="nonce" role="img"
						_icon="${`fa-solid fa-${tupel.cash ? 'money-bill-1' : 'credit-card'}`}"
					></kol-icon><kol-tooltip _id="nonce" _label="${tupel.cash ? 'Barzahlung' : 'Kartenzahlung'}"></kol-tooltip>`,
						},
						{
							label: 'Art',
							key: 'kind',
							width: '12em',
							sort: (data: Beleg[]) => {
								data.sort((a, b) => {
									if (a.kind < b.kind) return -1;
									if (a.kind > b.kind) return 1;
									return 0;
								});
								return data;
							},
						},
						{
							label: 'Beleg-Nr.',
							key: 'nr',
							width: '10em',
							sort: (data: Beleg[]) => {
								data.sort((a, b) => {
									if (a.nr < b.nr) return -1;
									if (a.nr > b.nr) return 1;
									return 0;
								});
								return data;
							},
							textAlign: 'center',
						},
						{
							label: 'Datum',
							key: 'date',
							width: '8em',
							sort: (data: Beleg[]) => {
								data.sort((a, b) => {
									if (a.date < b.date) return -1;
									if (a.date > b.date) return 1;
									return 0;
								});
								return data;
							},
							textAlign: 'center',
							render: (_el, _cell, tupel) => `${tupel.date ? dateFormatter.format(new Date(tupel.date)) : '-'}`,
						},
						{
							label: 'Betrag',
							key: 'amount',
							width: '8em',
							textAlign: 'right',
							render: (_el, _cell, tupel) => `${tupel.amount ? currencyFormatter.format(tupel.amount) : '-'}`,
						},
						{
							label: 'Verwendungszweck',
							key: 'reason',
							width: '14em',
						},
						{
							label: 'Empfänger:in',
							key: 'receiver',
							width: '12em',
							sort: (data: Beleg[]) => {
								data.sort((a, b) => {
									if (a.receiver < b.receiver) return -1;
									if (a.receiver > b.receiver) return 1;
									return 0;
								});
								return data;
							},
						},
						{
							label: 'Aktionen',
							key: '',
							textAlign: 'center',
							render: (el, _cell, tupel) => {
								getRoot(el).render(
									<div style={{ display: 'flex', gap: '.5em', justifyContent: 'center' }}>
										<KolButton
											_icon="fa-solid fa-edit"
											_iconOnly
											_on={{
												onClick: () => {
													props.edit(tupel as Beleg);
													if (KoliBriDevHelper.querySelector('#payment-0')?.checked) {
														KoliBriDevHelper.scrollBySelector('#payment-0');
													} else if (KoliBriDevHelper.querySelector('#payment-1')?.checked) {
														KoliBriDevHelper.scrollBySelector('#payment-1');
													}
												},
											}}
											_label="Bearbeiten"
											_variant="secondary"
										></KolButton>
										<KolButton
											_icon="fa-solid fa-trash"
											_on={{
												onClick: (event) => {
													props.remove(event, tupel as Beleg);
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
			_data={[...Array.from(belege.values())]}
			_minWidth="80em"
			_pagination
		></KolTable>
	);
};
