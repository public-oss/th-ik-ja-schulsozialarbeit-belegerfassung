import { AbstractFormatter, FormatHandler, FormatHandler } from '@leanup/form';
import { Option, SelectOption } from '@public-ui/components';
import { CategoryEnum, PaymentEnum } from './types';

export const AUS_EIN: Option<PaymentEnum>[] = [
	{
		label: 'Einzahlung',
		value: PaymentEnum.Einzahlung,
	},
	{
		label: 'Ausgabe',
		value: PaymentEnum.Auszahlung,
	},
];

export const ARTEN: SelectOption<CategoryEnum>[] = [
	{
		label: 'Projektbezogenen Verwaltungskosten',
		value: CategoryEnum['Projektbezogenen Verwaltungskosten'],
	},
	{
		label: 'Verbrauchsmaterialen',
		value: CategoryEnum.Verbrauchsmaterialen,
	},
	{
		label: 'Fortbildungen, Supervision',
		value: CategoryEnum['Fortbildungen, Supervision'],
	},
	{
		label: 'Einzelfallhilfe',
		value: CategoryEnum.Einzelfallhilfe,
	},
	{
		label: 'Sozialpädagogische Gruppenarbeit',
		value: CategoryEnum['Sozialpädagogische Gruppenarbeit'],
	},
	{
		label: 'Innerschulische Vernetzung',
		value: CategoryEnum['Innerschulische Vernetzung'],
	},
	{
		label: 'Prävention, Gesundheitsförderung',
		value: CategoryEnum['Prävention, Gesundheitsförderung'],
	},
];

export const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
export const dateFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' });

class FormatNumber extends AbstractFormatter {
	public parse(value: string): number {
		return parseFloat(value);
	}
	public format(value: unknown): unknown {
		return value;
	}
}

export const numberFormatHandler = new FormatHandler();
numberFormatHandler.add(new FormatNumber());
