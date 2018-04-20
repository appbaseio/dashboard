import React, { Component } from "react";

import Introduction from "./screens/Introduction";
import AppbaseFeatures from "./screens/AppbaseFeatures";
import Search from "./screens/Search";
import Facets from "./screens/Facets";

const screens = {
	0: Introduction,
	1: Search,
	2: Facets,
	3: AppbaseFeatures,
};

export default class Onboarding extends Component {
	state = {
		currentScreen: 0,
		totalScreen: 4,
		thresholdScreen: 0, // to maintain the max threshold reached by currentScreen
		hasJSON: false,
		searchFields: [],
	};

	nextScreen = () => {
		this.setState((state) => {
			const currentScreen = state.currentScreen + 1 < state.totalScreen
				? state.currentScreen + 1
				: state.currentScreen;

			return ({
				...state,
				currentScreen,
				thresholdScreen: currentScreen,
			});
		});
	};

	setScreen = (currentScreen) => {
		this.setState(state => ({
			...state,
			currentScreen: currentScreen <= state.thresholdScreen ? currentScreen : state.currentScreen,
		}));
	};

	importJSON = () => {
		this.setState({
			hasJSON: true,
		});
	};

	setSearchFields = (searchFields) => {
		this.setState({
			searchFields,
		});
	};

	renderCurrentScreen = () => {
		const RenderScreen = screens[this.state.currentScreen];
		let props = {};

		if (this.state.currentScreen === 0) {
			props = {
				importJSON: this.importJSON,
				hasJSON: this.state.hasJSON,
			}
		} else if (this.state.currentScreen === 1) {
			props = {
				setSearchFields: this.setSearchFields,
				searchFields: this.state.searchFields,
			};
		}

		return <RenderScreen nextScreen={this.nextScreen} {...props} />;
	};

	render() {
		return (
			<div className="onboarding-wrapper">
				<div className="left">
					<ul>
						<li>
							<a
								className={this.state.currentScreen === 0 ? 'active' : null}
								onClick={() => this.setScreen(0)}
							>
								Importing data into Elasticsearch
							</a>
						</li>
						<li>
							<a
								className={this.state.currentScreen === 1 ? 'active' : null}
								onClick={() => this.setScreen(1)}
							>
								Improving Search Relevancy
							</a>
						</li>
						<li>
							<a
								className={this.state.currentScreen === 2 ? 'active' : null}
								onClick={() => this.setScreen(2)}
							>
								Building Facets for your search screen
							</a>
						</li>
						<li>
							<a
								className={this.state.currentScreen === 3 ? 'active' : null}
								onClick={() => this.setScreen(3)}
							>
								Realtime Elasticsearch queries
							</a>
						</li>
					</ul>
				</div>
				<div className="right">
					<div className="container">
						{this.renderCurrentScreen()}
					</div>
				</div>
			</div>
		);
	}
}
