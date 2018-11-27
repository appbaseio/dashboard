export const regions = {
	azure: {
		eastus: { name: 'East US 1', flag: 'united-states.png' },
		eastus2: { name: 'East US 2', flag: 'united-states.png' },
		centralus: { name: 'Central US', flag: 'united-states.png' },
		westeurope: { name: 'West Europe', flag: 'europe.png' },
		canadacentral: { name: 'Canada Central', flag: 'canada.png' },
		canadaeast: { name: 'Canada East', flag: 'canada.png' },
		// New regions
		australiaeast: { name: 'Australia East', flag: 'australia.png' },
		japaneast: { name: 'Japan East', flag: 'japan.png' },
		uksouth: { name: 'Uk South', flag: 'uk.png' },
		northeurope: { name: 'North Europe', flag: 'europe.png' },
		westus2: { name: 'West US 2', flag: 'united-states.png' },
		westus: { name: 'West US 1', flag: 'united-states.png' },
		southeastasia: { name: 'South East Asia' },
	},
	gke: {
		'us-east1-b': { name: 'US East 1B', flag: 'united-states.png' },
		'europe-west1-b': { name: 'Europe West 1B', flag: 'europe.png' },
		'us-central1-b': { name: 'US Central 1B', flag: 'united-states.png' },
		'australia-southeast1-b': { name: 'Australia South-east 1B', flag: 'australia.png' },
		'us-east4-b': { name: 'US East 4B', flag: 'united-states.png' },
		'southamerica-east1-c': { name: 'South America East 1C', flag: 'united-states.png' },
		'northamerica-northeast1-b': {
			name: 'North America North East 1B',
			flag: 'united-states.png',
		},
		'europe-north1-b': { name: 'Europe North 1B', flag: 'europe.png' },
		'asia-southeast1-b': { name: 'Asia South East 1B', flag: 'singapore.png' },
		'asia-east1-b': { name: 'Asia East 1B', flag: 'taiwan.png' },
		'asia-northeast1-a': { name: 'Asia North East 1A', flag: 'japan.png' },
	},
};

export const regionsByPlan = {
	gke: {},
	azure: {},
};
