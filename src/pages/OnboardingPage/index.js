import React, { Component } from 'react';

import Introduction from './screens/Introduction';
import ImportData from './screens/ImportData';
import AppbaseFeatures from './screens/AppbaseFeatures';
import Search from './screens/Search';
import Facets from './screens/Facets';

import { onboardingStyles } from './styles';

const screens = {
	0: Introduction,
	1: ImportData,
	2: Search,
	3: Facets,
	4: AppbaseFeatures,
};

export default class Onboarding extends Component {
	state = {
		currentScreen: 0,
		totalScreen: 5,
		// eslint-disable-next-line
		thresholdScreen: 0, // to maintain the max threshold reached by currentScreen
		hasJSON: false,
		searchFields: [],
		facetFields: [],
		url: '',
	};

	nextScreen = () => {
		this.setState((state) => {
			const currentScreen =
				state.currentScreen + 1 < state.totalScreen
					? state.currentScreen + 1
					: state.currentScreen;

			return {
				...state,
				currentScreen,
				thresholdScreen: currentScreen,
			};
		});
	};

	previousScreen = () => {
		this.setState((state) => {
			const currentScreen = state.currentScreen - 1 >= 0
				? state.currentScreen - 1 : state.currentScreen;

			return {
				...state,
				currentScreen,
				thresholdScreen:
					state.thresholdScreen < state.currentScreen
						? state.currentScreen
						: state.thresholdScreen,
			};
		});
	};

	setScreen = (currentScreen) => {
		this.setState(state => ({
			...state,
			currentScreen:
				currentScreen <= state.thresholdScreen ? currentScreen : state.currentScreen,
		}));
	};

	importJSON = () => {
		this.setState({
			hasJSON: true,
		});
	};

	setURL = (url) => {
		this.setState({
			url,
		});
	};

	setSearchFields = (searchFields) => {
		this.setState({
			searchFields,
		});
	};

	setFacetFields = (facetFields) => {
		this.setState({
			facetFields,
		});
	};

	setAppName = (newApp) => {
		this.setState({
			newApp,
		});
	};

	renderCurrentScreen = () => {
		const {
			currentScreen, hasJSON, url, searchFields, facetFields, newApp,
		} = this.state;
		const RenderScreen = screens[currentScreen];
		let props = {};

		if (currentScreen === 0) {
			props = {
				importJSON: this.importJSON,
				hasJSON,
			};
		} else if (currentScreen === 1) {
			props = {
				url,
				setURL: this.setURL,
			};
		} else if (currentScreen === 2) {
			props = {
				setSearchFields: this.setSearchFields,
				searchFields,
			};
		} else if (currentScreen === 3) {
			props = {
				setFacetFields: this.setFacetFields,
				facetFields,
				searchFields,
				app: newApp,
			};
		} else {
			props = {
				facetFields,
				searchFields,
				app: newApp,
			};
		}

		return (
			<RenderScreen
				nextScreen={this.nextScreen}
				previousScreen={this.previousScreen}
				setAppName={this.setAppName}
				{...props}
			/>
		);
	};

	render() {
		const  { currentScreen, totalScreen } = this.state;

		return (
			<div className={onboardingStyles}>
				<div className="left">
					<header>
						<span>STEPS</span>
						<span>
							{currentScreen + 1} of {totalScreen}
						</span>
					</header>
					<div className="meter">
						<div
							className="color"
							style={{
								width: `${((currentScreen + 1) * 100) /
									totalScreen}%`,
							}}
						/>
					</div>
					<ul>
						<li>
							<a className={currentScreen === 0 ? 'active' : null}>
								Create your first app
							</a>
						</li>
						<li>
							<a
								className={currentScreen === 1 ? 'active' : null}
								onClick={() => this.setScreen(1)}
							>
								Import data into your app
							</a>
						</li>
						<li>
							<a
								className={currentScreen === 2 ? 'active' : null}
								onClick={() => this.setScreen(2)}
							>
								Set searchable fields
							</a>
						</li>
						<li>
							<a
								className={currentScreen === 3 ? 'active' : null}
								onClick={() => this.setScreen(3)}
							>
								Set aggregation fields
							</a>
						</li>
						{/* <li>
							<a
								className={currentScreen === 4 ? 'active' : null}
								onClick={() => this.setScreen(4)}
							>
								Stream realtime updates
							</a>
						</li> */}
					</ul>
				</div>
				<div className="right">
					<a className="skip-link" href="/">
						&#10005; &nbsp; Skip Tutorial
					</a>
					<div className="container">{this.renderCurrentScreen()}</div>
				</div>
			</div>
		);
	}
}