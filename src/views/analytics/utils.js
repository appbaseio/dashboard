import { ANALYTICS_API } from './../../config';

const data = {
	body: {
		popularsearches: [
			{
				term: 'Iphone X',
				count: 23,
			},
			{
				term: 'Oculus VR',
				count: 12,
			},
			{
				term: 'One Plus',
				count: 5,
			},
		],
		noresults: [
			{
				term: 'Iphone 10',
				count: 15,
			},
			{
				term: 'Oclus VR',
				count: 5,
			},
			{
				term: 'One Plus',
				count: 12,
			},
		],
		searchvolume: [
			{
				key: 1531333800000,
				key_as_string: '2018-07-12T00:00:00.000Z',
				count: 101,
			},
			{
				key: 1531420200000,
				key_as_string: '2018-07-13T00:00:00.000Z',
				count: 89,
			},
			{
				key: 1531506600000,
				key_as_string: '2018-07-14T00:00:00.000Z',
				count: 115,
			},
			{
				key: 1531593000000,
				key_as_string: '2018-07-15T00:00:00.000Z',
				count: 55,
			},
			{
				key: 1531679400000,
				key_as_string: '2018-07-16T00:00:00.000Z',
				count: 76,
			},
			{
				key: 1531765800000,
				key_as_string: '2018-07-17T00:00:00.000Z',
				count: 110,
			},
			{
				key: 1531852200000,
				key_as_string: '2018-07-18T00:00:00.000Z',
				count: 125,
			},
		],
	},
};
/**
 * Get the analytics
 * @param {string} appName
 */
// eslint-disable-next-line
export function getAnalytics(appName) {
	return new Promise((resolve, reject) => {
		fetch(ANALYTICS_API, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		    // Comment out this line
			// .then(res => res.json())
			.then((res) => {
				// resolve the promise with response
				resolve(data.body);
			})
			.catch((e) => {
				reject(e);
			});
	});
}
