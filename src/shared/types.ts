type Meta = {
	author: string;
	school: string;
	version: `${number}.${number}.${number}`;
};

export type Beleg = {
	payment: string;
	kind: string;
	nr: string;
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

export type Payment = 'in' | 'out';
export type Kind =
	| 'Projektbezogenen Verwaltungskosten'
	| 'Verbrauchsmaterialen'
	| 'Fortbildungen, Supervision'
	| 'Einzelfallhilfe'
	| 'Sozialpädagogische Gruppenarbeit'
	| `AG's`
	| 'Prävention, Gesundheitsförderung';
