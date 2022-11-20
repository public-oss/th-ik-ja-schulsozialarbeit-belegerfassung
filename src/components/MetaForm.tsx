import { FormControl, InputControl, RequiredValidator, ValidationHandler } from '@leanup/form';
import { LeanInputAdapter } from '@leanup/kolibri-react';
import { KoliBriFormCallbacks } from '@public-ui/components/dist/types/components/form/component';
import { KolAlert, KolButton, KolForm, KolInputText } from '@public-ui/react';
import React, { FunctionComponent, useState } from 'react';
import { addBeleg, getMeta, saveMeta } from '../shared/store';

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

		this.getInput('school')?.setValidationHandler(validationHandler);
		this.getInput('author')?.setValidationHandler(validationHandler);

		this.reset();
	}

	public readonly reset = () => {
		this.setData(getMeta());
		this.disabled = false;
	};
}

export const MetaForm: FunctionComponent = () => {
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
		<div className="not-print grid gap-4">
			<KolForm _on={onForm}>
				<div className="grid gap-4">
					<div className="grid md:grid-cols-2 gap-4 text">
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
