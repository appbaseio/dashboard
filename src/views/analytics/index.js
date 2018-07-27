import React from 'react';
import { Tabs, Icon, Spin } from 'antd';
import AppPage from '../../shared/AppPage';
import { appbaseService } from '../../service/AppbaseService';
import Tab1 from './components/Tab1';
import Tab2 from './components/Tab2';
import { getAnalytics } from './utils';
// import { checkUserStatus } from '../../utils/user';
import UpgradePlan from './components/UpgradePlan';
import Flex from '../../shared/Flex';
import Tab3 from './components/Tab3';
import Tab4 from './components/Tab4';
import Tab5 from './components/Tab5';

const { TabPane } = Tabs;
class Analytics extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isFetching: true,
			noResults: [],
			popularSearches: [],
			popularResults: [],
			popularFilters: [],
			searchVolume: [],
			isPaidUser: true, // TODO: CHANGE TO false
			activeTabKey: props.params.tab || 'analytics',
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
						<Tabs
							defaultActiveKey={this.props.params.tab || 'analytics'}
							animated={false}
							onTabClick={this.changeActiveTabKey}
							activeKey={activeTabKey}
						>
							<TabPane tab="Analytics" key="analytics">
								<Tab1
									loading={isFetching}
									noResults={noResults}
									popularSearches={popularSearches}
									popularFilters={popularFilters}
									popularResults={popularResults}
									searchVolume={searchVolume}
									redirectTo={tab => this.changeActiveTabKey(tab)}
								/>
							</TabPane>
							<TabPane tab="Popular Searches" key="popularSearches">
								<Tab2 appName={this.pageInfo.appName} />
							</TabPane>
							<TabPane tab="No Result Searches" key="noResultSearches">
								<Tab3 appName={this.pageInfo.appName} />
							</TabPane>
							<TabPane tab="Popular Results" key="popularResults">
								<Tab4 appName={this.pageInfo.appName} />
							</TabPane>
							<TabPane tab="Popular Filters" key="popularFilters">
								<Tab5 appName={this.pageInfo.appName} />
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
export default Analytics;
