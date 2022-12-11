const path = require('path');
module.exports = {
	publicPath: '/th-ik-ja-belegerfassung/',
	name: 'Belegerfassung | Public-OSS',
	short_name: 'Belegerfassung',
	description: '...',
	lang: 'de-DE',
	start_url: '/th-ik-ja-belegerfassung/',
	display: 'fullscreen',
	orientation: 'any',
	theme_color: '#fff',
	background_color: '#fff',
	filename: 'manifest.json',
	icons: [
		{
			src: path.resolve('public/assets/logo.kolibri.png'),
			sizes: [96, 128, 192, 256, 384, 512],
		},
	],
	crossorigin: null,
	inject: true,
	fingerprints: true,
	ios: true,
	includeDirectory: true,
};
