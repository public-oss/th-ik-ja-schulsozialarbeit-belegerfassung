export enum CategoryEnum {
	'Projektbezogenen Verwaltungskosten' = 'Projektbezogenen Verwaltungskosten',
	'Verbrauchsmaterialen' = 'Verbrauchsmaterialen',
	'Fortbildungen, Supervision' = 'Fortbildungen, Supervision',
	'Einzelfallhilfe' = 'Einzelfallhilfe',
	'Sozialpädagogische Gruppenarbeit' = 'Sozialpädagogische Gruppenarbeit',
	'Innerschulische Vernetzung' = 'Innerschulische Vernetzung',
	'Prävention, Gesundheitsförderung' = 'Prävention, Gesundheitsförderung',
	'Bar' = 'Bar',
}

export enum PaymentEnum {
	'Einzahlung' = 'in',
	'Auszahlung' = 'out',
}

// type Mapper<T> = {
// 	readonly [Property in keyof T as `budget${Capitalize<string & Property>}`]?: number;
// };

export type Meta = {
	author: string;
	budget0: number;
	budget1: number;
	budget2: number;
	budget3: number;
	budget4: number;
	budget5: number;
	budget6: number;
	budget7: number;
	school: string;
	version?: `${number}.${number}.${number}`;
};
// & Mapper<CategoryEnum>

export type Beleg = {
	cash: boolean;
	payment: string;
	kind: CategoryEnum;
	nr: number;
	date: string;
	amount: number;
	reason: string;
	receiver: string;
};

type Data = {
	belege: Beleg[];
};

export type App = {
	meta: Meta;
	data: Data;
};

export type Category = keyof typeof CategoryEnum;

export type Payment = keyof typeof PaymentEnum;

export type Budget = {
	credit: number; // Haben
	debit: number; // Soll
	salto?: number; // Salto
};
