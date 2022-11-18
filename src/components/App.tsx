import { KolAbbr, KolAlert, KolHeading, KolKolibri, KolLink } from '@public-ui/react';
import React, { FunctionComponent, useState } from 'react';
import { BelegForm } from './BelegForm';
import { BelegList } from './BelegList';
import { MetaForm } from './MetaForm';

export const App: FunctionComponent = () => {
	const [advice] = useState(true);

	return (
		<main className="bmf container mx-auto p-4 max-w-1280px grid gap-4">
			<KolAlert>
				<p>
					Diese Webanwendung ist unabhängig von öffentlichen Institutionen und zu Anschauungszwecken im{' '}
					<KolLink _href="https://thueringen.de/styleguide/" _target="styleguide">
						Online-Styleguide des Freistaates Thüringen
					</KolLink>{' '}
					umgesetzt worden.
				</p>
			</KolAlert>
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
			{advice && (
				<KolAlert _type="info">
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
			)}
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
