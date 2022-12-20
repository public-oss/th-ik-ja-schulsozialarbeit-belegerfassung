import { KolCard, KolHeading, KolLink, KolTable } from '@public-ui/react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { currencyFormatter } from '../shared/constants';
import { getBelege, getMeta } from '../shared/store';
import { Beleg, Budget, Category, CategoryEnum } from '../shared/types';

type Overview = {
	category: Category;
	budget: Budget;
};

export const BUDGET_OVERVIEW: Overview[] = [
	{
		budget: {
			credit: 0,
			debit: 0,
		},
		category: 'Projektbezogenen Verwaltungskosten',
	},
	{
		budget: {
			credit: 0,
			debit: 0,
		},
		category: 'Verbrauchsmaterialen',
	},
	{
		budget: {
			credit: 0,
			debit: 0,
		},
		category: 'Fortbildungen, Supervision',
	},
	{
		budget: {
			credit: 0,
			debit: 0,
		},
		category: 'Einzelfallhilfe',
	},
	{
		budget: {
			credit: 0,
			debit: 0,
		},
		category: 'Sozialpädagogische Gruppenarbeit',
	},
	{
		budget: {
			credit: 0,
			debit: 0,
		},
		category: 'Innerschulische Vernetzung',
	},
	{
		budget: {
			credit: 0,
			debit: 0,
		},
		category: 'Prävention, Gesundheitsförderung',
	},
	{
		budget: {
			credit: 0,
			debit: 0,
		},
		category: 'Bar',
	},
];

const getDebit = (belege: Map<string, Beleg>, category: CategoryEnum) => {
	let debit = 0;
	belege.forEach((beleg) => {
		if (beleg.kind === category) {
			if (beleg.payment === 'in') {
				debit -= beleg.amount;
			} else {
				debit += beleg.amount;
			}
		}
	});
	return debit;
};
const getDebitCash = (belege: Map<string, Beleg>) => {
	let debit = 0;
	belege.forEach((beleg) => {
		if (beleg.cash === true) {
			if (beleg.payment === 'in') {
				debit -= beleg.amount;
			} else {
				debit += beleg.amount;
			}
		}
	});
	return debit;
};

export const Dashboard: FunctionComponent = () => {
	const [budget] = useState<any[]>(BUDGET_OVERVIEW);

	useEffect(() => {
		const meta = getMeta();
		const belege = getBelege();

		BUDGET_OVERVIEW[0].budget.credit = meta[`budget0`];
		BUDGET_OVERVIEW[0].budget.debit = getDebit(belege, CategoryEnum['Projektbezogenen Verwaltungskosten']);

		BUDGET_OVERVIEW[1].budget.credit = meta[`budget1`];
		BUDGET_OVERVIEW[1].budget.debit = getDebit(belege, CategoryEnum.Verbrauchsmaterialen);

		BUDGET_OVERVIEW[2].budget.credit = meta[`budget2`];
		BUDGET_OVERVIEW[2].budget.debit = getDebit(belege, CategoryEnum['Fortbildungen, Supervision']);

		BUDGET_OVERVIEW[3].budget.credit = meta[`budget3`];
		BUDGET_OVERVIEW[3].budget.debit = getDebit(belege, CategoryEnum.Einzelfallhilfe);

		BUDGET_OVERVIEW[4].budget.credit = meta[`budget4`];
		BUDGET_OVERVIEW[4].budget.debit = getDebit(belege, CategoryEnum['Sozialpädagogische Gruppenarbeit']);

		BUDGET_OVERVIEW[5].budget.credit = meta[`budget5`];
		BUDGET_OVERVIEW[5].budget.debit = getDebit(belege, CategoryEnum['Innerschulische Vernetzung']);

		BUDGET_OVERVIEW[6].budget.credit = meta[`budget6`];
		BUDGET_OVERVIEW[6].budget.debit = getDebit(belege, CategoryEnum['Prävention, Gesundheitsförderung']);

		BUDGET_OVERVIEW[7].budget.credit = meta[`budget7`];
		BUDGET_OVERVIEW[7].budget.debit = getDebitCash(belege);
	}, []);

	return (
		<div className="grid gap-2">
			<KolHeading>Dashboard</KolHeading>
			<p>Auf dieser Seite erhalten Sie eine Gesamtüberblick über Ihre Belegerfassung.</p>
			<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
				<KolCard _heading="Restbudget-Übersicht">
					<div className="m-2" slot="content">
						<KolTable
							_caption="Übersicht über das Restbudget"
							_headers={{
								horizontal: [
									[
										{
											label: 'Kategorie',
											key: 'category',
										},
										{
											label: 'Restbudget',
											key: 'budget',
											textAlign: 'right',
											render: (_el, _cell, tupel) => `${currencyFormatter.format(tupel.budget.credit - tupel.budget.debit)}`,
										},
									],
								],
							}}
							_data={budget}
						></KolTable>
					</div>
				</KolCard>
				<KolCard _heading="Anleitung">
					<div className="m-2" slot="content">
						<p>Gehen Sie Schritt für Schritt durch die Anwendung.</p>
						<ol>
							<li>
								Füllen Sie zuerst die <KolLink _href="/#/general">allgemeinen Angaben</KolLink> zu Ihnen, der Schule und den verfügbaren Budgets aus.
							</li>
							<li>
								Anschließend können Sie fortlaufend Ihre <KolLink _href="/#/form">Auszahlungs- und Einzahlungsbelege erfassen</KolLink>.
							</li>
							<li>
								Nachdem Sie Belege erfasst haben, sehen Sie auf dem Dashboard das aktuelle Restbudget und können{' '}
								<KolLink _href="/#/report">Auswertungen drucken</KolLink>.
							</li>
						</ol>
					</div>
				</KolCard>
			</div>
		</div>
	);
};
