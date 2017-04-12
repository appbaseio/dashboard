import React from 'react';
import { appbaseService } from './service/AppbaseService';
import * as QuickLinks from './shared/QuickLinks';

export const contextConfig = {
	"appbase": {
		"name": "appbase",
		"logo": "../../../assets/images/appbase/logo.svg",
		"favicon": "../../../assets/images/appbase/favicon.ico",
		"logoText": null,
		"cardIcon": "",
		"appDashboard": ["dashboard", "browser", "mirage", "credentials", "team"],
		"navbar": ["Tutorial", "Docs", "Billing"],
		"document": "https://docs.appbase.io",
		"tutorial": {
			url: "../../../app/views/tutorial/appbase-tutorial/index.html",
			title: "Appbase.io Interactive Tutorial",
			description: "Make your first API call in 2 mins."
		},
		"login": {
			description: "Login to Appbase or create an account to access your Dashboard."
		},
		"primary": "#3BC7F6",
		"accent": "#B6EF7E",
		"quickLinks": QuickLinks.AppbaseQuickLinks(),
		"dashboardGettingStarted": QuickLinks.AppbaseDashboardGettingStarted()
	},
	"reactivemaps": {
		"name": "reactivemaps",
		"logo": "../../../assets/images/logo.png",
		"favicon": "../../../assets/images/favicon.ico",
		"logoText": "Reactive Maps",
		"cardIcon": "fa-globe",
		"appDashboard": ["dashboard", "browser", "credentials", "team"],
		"navbar": ["Tutorial", "Docs"],
		"document": "https://docs.appbase.io",
		"tutorial": {
			url: "../../../app/views/tutorial/reactive-maps-onboarding/index.html",
			title: "Appbase Dashboard",
			description: "Try appbase dashboard over here"
		},
		"login": {
			description: "Login to Appbase or create an account to access your Dashboard."
		},
		"primary": "#5678FC",
		"accent": "#CDDC39",
		"quickLinks": QuickLinks.ReactiveMapsQuickLinks(),
		"dashboardGettingStarted": QuickLinks.ReactiveMapsDashboardGettingStarted()
	},
	"reactivesearch": {
		"name": "reactivesearch",
		"logo": "../../../assets/images/reactivesearch/logo.png",
		"favicon": "../../../assets/images/reactivesearch/favicon.ico",
		"logoText": "Reactive Search",
		"appDashboard": ["dashboard", "browser", "credentials", "team"],
		"navbar": ["Tutorial", "Docs"],
		"document": "https://docs.appbase.io",
		"tutorial": {
			url: "../../../app/views/tutorial/reactivesearch-onboarding/index.html",
			title: "Reactivesearch Dashboard",
			description: "Try Reactivesearch over here"
		},
		"login": {
			description: "Login to ReactiveSearch or create an account to access your Dashboard."
		},
		"primary": "#2251D1",
		"accent": "#FFD600",
		"quickLinks": QuickLinks.ReactiveSearchQuickLinks(),
		"dashboardGettingStarted": QuickLinks.ReactiveSearchDashboardGettingStarted()
	}
}

export const getConfig = () => {
	let context = appbaseService.context.split('/');
	context = context[1] && Object.keys(contextConfig).indexOf(context[1]) > -1 ? context[1] : "appbase";
	return contextConfig[context];
}
