import { KolHeading } from '@public-ui/react';
import React, { FunctionComponent } from 'react';
import { BelegForm } from './BelegForm';
import { BelegList } from './BelegList';
import { MetaForm } from './MetaForm';

export const Erfassung: FunctionComponent = () => {
	return (
		<>
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
		</>
	);
};
