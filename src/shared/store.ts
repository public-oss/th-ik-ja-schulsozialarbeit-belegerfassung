import { Beleg } from '../components/types';
import { Subject, Subscription, Observer } from 'rxjs';

const IDENTIFIER = 'mira-app-belege';
const BELEGE: Map<string, Beleg> = new Map();
const restoreBelege = localStorage.getItem(IDENTIFIER);
if (restoreBelege) {
	try {
		const list = JSON.parse(restoreBelege) as Beleg[];
		list.forEach((beleg) => BELEGE.set(beleg.nr, beleg));
	} catch (e) {}
}

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

const SUBJECT = new Subject<Map<string, Beleg>>();
export const subscribeBelege = (next: (value: Map<string, Beleg>) => void): Subscription => {
	return SUBJECT.subscribe(next);
};

export const saveBelege = () => {
	localStorage.setItem(IDENTIFIER, JSON.stringify(Array.from(BELEGE.values())));
	SUBJECT.next(getBelege());
};
