import React from 'react';
import { Layout, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { string } from 'prop-types';
import get from 'lodash/get';

import FullHeader from '../../components/FullHeader';
import { endScreenStyles } from './styles';
import { getParam } from '../../utils';

const integrations = [
	{
		name: 'React',
		image1x: '/static/images/onboarding/finish-screen/React@1x.png',
		image2x: '/static/images/onboarding/finish-screen/React@2x.png',
		description: 'React UI components for building data-driven search experiences',
		url: 'https://opensource.appbase.io/reactivesearch',
	},
	{
		name: 'Vue',
		image1x: '/static/images/onboarding/finish-screen/vue@1x.png',
		image2x: '/static/images/onboarding/finish-screen/vue@2x.png',
		description: 'Vue UI components for building data-driven search experiences',
		url: 'https://opensource.appbase.io/reactivesearch/vue',
	},
	{
		name: 'React Native',
		image1x: '/static/images/onboarding/finish-screen/ReactNative@1x.png',
		image2x: '/static/images/onboarding/finish-screen/ReactNative@2x.png',
		description: 'Build data-driven search experiences for iOS and Android apps',
		url: 'https://opensource.appbase.io/reactivesearch/native',
	},
	{
		name: 'REST APIs',
		image1x: '/static/images/onboarding/finish-screen/REST@1x.png',
		image2x: '/static/images/onboarding/finish-screen/REST@2x.png',
		description: 'API for working with elasticsearch / appbase apps',
		url: 'https://docs.appbase.io/rest-quickstart.html',
	},
	{
		name: 'Javascript Library',
		image1x: '/static/images/onboarding/finish-screen/JS@1x.png',
		image2x: '/static/images/onboarding/finish-screen/JS@2x.png',
		description: 'Javascript client library for working with elasticseach / appbase apps',
		url: 'https://docs.appbase.io/javascript/quickstart.html',
	},
];

const getFilteredList = (query) => {
	const matchQuery = query.toLowerCase();
	return integrations.filter(item => item.name.toLowerCase().indexOf(matchQuery) > -1);
};

class EndScreen extends React.PureComponent {
	state = {
		searchQuery: '',
	};

	handleSearchChange = (e) => {
		const {
			target: { value },
		} = e;
		this.setState({
			searchQuery: value,
		});
	};

	render() {
		const { searchQuery } = this.state;
		const integrationsList = searchQuery.trim() ? getFilteredList(searchQuery) : integrations;
		const { currentApp } = this.props;
		return (
			<Layout>
				<FullHeader />
				<div className={endScreenStyles}>
					<div className="container">
						<div className="banner-row">
							<div className="big-card">
								<div className="img-container">
									<img
										src="/static/images/onboarding/finish-screen/SearchSandbox.png"
										alt="search-sandobx"
									/>
								</div>
								<div className="text">
									<div>
										<h3>SEARCH PREVIEW</h3>
										<h1>Keep tunning search settings</h1>
										<p>
											Continue tuning search, filter and layout options for
											this app.
										</p>
									</div>
									{currentApp && (
										<Link to={`/app/${currentApp}/search-preview`}>
											Go to Search Preview
										</Link>
									)}
								</div>
							</div>

							<div className="small-card">
								<div className="text">
									<div>
										<h3>DASHBOARD</h3>
										<h1>
											<Link
												to={
													currentApp ? `/app/${currentApp}/overview` : '/'
												}
											>
												Go to your App
											</Link>
										</h1>
										<p>
											Import data, get search analytics, manage security and
											access.
										</p>
									</div>
									<Link to="/">Go to Dashboard</Link>
								</div>
							</div>
						</div>

						<div className="integration-container">
							<div className="title">Check our integrations</div>

							<div className="search-input-container">
								<input
									value={searchQuery}
									onChange={this.handleSearchChange}
									type="text"
									placeholder="Search for integrations.."
								/>
								<button type="submit">
									<Icon type="search" />
								</button>
							</div>

							<div className="card-row">
								{integrationsList.map(item => (
									<div className="card" key={item.name}>
										<img
											src={item.image1x}
											srcSet={`${item.image1x} 245w, ${item.image2x} 490w`}
											alt="React"
										/>
										<h2>{item.name}</h2>
										<p>{item.description}</p>
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={item.url}
										>
											View more
										</a>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}

EndScreen.propTypes = {
	currentApp: string.isRequired,
};

const mapStateToProps = (state) => {
	// for development and testing
	const urlApp = Object.keys(state.apps).find(item => state.apps[item] === getParam('app')) || '';

	return {
		currentApp: get(state, '$getCurrentApp.name') || urlApp,
	};
};

export default connect(mapStateToProps)(EndScreen);
