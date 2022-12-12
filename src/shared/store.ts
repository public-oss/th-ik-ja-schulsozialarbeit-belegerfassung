import { Subject, Subscription } from 'rxjs';
import { App, Beleg, Meta } from './types';

let hasChanges = false;

const IDENTIFIER = 'mira-app';
let APP: App = {
	data: {
		belege: [],
	},
	meta: {
		author: '',
		school: '',
		budget0: 0,
		budget1: 0,
		budget2: 0,
		budget3: 0,
		budget4: 0,
		budget5: 0,
		budget6: 0,
		version: '1.0.0',
	},
};
const BELEGE: Map<number, Beleg> = new Map();
const restoreApp = localStorage.getItem(IDENTIFIER);

export const getBelege = () => {
	return new Map<number, Beleg>(BELEGE);
};

const sortBelege = (belege: Map<number, Beleg>) => {
	const list = Array.from(belege.values());
	list.sort((a, b) => {
		if (a.date < b.date) {
			return -1;
		}
		if (a.date > b.date) {
			return 1;
		}
		return 0;
	});
	belege.clear();
	list.forEach((beleg) => {
		beleg.cash = beleg.cash === true;
		beleg.nr = parseInt(beleg.nr as unknown as string);
		beleg.amount = parseFloat(beleg.amount as unknown as string);
		belege.set(beleg.nr, beleg);
	});
};

export const addBeleg = (beleg: Beleg) => {
	BELEGE.set(beleg.nr, beleg);
	sortBelege(BELEGE);
	saveBelege();
};

export const removeBeleg = (beleg: Beleg) => {
	BELEGE.delete(beleg.nr);
	sortBelege(BELEGE);
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

const SUBJECT = new Subject<Map<number, Beleg>>();
export const subscribeBelege = (next: (value: Map<number, Beleg>) => void): Subscription => {
	return SUBJECT.subscribe(next);
};

export const saveMeta = (meta: Meta) => {
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
	hasChanges = true;
	localStorage.setItem(IDENTIFIER, JSON.stringify(APP));
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
}
saveBelege();
hasChanges = false;

export const downloadAppData = () => {
	if (hasChanges) {
		const a = document.createElement('a');
		document.body.appendChild(a);
		a.style.display = 'none';
		const blob = new Blob([JSON.stringify(APP)], { type: 'octet/stream' }),
			url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = `belegerfassung-${APP.meta.school}-${APP.meta.author}-${new Date().toISOString()}.json`;
		a.click();
		window.URL.revokeObjectURL(url);
		hasChanges = false;
	} else {
		alert('Es gibt keine Änderungen die Sie speichern müssten.');
	}
};

const wouldYouSave = (e: BeforeUnloadEvent) => {
	if (hasChanges) {
		e.returnValue = 'Wollen Sie wirklich ohne Speichen das Fenster/Tab schließen?';
	}
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
				hasChanges = false;
				window.removeEventListener('beforeunload', wouldYouSave);
				window.location.reload();
			})
			.catch(console.warn);
	}
};

window.addEventListener('beforeunload', wouldYouSave);
