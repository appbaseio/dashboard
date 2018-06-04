import * as QuickLinks from './shared/QuickLinks';

export default {
	name: 'appbase',
	logo: '../../../assets/images/appbase/logo.svg',
	favicon: '../../../assets/images/appbase/favicon.ico',
	logoText: null,
	cardIcon: '',
	appDashboard: ['dashboard', 'browser', 'mirage', 'credentials', 'team'],
	navbar: ['Tutorial', 'Docs', 'Billing'],
	document: 'https://docs.appbase.io',
	tutorial: {
		url: '../../../app/views/tutorial/appbase-tutorial/index.html',
		title: 'Appbase.io Interactive Tutorial',
		description: 'Make your first API call in 2 mins.',
	},
	login: {
		description: 'Hello, before starting you need to login.',
	},
	primary: '#3BC7F6',
	accent: '#B6EF7E',
	quickLinks: QuickLinks.AppbaseQuickLinks(),
	dashboardGettingStarted: QuickLinks.AppbaseDashboardGettingStarted(),
};
