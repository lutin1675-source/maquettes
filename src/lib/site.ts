export const SITE = {
	title: 'Toton Maquette',
	description: 'Hub pédagogique : journal de progression, pas-à-pas et banc d’essai pour maquettistes débutants exigeants.',
	tagline: 'Journal & banc d’essai pour maquettistes exigeants',
	email: 'bonjour@toton-maquette.com',
	github: 'https://github.com/gpouleri/perso-maquettes',
	basePath: '/',
};

export const NAV_LINKS = [
	{ href: 'atelier/', label: 'L’Atelier' },
	{ href: 'atelier/journal-de-progression/', label: 'Journal' },
	{ href: 'atelier/fiches/', label: 'Fiches' },
	{ href: 'banc-dessai/', label: 'Le Banc d’essai' },
	{ href: 'a-propos/', label: 'À propos' },
	{ href: 'contact/', label: 'Contact' },
];

export const FOOTER_LINKS = [
	{
		title: 'L’Atelier',
		items: [
			{ href: 'atelier/', label: 'Vue d’ensemble' },
			{ href: 'atelier/journal-de-progression/', label: 'Journal de progression' },
			{ href: 'atelier/techniques-pas-a-pas/', label: 'Techniques & Pas-à-pas' },
			{ href: 'atelier/chroniques/', label: 'Chroniques' },
			{ href: 'atelier/histoires-contexte/', label: 'Histoires & Contexte' },
			{ href: 'atelier/fiches/', label: 'Fiches atelier' },
		],
	},
	{
		title: 'Banc d’essai',
		items: [
			{ href: 'banc-dessai/', label: 'Vue d’ensemble' },
			{ href: 'banc-dessai/tests-kits/', label: 'Tests de kits' },
			{ href: 'banc-dessai/tests-outils-materiel/', label: 'Tests outils & matériel' },
			{ href: 'banc-dessai/comparatifs/', label: 'Comparatifs' },
		],
	},
	{
		title: 'Infos',
		items: [
			{ href: 'a-propos/', label: 'À propos' },
			{ href: 'contact/', label: 'Contact' },
			{ href: 'cgu/', label: 'Conditions d’utilisation' },
		],
	},
];
