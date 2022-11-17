import { KolAbbr, KolHeading, KolKolibri, KolLink } from '@public-ui/react';
import React, { FunctionComponent } from 'react';
import { BelegForm } from './BelegForm';
import { BelegList } from './BelegList';
import { MetaForm } from './MetaForm';

export const App: FunctionComponent = () => {
	return (
		<main className="bmf container mx-auto p-4 max-w-1280px grid gap-4">
			<div className="grid sm:grid-cols-2 items-center align-center">
				<div className="sm:text-right sm:order-2">
					<img alt="Logo Freistaat Thüringen" className="pt-4 pr-4" src="https://thueringen.de/styleguide/freistaat-thueringen-logo.svg" width="250" />
				</div>
				<KolHeading>Belegerfassung</KolHeading>
			</div>
			<KolHeading _level={2}>Allgemeine Angaben</KolHeading>
			<MetaForm />
			<KolHeading _level={2}>Beleg erfassen</KolHeading>
			<BelegForm />
			<KolHeading _level={2}>Belegliste</KolHeading>
			<BelegList />
			<div className="mt-8 text-center">
				<hr className="w-80%" />
				<span>
					Unterstützt durch{' '}
					<KolAbbr _title="Komponenten-Bibliothek für die Barrierefreiheit">
						<strong>KoliBri</strong>
					</KolAbbr>{' '}
					- die{' '}
					<KolLink _href="https://public-ui.github.io" _target="kolibri">
						Komponenten-Bibliothek für die Barrierefreiheit
					</KolLink>
					<KolKolibri _labeled={false} />
				</span>
			</div>
		</main>
	);
};
