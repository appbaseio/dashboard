const defaultContext = "appbase";

const config = {
	"appbase": {
		"logo": "../../../assets/images/appbase/logo.svg",
		"logoText": null,
		"cardIcon": "fa-database",
		"appDashboard": ["dashboard", "browser", "gem", "mirage", "credentials", "team"],
		"document": "https://docs.appbase.io"
	},
	"reactivemaps": {
		"logo": "../../../assets/images/logo.png",
		"logoText": "Reactive Maps",
		"cardIcon": "fa-globe",
		"appDashboard": ["dashboard", "browser", "credentials", "team"],
		"document": "https://docs.appbase.io"
	}
}

const getJsonFromUrl = () => {
	var query = location.search.substr(1);
	var result = {};
	query.split("&").forEach(function(part) {
		var item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}

export const getConfig = () => {
	const queryString = window.location.search;
	let context = defaultContext;
	const result = getJsonFromUrl();
	if(result && result.context && Object.keys(config).indexOf(result.context) > -1) {
		localStorage.setItem("ad-context", result.context);
		context = result.context;
	} else {
		const localContext = localStorage.getItem("ad-context");
		context = localContext && localContext != "NaN" ? localContext : defaultContext;
	}
	return config[context];
}
