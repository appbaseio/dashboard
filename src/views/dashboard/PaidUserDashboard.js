import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import Flex from '../../shared/Flex';
import UsageDetails from './UsageDetails';
import { getAnalytics } from '../analytics/utils';
import SearchVolumeChart from '../../shared/SearchVolumeChart';
import Searches from '../analytics/components/Searches';
import RequestLogs from '../analytics/components/RequestLogs';

class PaidUserDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// isFetching: true,
			noResults: [],
			popularSearches: [],
			searchVolume: [],
		};
	}
	componentDidMount() {
		getAnalytics(this.props.appName)
			.then((res) => {
				this.setState({
					noResults: res.noresults,
					popularSearches: res.popularsearches,
					searchVolume: res.searchvolume,
					// isFetching: false,
				});
			})
			.catch((e) => {
				this.setState({
					// isFetching: false,
				});
				console.log('ERROR=>', e);
			});
	}
	redirectTo = (tab) => {
		window.location = `${window.location.origin}/analytics/${this.props.appName}/${tab}`;
	};
	render() {
		const { plan, appCount } = this.props;
		const { searchVolume, popularSearches, noResults } = this.state;
		return (
			<div css="padding: 40px">
				<Flex justifyContent="space-between">
					<div css="margin-right: 10px">
						<UsageDetails plan={plan} appCount={appCount} />
					</div>
					<Card css="margin-left: 10px" title="Daily Search Volume">
						<SearchVolumeChart
							width={window.innerWidth - 580}
							height={210}
							data={searchVolume}
						/>
					</Card>
				</Flex>
				<Flex css="width: 100%;margin-top: 20px">
					<div css="flex: 50%;margin-right: 10px">
						<Searches
							onClick={() => this.redirectTo('popularSearches')}
							dataSource={popularSearches}
							title="Popular Searches"
						/>
					</div>
					<div css="flex: 50%;margin-left: 10px">
						<Searches
							onClick={() => this.redirectTo('noResultSearches')}
							dataSource={noResults}
							title="No Result Searches"
						/>
					</div>
				</Flex>
				<div css="margin-top: 20px">
					<RequestLogs changeUrlOnTabChange={false} appName={this.props.appName} />
				</div>
			</div>
		);
	}
}
PaidUserDashboard.propTypes = {
	plan: PropTypes.string,
	appCount: PropTypes.object,
	appName: PropTypes.string,
};
export default PaidUserDashboard;
