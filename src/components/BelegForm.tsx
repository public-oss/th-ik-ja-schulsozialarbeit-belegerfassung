import { AbstractFormatter, AbstractValidator, FormatHandler, FormControl, InputControl, RequiredValidator, ValidationHandler } from '@leanup/form';
import { LeanInputAdapter } from '@leanup/kolibri-react';
import { KoliBriFormCallbacks } from '@public-ui/components/dist/types/components/form/component';
import { Iso8601 } from '@public-ui/components/dist/types/types/input/iso8601';
import {
	KolAbbr,
	KolAlert,
	KolButton,
	KolCard,
	KolForm,
	KolHeading,
	KolInputCheckbox,
	KolInputDate,
	KolInputNumber,
	KolInputRadio,
	KolInputText,
	KolModal,
	KolSelect,
} from '@public-ui/react';
import React, { FC, useState } from 'react';
import { ARTEN, AUS_EIN, numberFormatHandler } from '../shared/constants';
import { addBeleg, getAvailableReasons, getAvailableReceivers, getBelege, removeBeleg } from '../shared/store';
import { Beleg } from '../shared/types';
import { BelegList } from './BelegList';

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
		this.addControl(new InputControl('cash', { mandatory: true }));
		this.addControl(new InputControl('kind', { mandatory: true }));
		this.addControl(new InputControl('nr', { mandatory: true }));
		this.addControl(new InputControl('date', { mandatory: true }));
		this.addControl(new InputControl('amount', { mandatory: true }));
		this.addControl(new InputControl('reason', { mandatory: true }));
		this.addControl(new InputControl('receiver', { mandatory: true }));

		this.getInput('nr')?.setValidationHandler(validationHandler);
		this.getInput('date')?.setValidationHandler(validationHandler);
		this.getInput('amount')?.setValidationHandler(validationHandlerMin);
		this.getInput('reason')?.setValidationHandler(validationHandler);
		this.getInput('receiver')?.setValidationHandler(validationHandler);

		this.getInput('kind')?.setFormatHandler(formatHandler);
		this.getInput('nr')?.setFormatHandler(numberFormatHandler);
		this.getInput('amount')?.setFormatHandler(numberFormatHandler);

		this.reset();
	}

	private getNextNr = () => {
		let max = 0;
		getBelege().forEach((beleg) => {
			if (max < beleg.nr) {
				console.log(max, beleg.nr);
				max = beleg.nr;
			}
		});
		return max + 1;
	};

	public readonly reset = () => {
		this.setData({
			payment: 'out',
			cash: false,
			kind: 0,
			nr: this.getNextNr(),
			date: TODAY,
			amount: 0.0,
			reason: '',
			receiver: '',
		});
		this.disabled = false;
	};
}

let editBeleg: Beleg | null = null;

export const BelegForm: FC = () => {
	const [form, setForm] = useState(new BelegFormControl());
	const [saved, setSaved] = useState(false);
	const [touched, setTouched] = useState(false);
	const [error, setError] = useState('');
	const [activeElementEdit, setActiveElementEdit] = useState<HTMLElement | null>(null);
	const [delBeleg, setDelBeleg] = useState<Beleg | null>(null);
	const [activeElementDel, setActiveElementDel] = useState<HTMLElement | null>(null);

	const reset = () => {
		setError('');
		setForm(new BelegFormControl());
		setTouched(false);
	};

	const saveBeleg = () => {
		const beleg: Beleg = form.getData();
		console.log(editBeleg);
		addBeleg(beleg);
		if (editBeleg?.nr !== beleg.nr) {
			console.log(editBeleg);
			removeBeleg(editBeleg as Beleg);
		}
		setSaved(true);
		editBeleg = null;
		reset();
	};

	const onForm: KoliBriFormCallbacks = {
		onReset: () => {
			setSaved(false);
			reset();
		},
		onSubmit: (event: SubmitEvent) => {
			setError('');
			setSaved(false);
			setTouched(true);
			if (form.valid) {
				form.disabled = true;
				const beleg: Beleg = form.getData();
				if (editBeleg?.nr === beleg.nr || getBelege().has(beleg.nr) === false) {
					saveBeleg();
				} else {
					setActiveElementEdit(event.submitter);
				}
			}
		},
	};

	const onEdit = (beleg: Beleg) => {
		editBeleg = beleg;
		form.setData(editBeleg);
		// const input = form.getInput('amount');
		// if (input) {
		// 	input.value = beleg.amount;
		// }
	};

	const onDel = (event: PointerEvent, beleg: Beleg) => {
		setActiveElementDel(event.target as HTMLElement);
		setDelBeleg(beleg);
	};

	return (
		<>
			<div className="not-print grid gap-2">
				<KolForm _on={onForm}>
					<div className="grid gap-2">
						<div className="grid md:grid-cols-2 gap-2">
							<LeanInputAdapter _control={form.getInput('payment') as InputControl}>
								<KolInputRadio _id="payment" _list={AUS_EIN} _orientation="horizontal" _touched={touched}>
									Zahlung
								</KolInputRadio>
							</LeanInputAdapter>
							<LeanInputAdapter className="self-end" _control={form.getInput('cash') as InputControl}>
								<KolInputCheckbox _id="cash" _touched={touched}>
									Barzahlung
								</KolInputCheckbox>
							</LeanInputAdapter>
							<LeanInputAdapter _control={form.getInput('kind') as InputControl}>
								<KolSelect _id="kind" _list={ARTEN} _touched={touched}>
									Art
								</KolSelect>
							</LeanInputAdapter>
							<LeanInputAdapter _control={form.getInput('nr') as InputControl}>
								<KolInputNumber _id="nr" _step={1} _touched={touched}>
									Belegnummer
								</KolInputNumber>
							</LeanInputAdapter>
							<LeanInputAdapter _control={form.getInput('date') as InputControl}>
								<KolInputDate _id="date" _max={TODAY} _touched={touched} _type="date">
									<KolAbbr _title="* Hinweis: Als Zahlungsdatum ist bei unbar bezahlten Rechnungen (Überweisungen) das Datum der Wertstellung laut Kontoauszug einzutragen!">
										Zahlungsdatum
									</KolAbbr>
								</KolInputDate>
							</LeanInputAdapter>
							<LeanInputAdapter _control={form.getInput('amount') as InputControl}>
								<KolInputNumber _id="amount" _step={0.01} _touched={touched}>
									Betrag
								</KolInputNumber>
							</LeanInputAdapter>
							<LeanInputAdapter _control={form.getInput('reason') as InputControl}>
								<KolInputText _id="reason" _list={getAvailableReasons()} _touched={touched}>
									Zahlungsgrund/Verwendungszweck
								</KolInputText>
							</LeanInputAdapter>
							<LeanInputAdapter _control={form.getInput('receiver') as InputControl}>
								<KolInputText _id="receiver" _list={getAvailableReceivers()} _touched={touched}>
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
						<div className="grid md:flex md:gap-2 md:justify-end ">
							<KolButton className="w-full md:w-10em" _icon="fa-solid fa-floppy-disk" _label="Speichern" _type="submit" _variant="primary" />
							<KolButton className="w-full md:w-10em" _label="Zurücksetzen" _type="reset" />
						</div>
					</div>
				</KolForm>
			</div>
			<KolHeading _level={2}>Belegliste</KolHeading>
			<BelegList edit={onEdit} remove={onDel} />
			<KolModal _width="500px" _ariaLabel="Beleg überschreiben?" _activeElement={activeElementEdit}>
				<KolCard _hasFooter _heading="Beleg überschreiben?">
					<p className="p-2" slot="content">
						Es ist schon ein Beleg mit der Belegnummer vorhanden. Wollen Sie diesen wirklich überschreiben?
					</p>
					<div className="flex content-end gap-2" slot="footer">
						<KolButton
							_label="Ja"
							_on={{
								onClick: () => {
									saveBeleg();
									setActiveElementEdit(null);
								},
							}}
							_variant="primary"
						></KolButton>
						<KolButton
							_label="Nein"
							_on={{
								onClick: () => {
									setActiveElementEdit(null);
									form.disabled = false;
								},
							}}
							_variant="secondary"
						></KolButton>
					</div>
				</KolCard>
			</KolModal>
			<KolModal _width="500px" _ariaLabel="Beleg löschen?" _activeElement={activeElementDel}>
				<KolCard _hasFooter _heading="Beleg löschen?">
					<p className="p-2" slot="content">
						Sind Sie sicher, dass Sie den Beleg mit der Belegnummer <strong>{delBeleg?.nr}</strong> löschen wollen?
					</p>
					<div className="flex content-end gap-2" slot="footer">
						<KolButton
							_label="Ja"
							_on={{
								onClick: () => {
									removeBeleg(delBeleg as Beleg);
									setActiveElementDel(null);
								},
							}}
							_variant="primary"
						></KolButton>
						<KolButton
							_label="Nein"
							_on={{
								onClick: () => {
									setActiveElementDel(null);
								},
							}}
							_variant="secondary"
						></KolButton>
					</div>
				</KolCard>
			</KolModal>
		</>
	);
};
