import React from 'react';
import { Tabs } from 'antd';
import AppPage from '../../shared/AppPage';
import { appbaseService } from '../../service/AppbaseService';
import Tab1 from './components/Tab1';
import { getAnalytics } from './utils';

const { TabPane } = Tabs;
class Analytics extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isFetching: true,
			noResults: [],
			popularSearches: [],
			searchVolume: [],
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
		getAnalytics(this.pageInfo.appName)
			.then((res) => {
				this.setState({
					noResults: res.noresults,
					popularSearches: res.popularsearches,
					searchVolume: res.searchvolume,
					isFetching: false,
				});
			})
			.catch((e) => {
				this.setState({
					isFetching: false,
				});
				console.log('ERROR=>', e);
			});
	}
	render() {
		console.log('THSI IS PROPS', this.props);
		const {
 noResults, popularSearches, searchVolume, isFetching,
} = this.state;
		return (
			<AppPage pageInfo={this.pageInfo} key={this.appId}>
				<div className="ad-detail-page ad-dashboard row" style={{ padding: '40px' }}>
					<Tabs defaultActiveKey="1">
						<TabPane tab="Analytics" key="1">
							<Tab1
								loading={isFetching}
								noResults={noResults}
								popularSearches={popularSearches}
								searchVolume={searchVolume}
							/>
						</TabPane>
						<TabPane tab="Popular Searches" key="2">
							Content of Tab Pane 2
						</TabPane>
						<TabPane tab="No Result Searches" key="3">
							Content of Tab Pane 3
						</TabPane>
					</Tabs>
				</div>
			</AppPage>
		);
	}
}
export default Analytics;
