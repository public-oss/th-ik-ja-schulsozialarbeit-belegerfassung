import { KolHeading } from '@public-ui/react';
import React, { FC } from 'react';
import { MetaForm } from './MetaForm';

export const Allgemeines: FC = () => {
	return (
		<>
			<div className="grid sm:grid-cols-2 items-center align-center">
				<div className="sm:text-right sm:order-2">
					{/* <img alt="Logo Freistaat Thüringen" className="pt-4 pr-4" src="https://thueringen.de/styleguide/freistaat-thueringen-logo.svg" width="200" /> */}
					{/* <img alt="Logo Ilm-Kreis in Thüringen" className="pt-4 pr-4" src="https://www.ilm-kreis.de/media/custom/2778_1182_1_g.PNG" width="200" /> */}
				</div>
				<KolHeading>Allgemeine Angaben</KolHeading>
			</div>
			<KolHeading className="not-print" _level={2}>
				Angaben erfassen
			</KolHeading>
			<MetaForm />
		</>
	);
};
