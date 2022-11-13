import React, { FunctionComponent } from 'react';
import { BelegForm } from './BelegForm';
import { BelegList } from './BelegList';

export const App: FunctionComponent = () => {
	return (
		<div className="bmf container mx-auto p-4 max-w-1280px">
			<BelegForm />
			<BelegList />
		</div>
	);
};
