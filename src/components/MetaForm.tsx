import { AbstractFormatter, AbstractValidator, FormatHandler, FormControl, InputControl, RequiredValidator, ValidationHandler } from '@leanup/form';
import { LeanInputAdapter } from '@leanup/kolibri-react';
import { KoliBriFormCallbacks } from '@public-ui/components/dist/types/components/form/component';
import { Iso8601 } from '@public-ui/components/dist/types/types/input/iso8601';
import { KolAlert, KolButton, KolForm, KolInputText } from '@public-ui/react';
import React, { FunctionComponent, useState } from 'react';
import { addBeleg } from '../shared/store';

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
		this.setData({
			school: '',
			author: '',
		});
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
