import React from 'react';
import { Tabs, Icon, Spin } from 'antd';
import AppPage from '../../shared/AppPage';
import { appbaseService } from '../../service/AppbaseService';
import { getAnalytics } from './utils';
import UpgradePlan from './components/UpgradePlan';
import Flex from '../../shared/Flex';
import Analytics from './components/Analytics';
import PopularSearches from './components/PopularSearches';
import NoResultsSearch from './components/NoResultsSearch';
import PopularResults from './components/PopularResults';
import PopularFilters from './components/PopularFilters';
import RequestLogs from './components/RequestLogs';

const { TabPane } = Tabs;
class Main extends React.Component {
	constructor(props) {
		super(props);
		this.tabKeys = [
			'analytics',
			'popularSearches',
			'noResultSearches',
			'popularResults',
			'popularFilters',
			'requestLogs',
		];
		this.state = {
			isFetching: true,
			noResults: [],
			popularSearches: [],
			popularResults: [],
			popularFilters: [],
			searchVolume: [],
			isPaidUser: true, // TODO: CHANGE TO false
			activeTabKey: this.tabKeys.includes(props.params.tab)
				? props.params.tab
				: this.tabKeys[0],
		};
		const appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[appName];
		this.pageInfo = {
			currentView: 'mappings',
			appName,
			appId: this.appId,
		};
	}
	componentDidMount() {
		// checkUserStatus().then(
		// 	(response) => {
		// 		if (response.isPaidUser) {
		// 			this.setState({ isPaidUser: response.isPaidUser }, () => {
		// Only fetch in user is paid
		getAnalytics(this.pageInfo.appName)
			.then((res) => {
				this.setState({
					noResults: res.noresults,
					popularSearches: res.popularsearches,
					searchVolume: res.searchvolume,
					popularResults: res.popularResults,
					popularFilters: res.popularFilters,
					isFetching: false,
				});
			})
			.catch((e) => {
				this.setState({
					isFetching: false,
				});
				console.log('ERROR=>', e);
			});
		// 			});
		// 		} else {
		// 			this.setState({
		// 				isFetching: false,
		// 				isPaidUser: false,
		// 			});
		// 		}
		// 	},
		// 	() => {
		// 		this.setState({
		// 			isFetching: false,
		// 		});
		// 		toastr.error('Error', 'Something went wrong');
		// 	},
		// );
	}
	changeActiveTabKey = (tab) => {
		this.setState(
			{
				activeTabKey: tab,
			},
			() => this.redirectTo(tab),
		);
	};
	redirectTo = (tab) => {
		window.history.pushState(
			null,
			null,
			`${window.location.origin}/analytics/${this.pageInfo.appName}/${tab}`,
		);
	};
	render() {
		const {
			noResults,
			popularSearches,
			searchVolume,
			popularResults,
			popularFilters,
			isFetching,
			isPaidUser,
			activeTabKey,
		} = this.state;
		if (isFetching) {
			const antIcon = (
				<Icon type="loading" style={{ fontSize: 50, marginTop: '250px' }} spin />
			);
			return (
				<AppPage pageInfo={this.pageInfo} key={this.appId}>
					<Flex justifyContent="center" alignItems="center">
						<Spin indicator={antIcon} />
					</Flex>
				</AppPage>
			);
		}
		return (
			<AppPage pageInfo={this.pageInfo} key={this.appId}>
				<div className="ad-detail-page ad-dashboard row" style={{ padding: '40px' }}>
					{isPaidUser ? (
						<Tabs onTabClick={this.changeActiveTabKey} activeKey={activeTabKey}>
							<TabPane tab="Analytics" key={this.tabKeys[0]}>
								<Analytics
									loading={isFetching}
									noResults={noResults}
									popularSearches={popularSearches}
									popularFilters={popularFilters}
									popularResults={popularResults}
									searchVolume={searchVolume}
									redirectTo={tab => this.changeActiveTabKey(tab)}
								/>
							</TabPane>
							<TabPane tab="Popular Searches" key={this.tabKeys[1]}>
								<PopularSearches appName={this.pageInfo.appName} />
							</TabPane>
							<TabPane tab="No Result Searches" key={this.tabKeys[2]}>
								<NoResultsSearch appName={this.pageInfo.appName} />
							</TabPane>
							<TabPane tab="Popular Results" key={this.tabKeys[3]}>
								<PopularResults appName={this.pageInfo.appName} />
							</TabPane>
							<TabPane tab="Popular Filters" key={this.tabKeys[4]}>
								<PopularFilters appName={this.pageInfo.appName} />
							</TabPane>
							<TabPane tab="Request Logs" key={this.tabKeys[5]}>
								<RequestLogs
									tab={this.props.params.subTab}
									appName={this.pageInfo.appName}
									redirectTo={this.redirectTo}
								/>
							</TabPane>
						</Tabs>
					) : (
						<UpgradePlan />
					)}
				</div>
			</AppPage>
		);
	}
}
export default Main;
