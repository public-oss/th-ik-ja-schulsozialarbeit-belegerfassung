import { KolHeading } from '@public-ui/react';
import React, { FunctionComponent } from 'react';
import { getMeta } from '../shared/store';
import { BelegForm } from './BelegForm';

export const Erfassung: FunctionComponent = () => {
	const meta = getMeta();
	return (
		<>
			<div className="grid sm:grid-cols-2 items-center align-center">
				<div className="sm:text-right sm:order-2">
					{/* <img alt="Logo Freistaat Thüringen" className="pt-4 pr-4" src="https://thueringen.de/styleguide/freistaat-thueringen-logo.svg" width="200" /> */}
					{/* <img alt="Logo Ilm-Kreis in Thüringen" className="pt-4 pr-4" src="https://www.ilm-kreis.de/media/custom/2778_1182_1_g.PNG" width="200" /> */}
				</div>
				<KolHeading>Belegerfassung</KolHeading>
			</div>
			<KolHeading className="not-print" _level={2}>
				Beleg erfassen
			</KolHeading>
			<div className="only-print grid md:grid-cols-2 gap-2">
				<div>
					<strong>Schule:</strong> {meta.school}
				</div>
				<div>
					<strong>Erfassende(r):</strong> {meta.author}
				</div>
			</div>
			<BelegForm />
		</>
	);
};
