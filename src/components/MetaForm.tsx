import { FormControl, InputControl, RequiredValidator, ValidationHandler } from '@leanup/form';
import { LeanInputAdapter } from '@leanup/kolibri-react';
import { KoliBriFormCallbacks } from '@public-ui/components/dist/types/components/form/component';
import { KolAlert, KolButton, KolForm, KolHeading, KolInputNumber, KolInputText } from '@public-ui/react';
import React, { FC, useState } from 'react';
import { numberFormatHandler } from '../shared/constants';
import { getMeta, saveMeta } from '../shared/store';

class MyRequiredValidator extends RequiredValidator {
	public constructor() {
		super('Bitte geben Sie einen Wert ein.');
	}
}

const validationHandler = new ValidationHandler();
validationHandler.add(new MyRequiredValidator());

class MetaFormControl extends FormControl {
	public constructor() {
		super('meta');

		this.addControl(new InputControl('school', { mandatory: true }));
		this.addControl(new InputControl('author', { mandatory: true }));

		this.addControl(new InputControl('budget0', { mandatory: true }));
		this.addControl(new InputControl('budget1', { mandatory: true }));
		this.addControl(new InputControl('budget2', { mandatory: true }));
		this.addControl(new InputControl('budget3', { mandatory: true }));
		this.addControl(new InputControl('budget4', { mandatory: true }));
		this.addControl(new InputControl('budget5', { mandatory: true }));
		this.addControl(new InputControl('budget6', { mandatory: true }));
		this.addControl(new InputControl('budget7', { mandatory: true }));

		this.getInput('school')?.setValidationHandler(validationHandler);
		this.getInput('author')?.setValidationHandler(validationHandler);
		this.getInput('budget0')?.setValidationHandler(validationHandler);
		this.getInput('budget1')?.setValidationHandler(validationHandler);
		this.getInput('budget2')?.setValidationHandler(validationHandler);
		this.getInput('budget3')?.setValidationHandler(validationHandler);
		this.getInput('budget4')?.setValidationHandler(validationHandler);
		this.getInput('budget5')?.setValidationHandler(validationHandler);
		this.getInput('budget6')?.setValidationHandler(validationHandler);
		this.getInput('budget7')?.setValidationHandler(validationHandler);

		this.getInput('budget0')?.setFormatHandler(numberFormatHandler);
		this.getInput('budget1')?.setFormatHandler(numberFormatHandler);
		this.getInput('budget2')?.setFormatHandler(numberFormatHandler);
		this.getInput('budget3')?.setFormatHandler(numberFormatHandler);
		this.getInput('budget4')?.setFormatHandler(numberFormatHandler);
		this.getInput('budget5')?.setFormatHandler(numberFormatHandler);
		this.getInput('budget6')?.setFormatHandler(numberFormatHandler);
		this.getInput('budget7')?.setFormatHandler(numberFormatHandler);

		this.reset();
	}

	public readonly reset = () => {
		this.setData(getMeta());
		this.disabled = false;
	};
}

export const MetaForm: FC = () => {
	const [form, setForm] = useState(new MetaFormControl());
	const [saved, setSaved] = useState(false);
	const [touched, setTouched] = useState(false);
	const [error, setError] = useState('');

	const reset = () => {
		setError('');
		setForm(new MetaFormControl());
		setTouched(false);
	};

	const onForm: KoliBriFormCallbacks = {
		onReset: () => {
			setSaved(false);
			reset();
		},
		onSubmit: () => {
			setError('');
			setSaved(false);
			setTouched(true);
			if (form.valid) {
				try {
					saveMeta(form.getData());
					setSaved(true);
					reset();
				} catch (e) {
					setError((e as Error).message);
				}
			}
		},
	};

	return (
		<div className="not-print grid gap-2">
			<KolForm _on={onForm}>
				<div className="grid gap-2">
					<div className="grid md:grid-cols-2 gap-2 text">
						<LeanInputAdapter _control={form.getInput('school') as InputControl}>
							<KolInputText _id="school" _touched={touched}>
								Schule
							</KolInputText>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('author') as InputControl}>
							<KolInputText _id="author" _touched={touched}>
								Erfassende(r)
							</KolInputText>
						</LeanInputAdapter>
					</div>
					<KolHeading _level={3}>Budgets erfassen</KolHeading>
					<div className="grid md:grid-cols-2 gap-2 text">
						<LeanInputAdapter _control={form.getInput('budget0') as InputControl}>
							<KolInputNumber _id="budget0" _touched={touched}>
								Projektbezogenen Verwaltungskosten
							</KolInputNumber>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('budget1') as InputControl}>
							<KolInputNumber _id="budget1" _touched={touched}>
								Verbrauchsmaterialen
							</KolInputNumber>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('budget2') as InputControl}>
							<KolInputNumber _id="budget2" _touched={touched}>
								Fortbildungen, Supervision
							</KolInputNumber>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('budget3') as InputControl}>
							<KolInputNumber _id="budget3" _touched={touched}>
								Einzelfallhilfe
							</KolInputNumber>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('budget4') as InputControl}>
							<KolInputNumber _id="budget4" _touched={touched}>
								Sozialpädagogische Gruppenarbeit
							</KolInputNumber>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('budget5') as InputControl}>
							<KolInputNumber _id="budget5" _touched={touched}>
								Innerschulische Vernetzung
							</KolInputNumber>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('budget6') as InputControl}>
							<KolInputNumber _id="budget6" _touched={touched}>
								Prävention, Gesundheitsförderung
							</KolInputNumber>
						</LeanInputAdapter>
						<LeanInputAdapter _control={form.getInput('budget7') as InputControl}>
							<KolInputNumber _id="budget7" _touched={touched}>
								Bar
							</KolInputNumber>
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
	);
};
