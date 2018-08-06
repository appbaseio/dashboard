import React from 'react';
import { css } from 'emotion';
import moment from 'moment';
import { ACC_API } from './../../../config';
import Flex from '../../shared/Flex';
// import logs from './logsData';

const requestOpt = css`
	color: #00ff88;
	text-transform: uppercase;
	font-weight: 500;
	padding: 5px 10px;
	border-radius: 3px;
	border: solid 1px #00ff88;
`;
const getQueryParams = (paramObj) => {
	let queryString = '';
	Object.keys(paramObj).forEach((o, i) => {
		if (i === 0) {
			queryString = `?${o}=${paramObj[o]}`;
		} else {
			queryString = `&${o}=${paramObj[o]}`;
		}
	});
	return queryString;
};
export const getTimeDuration = (time) => {
	const timeInMs = moment.duration(moment().diff(time)).asMilliseconds();
	if (timeInMs >= 24 * 60 * 60 * 1000) {
		const timeD = parseInt(timeInMs / (24 * 60 * 60 * 1000), 10);
		return {
			unit: 'day',
			time: timeD,
			formattedUnit: timeD > 1 ? 'days' : 'day',
		};
	}
	if (timeInMs >= 60 * 60 * 1000) {
		const timeH = parseInt(timeInMs / (60 * 60 * 1000), 10);
		return {
			unit: 'hr',
			time: timeH,
			formattedUnit: timeH > 1 ? 'hrs' : 'hr',
		};
	}
	if (timeInMs >= 60 * 1000) {
		const timeM = parseInt(timeInMs / (60 * 1000), 10);
		return {
			unit: 'min',
			time: timeM,
			formattedUnit: timeM > 1 ? 'mins' : 'min',
		};
	}
	if (timeInMs >= 1000) {
		const timeS = parseInt(timeInMs / 1000, 10);
		return {
			unit: 'sec',
			time: timeS,
			formattedUnit: timeS > 1 ? 'secs' : 'sec',
		};
	}
	return {
		unit: 'ms',
		time: parseInt(timeInMs / 1000, 10),
	};
};
export const popularFiltersCol = [
	{
		title: 'Polpular Filters',
		dataIndex: 'key',
	},
	{
		title: 'Impressions',
		dataIndex: 'count',
	},
	{
		title: 'Click Rate',
		dataIndex: 'clickrate',
	},
];
export const popularResultsCol = [
	{
		title: 'Polpular Results',
		dataIndex: 'key',
	},
	{
		title: 'Impressions',
		dataIndex: 'count',
	},
	{
		title: 'Click Rate',
		dataIndex: 'clickrate',
	},
];
export const defaultColumns = [
	{
		title: 'Search Terms',
		dataIndex: 'key',
	},
	{
		title: 'Total Queries',
		dataIndex: 'count',
	},
	{
		title: 'Click Rate',
		dataIndex: 'clickrate',
	},
];
export const popularSearchesFull = [
	...defaultColumns,
	{
		title: 'Clicks',
		dataIndex: 'clicks',
	},
	{
		title: 'Click Position',
		dataIndex: 'clickposition',
	},
	{
		title: 'Conversion Rate',
		dataIndex: 'conversionrate',
	},
];
const data = {
	body: {
		popularSearches: [
			{
				key: 'Iphone X',
				count: 23,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 'Oculus VR',
				count: 12,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 'One Plus',
				count: 5,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
		],
		noResultSearches: [
			{
				key: 'Iphone 10',
				count: 15,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 'Oclus VR',
				count: 5,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 'One Plus',
				count: 12,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
		],
		searchVolume: [
			{
				key: 1531333800000,
				key_as_string: '2018-07-12T00:00:00.000Z',
				count: 101,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 1531420200000,
				key_as_string: '2018-07-13T00:00:00.000Z',
				count: 89,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 1531506600000,
				key_as_string: '2018-07-14T00:00:00.000Z',
				count: 115,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 1531593000000,
				key_as_string: '2018-07-15T00:00:00.000Z',
				count: 55,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 1531679400000,
				key_as_string: '2018-07-16T00:00:00.000Z',
				count: 76,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 1531765800000,
				key_as_string: '2018-07-17T00:00:00.000Z',
				count: 110,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 1531852200000,
				key_as_string: '2018-07-18T00:00:00.000Z',
				count: 125,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
		],
		popularFilters: [
			{
				key: 'category',
				value: 'apple',
				count: 3,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: 'since',
				value: '2016-2018',
				count: 2,
				clicks: 25,
				clickposition: 1.82, // won't be present in popularResults
				clickrate: 12.5,
				conversionrate: 1.35,
			},
		],
		popularResults: [
			{
				key: 'abcxyz',
				source: JSON.stringify({
					random: 'a',
					stuff: 'b',
				}),
				count: 35,
				clicks: 25,
				clickrate: 12.5,
				conversionrate: 1.35,
			},
			{
				key: '12341',
				source: JSON.stringify({
					random: 'a',
					stuff: 'b',
				}),
				count: 14,
				clicks: 25,
				clickrate: 12.5,
				conversionrate: 1.35,
			},
		],
	},
};
export const popularResultsFull = [
	...defaultColumns,
	{
		title: 'Clicks',
		dataIndex: 'clicks',
		key: 'clicks',
	},
	{
		title: 'Source',
		dataIndex: 'source',
		key: 'source',
	},
	{
		title: 'Conversion Rate',
		dataIndex: 'conversionrate',
		key: 'conversionrate',
	},
];
export const requestLogs = [
	{
		title: 'Operation',
		dataIndex: 'operation',
		render: operation => (
			<div>
				<Flex>
					<div css="width: 70px">
						<span css={requestOpt}>{operation.method}</span>
					</div>
					<div>
						<span css="color: #74A2FF;margin-left: 10px">{operation.uri}</span>
					</div>
				</Flex>
			</div>
		),
	},
	{
		title: 'Classifier',
		dataIndex: 'classifier',
	},
	{
		title: 'Time',
		dataIndex: 'timeTaken',
	},
	{
		title: 'Status',
		dataIndex: 'status',
	},
];
/**
 * Get the analytics
 * @param {string} appName
 */
export function getAnalytics(appName, userPlan, clickanalytics = true) {
	return new Promise((resolve, reject) => {
		const url =
			userPlan === 'growth'
				? `${ACC_API}/analytics/${appName}/advanced`
				: `${ACC_API}/analytics/${appName}/overview`;
		const queryParams = getQueryParams({ clickanalytics });
		fetch(url + queryParams, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			// Comment out this line
			.then(res => res.json())
			.then((res) => {
				// resolve the promise with response
				resolve(res);
			})
			.catch((e) => {
				reject(e);
			});
	});
}
/**
 * Get the popular seraches
 * @param {string} appName
 */
export function getPopularSearches(appName, clickanalytics = true) {
	return new Promise((resolve, reject) => {
		fetch(
			`${ACC_API}/analytics/${appName}/popularsearches${getQueryParams({ clickanalytics })}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
			// Comment out this line
			.then(res => res.json())
			.then((res) => {
				// resolve the promise with response
				resolve(res.popularSearches);
				// resolve(data.body.popularSearches);
			})
			.catch((e) => {
				reject(e);
			});
	});
}
/**
 * Get the no results seraches
 * @param {string} appName
 */
export function getNoResultSearches(appName, clickanalytics = true) {
	return new Promise((resolve, reject) => {
		fetch(
			`${ACC_API}/analytics/${appName}/noresultsearches${getQueryParams({ clickanalytics })}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
			// Comment out this line
			.then(res => res.json())
			.then((res) => {
				// resolve the promise with response
				resolve(res.noResultSearches);
			})
			.catch((e) => {
				reject(e);
			});
	});
}
export function getPopularResults(appName, clickanalytics = true) {
	return new Promise((resolve, reject) => {
		fetch(
			`${ACC_API}/analytics/${appName}/popularResults${getQueryParams({ clickanalytics })}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
			// Comment out this line
			.then(res => res.json())
			.then((res) => {
				// resolve the promise with response
				resolve(res.popularResults);
			})
			.catch((e) => {
				reject(e);
			});
	});
}
export function getPopularFilters(appName, clickanalytics = true) {
	return new Promise((resolve, reject) => {
		fetch(
			`${ACC_API}/analytics/${appName}/popularFilters${getQueryParams({ clickanalytics })}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
			// Comment out this line
			.then(res => res.json())
			.then((res) => {
				// resolve the promise with response
				resolve(res.popularFilters);
			})
			.catch((e) => {
				reject(e);
			});
	});
}
// To fetch request logs
export function getRequestLogs(appName) {
	return new Promise((resolve, reject) => {
		fetch(`${ACC_API}/app/${appName}/logs`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			// Comment out this line
			.then(res => res.json())
			.then((res) => {
				// resolve the promise with response
				resolve(res);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

// Banner messages
export const bannerMessages = {
	free: {
		title: 'Unlock the ROI impact of your search',
		description:
			'Get a paid plan to see actionable analytics on search volume, popular searches, no results, track clicks and conversions.',
		buttonText: 'Upgrade Now',
		href: '/billing',
	},
	bootstrap: {
		title: 'Get richer analytics on clicks and conversions',
		description:
			'By upgrading to the Growth plan, you can get more actionable analytics on popular filters, popular results, and track clicks and conversions along with a 30-day retention.',
		buttonText: 'Upgrade To Growth',
		href: '/billing',
		isHorizontal: true,
	},
	growth: {
		title: 'Learn how to track click analytics',
		description:
			'See our docs on how to track search, filters, click events, conversions and your own custom events.',
		buttonText: 'Read Docs',
		isHorizontal: true,
		href: 'https://docs.appbase.io',
	},
};
