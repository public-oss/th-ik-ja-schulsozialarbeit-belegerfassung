import { Subject, Subscription } from 'rxjs';
import { App, Beleg } from './types';
import DATA from '../data/belege.json';

const IDENTIFIER = 'mira-app';
const APP: App = {
	data: {
		belege: [],
	},
	meta: {
		author: '',
		school: '',
		version: '1.0.0',
	},
};
const BELEGE: Map<string, Beleg> = new Map();
const restoreApp = sessionStorage.getItem(IDENTIFIER);

export const getBelege = () => {
	return new Map<string, Beleg>(BELEGE);
};

export const addBeleg = (beleg: Beleg) => {
	if (BELEGE.has(beleg.nr)) {
		throw new Error(`Die Belegnummer "${beleg.nr}" ist schon vergeben.`);
	}
	BELEGE.set(beleg.nr, beleg);
	saveBelege();
};

export const removeBeleg = (beleg: Beleg) => {
	BELEGE.delete(beleg.nr);
	saveBelege();
};

const getAvailables = (filter: (beleg: Beleg) => string): string[] => {
	return [...new Set(Array.from(BELEGE.values()).map(filter))];
};

export const getAvailableReasons = (): string[] => {
	return getAvailables((beleg) => beleg.reason);
};
export const getAvailableReceivers = (): string[] => {
	return getAvailables((beleg) => beleg.receiver);
};

const SUBJECT = new Subject<Map<string, Beleg>>();
export const subscribeBelege = (next: (value: Map<string, Beleg>) => void): Subscription => {
	return SUBJECT.subscribe(next);
};

export const saveMeta = (meta: { author: string; school: string }) => {
	APP.meta = {
		...APP.meta,
		...meta,
	};
	saveApp();
};
export const getMeta = () => {
	return {
		...APP.meta,
	};
};

const saveBelege = () => {
	APP.data.belege = Array.from(BELEGE.values());
	SUBJECT.next(getBelege());
	saveApp();
};

const saveApp = () => {
	sessionStorage.setItem(IDENTIFIER, JSON.stringify(APP));
	SUBJECT.next(getBelege());
};

if (restoreApp) {
	try {
		const appStore = JSON.parse(restoreApp) as App;
		APP.meta = {
			...APP.meta,
			...appStore.meta,
		};
		appStore.data.belege.forEach((beleg) => BELEGE.set(beleg.nr, beleg));
	} catch (e) {}
	// } else {
	// 	(DATA as unknown as Beleg[]).forEach((beleg) => BELEGE.set(beleg.nr, beleg));
}
saveBelege();
