import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';

import { App } from './components/App';

import { defineCustomElements as leanup } from '@leanup/kolibri-components/dist/loader';
import { defineCustomElements } from '@public-ui/components/dist/loader';
import { TH } from '@public-oss/kolibri-themes';
import { register } from '@a11y-ui/core';

register(TH, [defineCustomElements, leanup])
	.then(() => {
		const htmlElement: HTMLElement | null = document.querySelector<HTMLDivElement>('div#app');
		if (htmlElement instanceof HTMLElement) {
			const root = createRoot(htmlElement);
			root.render(
				<StrictMode>
					<Router>
						<App />
					</Router>
				</StrictMode>
			);
		}
	})
	.catch(console.warn);
