import { AbstractFormatter, AbstractValidator, FormatHandler, FormControl, InputControl, RequiredValidator, ValidationHandler } from '@leanup/form';
import { LeanInputAdapter } from '@leanup/kolibri-react';
import { Option, SelectOption } from '@public-ui/components';
import { KoliBriFormCallbacks } from '@public-ui/components/dist/types/components/form/component';
import { Iso8601 } from '@public-ui/components/dist/types/types/input/iso8601';
import { KolAbbr, KolAlert, KolButton, KolForm, KolInputDate, KolInputNumber, KolInputRadio, KolInputText, KolSelect } from '@public-ui/react';
import React, { FunctionComponent, useState } from 'react';
import { addBeleg, getAvailableReasons, getAvailableReceivers } from '../shared/store';

const TODAY = new Date(Date.now()).toISOString().slice(0, 10) as Iso8601;

class MyRequiredValidator extends RequiredValidator {
	public constructor() {
		super('Bitte geben Sie einen Wert ein.');
	}
}

class MyMinValidator extends AbstractValidator {
	public constructor() {
		super('Bitte geben Sie einen Wert größer 0 ein.');
	}
	public valid(value: string): boolean {
		return parseFloat(value) > 0;
	}
}

class SelectMapper extends AbstractFormatter {
	public parse(value: string[]): string {
		return value[0];
	}
	public format(value: string): string[] {
		return [value];
	}
}

const validationHandler = new ValidationHandler();
validationHandler.add(new MyRequiredValidator());

const validationHandlerMin = new ValidationHandler();
validationHandlerMin.add(new MyMinValidator());

const formatHandler = new FormatHandler();
formatHandler.add(new SelectMapper());

class BelegFormControl extends FormControl {
	public constructor() {
		super('beleg');

		this.addControl(new InputControl('payment', { mandatory: true }));
		this.addControl(new InputControl('kind', { mandatory: true }));
		this.addControl(new InputControl('nr', { mandatory: true }));
		this.addControl(new InputControl('date', { mandatory: true }));
		this.addControl(new InputControl('amount', { mandatory: true }));
		this.addControl(new InputControl('reason', { mandatory: true }));
		this.addControl(new InputControl('receiver', { mandatory: true }));

		this.getInput('kind')?.setFormatHandler(formatHandler);
		this.getInput('nr')?.setValidationHandler(validationHandler);
		this.getInput('date')?.setValidationHandler(validationHandler);
		this.getInput('amount')?.setValidationHandler(validationHandlerMin);
		this.getInput('reason')?.setValidationHandler(validationHandler);
		this.getInput('receiver')?.setValidationHandler(validationHandler);

		this.reset();
	}

	public readonly reset = () => {
		this.setData({
			payment: 'out',
			kind: '',
			nr: '',
			date: '',
			amount: 0.0,
			reason: '',
			receiver: '',
		});
		this.disabled = false;
	};
}

const AUS_EIN: Option<string>[] = [
	{
		label: 'Einnahme',
		value: 'in',
	},
	{
		label: 'Ausgabe',
		value: 'out',
	},
];

const ARTEN: SelectOption<string>[] = [
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

export const BelegForm: FunctionComponent = () => {
	const [form, setForm] = useState(new BelegFormControl());
	const [saved, setSaved] = useState(false);
	const [touched, setTouched] = useState(false);
	const [error, setError] = useState('');

	const reset = () => {
		setError('');
		setForm(new BelegFormControl());
		setTouched(false);
	};

	const onForm: KoliBriFormCallbacks = {
		onReset: (...args) => {
			console.log('reset', args);
			setSaved(false);
			reset();
		},
		onSubmit: (...args) => {
			console.log('submit', args);
			setError('');
			setSaved(false);
			setTouched(true);
			if (form.valid) {
				try {
					addBeleg(form.getData());
					setSaved(true);
					reset();
				} catch (e) {
					setError((e as Error).message);
				}
			}
		},
	};

	return (
		<div className="grid gap-4">
			<KolForm _on={onForm}>
				<div className="grid gap-4">
					<div className="grid md:grid-cols-2 gap-4 text">
						<LeanInputAdapter _control={form.getInput('payment') as InputControl}>
							<KolInputRadio _id="payment" _list={AUS_EIN} _orientation="horizontal" _touched={touched}>
								Zahlung
							</KolInputRadio>
						</LeanInputAdapter>
						<div></div>
						<LeanInputAdapter _control={form.getInput('kind') as InputControl}>
							<KolSelect _id="kind" _list={ARTEN} _touched={touched}>
								Art
							</KolSelect>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('nr') as InputControl}>
							<KolInputText _id="nr" _touched={touched}>
								Belegnummer
							</KolInputText>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('date') as InputControl}>
							<KolInputDate _id="nr" _max={TODAY} _touched={touched} _type="date">
								<KolAbbr _title="* Hinweis: Als Zahlungsdatum ist bei unbar bezahlten Rechnungen (Überweisungen) das Datum der Wertstellung laut Kontoauszug einzutragen!">
									Zahlungsdatum
								</KolAbbr>
							</KolInputDate>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('amount') as InputControl}>
							<KolInputNumber _id="nr" _touched={touched}>
								Betrag
							</KolInputNumber>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('reason') as InputControl}>
							<KolInputText _id="nr" _list={getAvailableReasons()} _touched={touched}>
								Zahlungsgrund/Verwendungszweck
							</KolInputText>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('receiver') as InputControl}>
							<KolInputText _id="nr" _list={getAvailableReceivers()} _touched={touched}>
								Zahlungsempfänger
							</KolInputText>
						</LeanInputAdapter>
					</div>
					{saved && (
						<KolAlert _alert _heading="Beleg gespeichert" _type="success" _variant="card">
							Der Beleg wurde erfolgreich gespeichert.
						</KolAlert>
					)}
					{error.length > 0 && (
						<KolAlert _alert _heading="Fehler" _type="error" _variant="card">
							{error}
						</KolAlert>
					)}
					<div className="grid md:flex md:gap-4 md:justify-end ">
						<KolButton className="w-full md:w-10em" _label="Speichern" _type="submit" _variant="primary" />
						<KolButton className="w-full md:w-10em" _label="Zurücksetzen" _type="reset" />
					</div>
				</div>
			</KolForm>
		</div>
	);
};
