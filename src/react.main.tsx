import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';

import { App } from './components/App';

import { defineCustomElements as leanup } from '@leanup/kolibri-components/dist/loader';
import { defineCustomElements } from '@public-ui/components/dist/loader';
import { TH } from '@public-oss/kolibri-themes';
import { register } from '@public-ui/core';
import { KoliBriDevHelper } from '@public-ui/components';

register(TH, [defineCustomElements, leanup])
	.then(() => {
		KoliBriDevHelper.patchTheme('th', {
			'KOL-BUTTON':
				':host {--th-color-grau-darkest: #333;display: inline-block;}button {background-color: transparent;border: 0;cursor: pointer;min-width: 44px;min-height: 44px;padding: 0;text-decoration: none !important;}button > kol-span-wc {font-style: normal;font-weight: 400;border-radius: 0;border-style: solid;border-width: 1px;display: inline-block;line-height: 1;text-align: center;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;padding: 0.625em 1em;font-size: 1em;transition: all 0.2s ease-in-out;}button.primary > kol-span-wc,button.primary:disabled:hover > kol-span-wc {background-color: var(--th-color-blau-dark);border-color: var(--th-color-blau-dark);color: var(--th-color-white);}button.secondary > kol-span-wc,button.secondary:disabled:hover > kol-span-wc {background-color: var(--th-color-blau-lightest);border-color: var(--th-color-blau-lightest);color: var(--th-color-blau-darker);}button.normal > kol-span-wc,button.normal:disabled:hover > kol-span-wc {background-color: var(--th-color-grau-darkest);border-color: var(--th-color-grau-darkest);color: var(--th-color-white);}button.danger > kol-span-wc,button.danger:disabled:hover > kol-span-wc {background-color: var(--th-color-rot);border-color: var(--th-color-rot);color: var(--th-color-black);}button.ghost > kol-span-wc,button.ghost:disabled:hover > kol-span-wc {background-color: var(--th-color-white);border-color: var(--th-color-blau-darker);color: var(--th-color-blau-darker);}button.primary:hover > kol-span-wc,button.primary:focus > kol-span-wc,button.secondary:hover > kol-span-wc,button.secondary:focus > kol-span-wc,button.normal:hover > kol-span-wc,button.normal:focus > kol-span-wc,button.danger:hover > kol-span-wc,button.danger:focus > kol-span-wc,button.ghost:hover > kol-span-wc,button.ghost:focus > kol-span-wc {background-color: var(--th-color-rot-darker);border-color: var(--th-color-rot-darker);color: var(--th-color-white);}button:active {outline: 0 !important;}button:disabled {cursor: not-allowed;opacity: 0.5;}kol-button-wc {width: inherit;}button > kol-span-wc {display: grid;gap: 0.25em;}button > kol-span-wc span {display: flex;gap: 0.25em;align-items: center;justify-content: center;}button.icon-only > kol-span-wc > span > span {display: none;}button.loading > kol-span-wc kol-icon {animation: spin 5s infinite linear;}',
			'KOL-HEADING':
				'h1,h2,h3,h4,h5,h6 {line-height: 1.125rem;margin: 0;}h2,h3,h4,h5,h6 {font-style: normal;font-weight: 700;}h1 {color: var(--th-color-blau);font-size: 2.125rem;font-weight: 400;padding-bottom: 1.0625rem;padding-top: 1.5rem;}h2 {color: var(--th-color-black);font-size: 1.625rem;padding-bottom: 0.8125rem;padding-top: 1.5rem;}h3,h4 {font-size: 1.375rem;padding-bottom: 0.6875rem;padding-top: 1.5rem;}h3 {color: var(--th-color-blau);}h4 {color: var(--th-color-black);}h5,h6 {font-size: 1rem;padding-bottom: 0.5rem;padding-top: 1rem;}h5 {color: var(--th-color-blau);}h6 {color: var(--th-color-black);}',
		});
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
