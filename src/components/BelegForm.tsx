import { FormControl, InputControl } from '@leanup/form';
import { LeanInputAdapter } from '@leanup/kolibri-react';
import { Option, SelectOption } from '@public-ui/components';
import { KoliBriFormCallbacks } from '@public-ui/components/dist/types/components/form/component';
import { KolAbbr, KolAlert, KolButton, KolForm, KolInputDate, KolInputNumber, KolInputRadio, KolInputText, KolSelect } from '@public-ui/react';
import React, { FunctionComponent, useState } from 'react';
import { addBeleg, getBelege } from '../shared/store';

const TODAY = new Date(Date.now());

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
		value: '',
	},
	{
		label: 'Verbrauchsmaterialen',
		value: '',
	},
	{
		label: 'Fortbildungen, Supervision',
		value: '',
	},
	{
		label: 'Einzelfallhilfe',
		value: '',
	},
	{
		label: 'Sozialpädagogische Gruppenarbeit',
		value: '',
	},
	{
		label: `AG's`,
		value: '',
	},
	{
		label: 'Prävention, Gesundheitsförderung',
		value: '',
	},
];

export const BelegForm: FunctionComponent = () => {
	const [form, setForm] = useState(new BelegFormControl());
	const [error, setError] = useState('');

	const reset = () => {
		setForm(new BelegFormControl());
		setError('');
	};

	const onForm: KoliBriFormCallbacks = {
		onReset: (...args) => {
			console.log('reset', args);
			reset();
		},
		onSubmit: (...args) => {
			console.log('submit', args);
			form.disabled = true;
			try {
				addBeleg(form.getData());
				reset();
			} catch (e) {
				setError((e as Error).message);
			}
		},
	};

	return (
		<div className="grid gap-4">
			<KolForm _on={onForm}>
				<div className="grid gap-4">
					<div className="grid sm:grid-cols-2 gap-4 text">
						<LeanInputAdapter _control={form.getInput('payment') as InputControl}>
							<KolInputRadio _id="payment" _orientation="horizontal" _list={AUS_EIN}>
								Zahlung
							</KolInputRadio>
						</LeanInputAdapter>
						<div></div>
						<LeanInputAdapter _control={form.getInput('kind') as InputControl}>
							<KolSelect _id="kind" _list={ARTEN}>
								Art
							</KolSelect>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('nr') as InputControl}>
							<KolInputText _id="nr">Belegnummer</KolInputText>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('date') as InputControl}>
							<KolInputDate _id="nr" _max={TODAY}>
								<KolAbbr _title="* Hinweis: Als Zahlungsdatum ist bei unbar bezahlten Rechnungen (Überweisungen) das Datum der Wertstellung laut Kontoauszug einzutragen!">
									Zahlungsdatum
								</KolAbbr>
							</KolInputDate>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('amount') as InputControl}>
							<KolInputNumber _id="nr">Betrag</KolInputNumber>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('reason') as InputControl}>
							<KolInputText _id="nr">Zahlungsgrund/Verwendungszweck</KolInputText>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('receiver') as InputControl}>
							<KolInputText _id="nr">Zahlungsempfänger</KolInputText>
						</LeanInputAdapter>
					</div>
					{error.length > 0 && (
						<KolAlert _alert _heading="Fehler" _type="error" _variant="card">
							{error}
						</KolAlert>
					)}
					<div className="flex gap-4 justify-end">
						<KolButton _label="Speichern" _type="submit" _variant="primary" />
						<KolButton _label="Zurücksetzen" _type="reset" />
					</div>
				</div>
			</KolForm>
		</div>
	);
};
