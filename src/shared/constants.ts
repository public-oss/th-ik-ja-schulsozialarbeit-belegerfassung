import { Option, SelectOption } from '@public-ui/components';
import { Kind, Payment } from './types';

export const AUS_EIN: Option<Payment>[] = [
	{
		label: 'Einnahme',
		value: 'in',
	},
	{
		label: 'Ausgabe',
		value: 'out',
	},
];

export const ARTEN: SelectOption<Kind>[] = [
	{
		label: 'Projektbezogenen Verwaltungskosten',
		value: 'Projektbezogenen Verwaltungskosten',
	},
	{
		label: 'Verbrauchsmaterialen',
		value: 'Verbrauchsmaterialen',
	},
	{
		label: 'Fortbildungen, Supervision',
		value: 'Fortbildungen, Supervision',
	},
	{
		label: 'Einzelfallhilfe',
		value: 'Einzelfallhilfe',
	},
	{
		label: 'Sozialpädagogische Gruppenarbeit',
		value: 'Sozialpädagogische Gruppenarbeit',
	},
	{
		label: `AG's`,
		value: `AG's`,
	},
	{
		label: 'Prävention, Gesundheitsförderung',
		value: 'Prävention, Gesundheitsförderung',
	},
];
