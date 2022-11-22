import { KolAbbr, KolAlert, KolButton, KolInputCheckbox, KolInputFile, KolKolibri, KolLink } from '@public-ui/react';
import React, { FunctionComponent, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { downloadAppData, loadAppData } from '../shared/store';
import { Auswertung } from './Auswertung';
import { Erfassung } from './Erfassung';

type View = 'form' | 'report';

export const App: FunctionComponent = () => {
	const [view, setView] = useState<View>('form');

	return (
		<div className="bmf container mx-auto p-4 max-w-1280px grid gap-4">
			<main className="grid gap-2">
				<hr className="not-print" />
				<div className="not-print grid sm:grid-cols-2 gap-4">
					<div className="grid grid-cols-2 gap-2">
						<KolButton
							className="center m-auto"
							_label="Speichern"
							_id="speichern"
							_on={{
								onClick: downloadAppData,
							}}
						/>
						<KolInputFile
							className="center m-auto"
							_hideLabel
							_id="laden"
							_on={{
								onChange: (_event: Event, value: unknown) => {
									console.log(value);
									loadAppData(value as FileList);
								},
							}}
						>
							Laden
						</KolInputFile>
					</div>
					<KolInputCheckbox
						className="center m-auto"
						_id="switch"
						_on={{
							onChange: (_event, value) => {
								setView(value ? 'report' : 'form');
							},
						}}
						_type="switch"
					>
						{view === 'form' ? (
							<>
								<strong>Erfassung</strong> / Auswertung
							</>
						) : (
							<>
								Erfassung / <strong>Auswertung</strong>
							</>
						)}
					</KolInputCheckbox>
				</div>
				<hr className="not-print" />
				<Routes>
					<Route path="/" element={view === 'report' ? <Auswertung /> : <Erfassung />} />
				</Routes>
			</main>
			<hr className="not-print my-4" />
			<KolAlert className="not-print">
				<p>
					Diese Webanwendung ist unabhängig von öffentlichen Institutionen und zu Anschauungszwecken im{' '}
					<KolLink _href="https://thueringen.de/styleguide/" _target="styleguide">
						Online-Styleguide des Freistaates Thüringen
					</KolLink>{' '}
					umgesetzt worden.
				</p>
			</KolAlert>
			<KolAlert className="not-print" _type="info">
				<p>Diese Webanwendung setzt eine Excel-basierte Fachanwendung für die Belegerfassung der Schulsozialarbeiter:innen im Ilm-Kreis / Thüringen um.</p>
				<p>
					<strong>Motivation</strong>
					<br />
					Bei einer Excel-basierten Variante kann es vorkommen, dass durch die Verwendung einer alternativen Kalkulationssoftware (LibreOffice) oder durch
					versehentliche Manipulation, die Fachanwendungslogik nicht mehr funktioniert. Durch die Umsetzung der Fachanwendung als Webanwendung kann
					sichergestellt werden, dass die Erfassungsmasken und Berichtsgenerierung dauerhaft robust funktionieren.
				</p>
				<p>
					<strong>Datenschutz</strong>
					<br />
					Die Webanwendung ist technisch so designt, dass sie keinerlei Daten außerhalb der lokalen Browser-Session speichert. Es gibt auch keine
					Kommunikationslogik, so dass keine Daten gesendet werden. Hierbei wird Datenhaltung auf ein Browser-Tab eingeschränkte.
				</p>
				<p>
					<strong>Nutzung</strong>
					<br />
					Wenn die Webanwendung im Browser(-Tab) neu gestartet wird, ist sind alle Daten leer. Der/Die Nutzende kann entweder mit der Eingabe beginnen oder
					einen zuvor gespeicherten Datenstand von seinem lokalen Laufwerk zur weiteren Bearbeitung laden. Nach der Bearbeitung bzw. beim Schließen des
					Browser(-Tab)s sollte der/die Nutzende die Daten auf sein lokales Laufwerk speichern, da sonst alle Eingaben (Daten) dauerhaft verworfen werden.
					<br />
					Die Webanwendung wurde zudem als sogenannte &#34;Progressive Webanwendung&#34; umgesetzt. Das ermöglicht das Herunterladen der Webanwendung auf den
					lokalen Arbeitsrechner (Desktop) für eine Offline-fähige Nutzung.
				</p>
				<p>
					<strong>Lizenz</strong>
					<br />
					Die Implementierung der Fachanwendung ist Open Source und ist auf der Plattform{' '}
					<KolLink _href="https://github.com/public-oss/th-ik-ja-schulsozialarbeit-belegerfassung" _target="github">
						GitHub
					</KolLink>{' '}
					öffentlich bereitgestellt.
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
		</div>
	);
};
