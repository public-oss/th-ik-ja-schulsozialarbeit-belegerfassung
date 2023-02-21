import { KolAbbr, KolAlert, KolButton, KolInputCheckbox, KolInputFile, KolKolibri, KolLink, KolNav } from '@public-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { downloadAppData, loadAppData } from '../shared/store';
import { Allgemeines } from './Allgemeines';
import { Auswertung } from './Auswertung';
import { Dashboard } from './Dashboard';
import { Erfassung } from './Erfassung';

type Page = 'general' | 'dashboard' | 'form' | 'report';

export const App: FC = () => {
	const location = useLocation();
	const [page, setPage] = useState<Page>('general');

	useEffect(() => {
		switch (location.pathname) {
			case '/general':
				setPage('general');
				break;
			case '/form':
				setPage('form');
				break;
			case '/report':
				setPage('report');
				break;
			default:
				setPage('dashboard');
		}
	}, [location]);

	return (
		<div className="bmf container mx-auto p-4 max-w-1280px grid gap-2">
			<main className="grid gap-2">
				<hr className="not-print" />
				<div className="not-print grid sm:grid-cols-2 gap-2">
					<KolInputFile
						className="center m-auto"
						_hideLabel
						_id="laden"
						_on={{
							onChange: (_event: Event, value: unknown) => {
								loadAppData(value as FileList);
							},
						}}
					>
						Öffnen
					</KolInputFile>
					<KolButton
						className="center m-auto"
						_label="Herunterladen"
						_icon="fa-solid fa-download"
						_id="speichern"
						_on={{
							onClick: downloadAppData,
						}}
						_variant="primary"
					/>
				</div>
				<hr className="not-print" />
				<KolNav
					_ariaLabel="Hauptmenü"
					_links={[
						{
							_label: 'Dashboard',
							_href: '#/',
							_icon: 'fa-solid fa-tv',
							_active: page === 'dashboard',
						},
						{
							_label: 'Allgemeines',
							_href: '#/general',
							_icon: 'fa-solid fa-school',
							_active: page === 'general',
						},
						{
							_label: 'Erfassung',
							_href: '#/form',
							_icon: 'fa-solid fa-pen-to-square',
							_active: page === 'form',
						},
						{
							_label: 'Auswertung',
							_href: '#/report',
							_icon: 'fa-solid fa-print',
							_active: page === 'report',
						},
					]}
					_orientation="horizontal"
				></KolNav>
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="general" element={<Allgemeines />} />
					<Route path="form" element={<Erfassung />} />
					<Route path="report" element={<Auswertung />} />
				</Routes>
			</main>
			<footer className="grid gap-2">
				<hr className="not-print my-4" />
				<KolAlert className="not-print" _type="success">
					<p>
						<strong>Open Source</strong>
						<br />
						Die Implementierung der Fachanwendung ist Open Source und ist auf der Plattform{' '}
						<KolLink _href="https://github.com/public-oss/th-ik-ja-schulsozialarbeit-belegerfassung" _target="github">
							GitHub
						</KolLink>{' '}
						öffentlich zugänglich.
					</p>
					<p>
						<strong>Lizenz</strong>
						<br />
						Der Quellcode der Fachanwendung wurde unter der Lizenz{' '}
						<KolLink _href="https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12" _target="europa">
							EUPL v1.2
						</KolLink>{' '}
						freigegeben und folgt somit der Open Source Strategie der EU.
					</p>
				</KolAlert>
				<KolAlert className="not-print" _type="info">
					<p>
						Diese Webanwendung setzt eine Excel-basierte Fachanwendung für die Belegerfassung und -auswertung der Schulsozialarbeiter:innen im Ilm-Kreis /
						Thüringen um.
					</p>
					<p>
						<strong>Motivation</strong>
						<br />
						Bei einer Excel-basierten Variante kann es vorkommen, dass durch die Verwendung einer alternativen Kalkulationssoftware (z.B. LibreOffice Calc) oder
						durch versehentliche Manipulation, die Fachanwendungslogik nicht mehr funktioniert. Durch die Umsetzung der Fachanwendung als Webanwendung kann
						sichergestellt werden, dass die Erfassung und Auswertung dauerhaft robust funktionieren.
					</p>
					<p>
						<strong>Datenschutz</strong>
						<br />
						Die Webanwendung ist technisch so designt, dass sie keinerlei Daten außerhalb der lokalen Browser-Session speichert. Es gibt auch keine
						Kommunikationslogik, so dass keine Daten gesendet werden. Hierbei wird die Datenhaltung komplett auf den eigenen Browser des Nutzenden
						eingeschränkt.
					</p>
					<p>
						<strong>Nutzung</strong>
						<br />
						Wenn die Webanwendung im Browser neu gestartet wird, ist sind entweder alle Daten leer oder es werden die Daten aus dem eingenen Browser-Speicher
						wiederhergestellt. Der/Die Nutzende kann entweder mit der Eingabe beginnen oder einen zuvor gespeicherten Datenstand von seinem lokalen Laufwerk zur
						weiteren Bearbeitung laden. Nach der Bearbeitung bzw. beim Schließen des Browser(-Tab)s sollte der/die Nutzende die Daten auf sein lokales Laufwerk
						speichern, da sonst alle Eingaben (Daten) dauerhaft verworfen werden.
						<br />
						Die Webanwendung wurde zudem als sogenannte &#34;Progressive Webanwendung&#34; umgesetzt. Das ermöglicht das Herunterladen der Webanwendung auf den
						lokalen Arbeitsrechner (Desktop) für eine Offline-fähige Nutzung.
					</p>
				</KolAlert>
				<KolAlert className="not-print">
					<p>
						Diese Webanwendung ist unabhängig von öffentlichen Institutionen und zu Anschauungszwecken im{' '}
						<KolLink _href="https://thueringen.de/styleguide/" _target="styleguide">
							Online-Styleguide des Freistaates Thüringen
						</KolLink>{' '}
						umgesetzt worden.
					</p>
				</KolAlert>
				<hr className="not-print my-4" />
				<div className="not-print text-center">
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
			</footer>
		</div>
	);
};
