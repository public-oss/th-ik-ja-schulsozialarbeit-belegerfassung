import { Subject, Subscription } from 'rxjs';
import { App, Beleg } from './types';
import DATA from '../data/belege.json';

const IDENTIFIER = 'mira-app';
let APP: App = {
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
} else {
	(DATA as unknown as Beleg[]).forEach((beleg) => BELEGE.set(beleg.nr, beleg));
}
saveBelege();

export const downloadAppData = () => {
	const a = document.createElement('a');
	document.body.appendChild(a);
	a.style.display = 'none';
	const blob = new Blob([JSON.stringify(APP)], { type: 'octet/stream' }),
		url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = `belegerfassung-${APP.meta.school}-${APP.meta.author}-${new Date().toISOString()}.json`;
	a.click();
	window.URL.revokeObjectURL(url);
};

export const loadAppData = (files: FileList) => {
	if (files instanceof FileList && files.item(0) instanceof File) {
		files
			.item(0)
			?.text()
			.then((content: string) => {
				APP = {
					...APP,
					...(JSON.parse(content) as App),
				};
				saveApp();
				window.location.reload();
			})
			.catch(console.warn);
	}
};

window.addEventListener('beforeunload', () => {
	downloadAppData();
});
