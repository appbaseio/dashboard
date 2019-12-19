export const regions = {
	azure: {
		eastus: { name: 'East US 1', flag: 'united-states.png', continent: 'us' },
		eastus2: { name: 'East US 2', flag: 'united-states.png', continent: 'us' },
		centralus: { name: 'Central US', flag: 'united-states.png', continent: 'us' },
		westeurope: { name: 'West Europe', flag: 'europe.png', continent: 'eu' },
		canadacentral: { name: 'Canada Central', flag: 'canada.png', cotinent: 'us' },
		canadaeast: { name: 'Canada East', flag: 'canada.png', continent: 'us' },
		// New regions
		australiaeast: { name: 'Australia East', flag: 'australia.png' },
		japaneast: { name: 'Japan East', flag: 'japan.png', continent: 'asia' },
		uksouth: { name: 'Uk South', flag: 'uk.png', continent: 'eu' },
		northeurope: { name: 'North Europe', flag: 'europe.png', continent: 'eu' },
		westus2: { name: 'West US 2', flag: 'united-states.png', continent: 'us' },
		westus: { name: 'West US 1', flag: 'united-states.png', continent: 'us' },
		southeastasia: { name: 'South East Asia', flag: 'singapore.png', continent: 'asia' },
	},
	gke: {
		'europe-west1': { name: 'Belgium', flag: 'belgium@3x.png', continent: 'eu' },
		'europe-west2': { name: 'London', flag: 'london@3x.png', continent: 'eu' },
		'europe-west4': { name: 'Netherlands', flag: 'netherlands@3x.png', continent: 'eu' },
		'europe-west6': { name: 'Zurich', flag: 'switzerland.png', continent: 'eu' },
		'europe-west3': { name: 'FrankFurt', flag: 'germany.png', continent: 'eu' },
		'europe-north1': { name: 'Finland', flag: 'finland@3x.png', continent: 'eu' },
		'us-east1': { name: 'South Carolina', flag: 'united-states.png', continent: 'us' },
		'us-central1': { name: 'Iowa', flag: 'united-states.png', continent: 'us' },
		'us-east4': { name: 'N. Virginia', flag: 'united-states.png', continent: 'us' },
		'northamerica-northeast1': {
			name: 'Montreal',
			flag: 'canada.png',
			continent: 'us',
		},
		'australia-southeast1': { name: 'Sydney', flag: 'australia.png' },
		'asia-southeast1': {
			name: 'Singapore',
			flag: 'singapore.png',
			continent: 'asia',
		},
		'asia-east1': { name: 'Taiwan', flag: 'taiwan.png', continent: 'asia' },
		'asia-south1': { name: 'Mumbai', flag: 'mumbai@3x.png', continent: 'asia' },
		'asia-northeast1': { name: 'Tokyo', flag: 'japan.png', continent: 'asia' },
	},
};

export const regionsByPlan = {
	gke: {},
	azure: {},
};
