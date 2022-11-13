import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './components/App';

import { register } from '@public-ui/core';
import { defineCustomElements as leanup } from '@leanup/kolibri-components/dist/loader';
import { defineCustomElements } from '@public-ui/components/dist/loader';
import { BMF } from '@public-ui/themes';

register(BMF, [defineCustomElements, leanup])
	.then(() => {
		const htmlElement: HTMLElement | null = document.querySelector<HTMLDivElement>('div#app');
		if (htmlElement instanceof HTMLElement) {
			const root = createRoot(htmlElement);
			root.render(<App />);
		}
	})
	.catch(console.warn);
