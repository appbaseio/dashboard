import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { css } from 'react-emotion';
import PropTypes from 'prop-types';
import { mediaKey } from '../../utils/media';
import SearchVolumeChart from '../../batteries/components/shared/Chart/SearchVolume';
import Flex from '../../batteries/components/shared/Flex';
import DemoCards from '../../components/DemoCard';
import Container from '../../components/Container';
import { getAppAnalyticsByName } from '../../batteries/modules/selectors';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import { exampleConfig } from '../../constants/config';
import { getAppMetrics, getAppAnalytics } from '../../batteries/modules/actions';
import { getFilteredResults } from '../../batteries/utils/heplers';
import UsageDetails from '../../components/UsageDetails';
import Searches from '../../batteries/components/analytics/components/Searches';
import RequestLogs from '../../batteries/components/analytics/components/RequestLogs';

const main = css`
	${mediaKey.small} {
		flex-direction: column;
	}
`;
const chart = css`
	margin-left: 10px;
	width: 100%;
	${mediaKey.small} {
		height: 300px;
		margin-left: 0;
		margin-top: 20px;
		margin-bottom: 20px;
	}
`;
const usage = css`
	margin-right: 10px;
	${mediaKey.small} {
		margin-right: 0;
	}
`;
const results = css`
	width: 100%;
	margin-top: 20px;
	${mediaKey.small} {
		flex-direction: column;
	}
`;
const searchCls = css`
	flex: 50%;
	margin-right: 10px;
	${mediaKey.small} {
		margin-right: 0;
	}
`;
const noResultsCls = css`
	flex: 50%;
	margin-left: 10px;
	${mediaKey.small} {
		margin-left: 0;
		margin-top: 20px;
	}
`;
class PaidUserOverview extends React.Component {
	componentDidMount() {
		const { fetchAppMetrics, fetchAppAnalytics } = this.props;
		fetchAppMetrics();
		fetchAppAnalytics();
	}

	redirectTo = (url) => {
		window.location = url;
	};

	render() {
		const {
 isFetching, popularSearches, noResults, appName, searchVolume,
} = this.props;
		if (isFetching) {
			return <Loader />;
		}
		return (
			<Container>
				<Flex css={main} justifyContent="space-between">
					<div css={usage}>
						<UsageDetails />
					</div>
					<div css={chart}>
						<SearchVolumeChart margin={10} height={210} data={searchVolume} />
					</div>
				</Flex>
				<Flex css={results}>
					<div css={searchCls}>
						<Searches
							css="height: 100%"
							href="popular-searches"
							dataSource={getFilteredResults(popularSearches)}
							title="Popular Searches"
						/>
					</div>
					<div css={noResultsCls}>
						<Searches
							css="height: 100%"
							href="no-results-searches"
							dataSource={getFilteredResults(noResults)}
							title="No Result Searches"
						/>
					</div>
				</Flex>
				<div css="margin-top: 20px">
					<RequestLogs pageSize={5} changeUrlOnTabChange={false} appName={appName} />
				</div>
				<DemoCards cardConfig={exampleConfig} />
			</Container>
		);
	}
}
PaidUserOverview.defaultProps = {
	searchVolume: [],
	popularSearches: [],
	noResults: [],
};
PaidUserOverview.propTypes = {
	fetchAppMetrics: PropTypes.func.isRequired,
	fetchAppAnalytics: PropTypes.func.isRequired,
	isFetching: PropTypes.bool.isRequired,
	appName: PropTypes.string.isRequired,
	searchVolume: PropTypes.array,
	popularSearches: PropTypes.array,
	noResults: PropTypes.array,
};
const mapStateToProps = (state) => {
	const analytics = getAppAnalyticsByName(state);
	return {
		isFetching: get(state, '$getAppMetrics.isFetching'),
		appName: get(state, '$getCurrentApp.name'),
		popularSearches: get(analytics, 'popularSearches'),
		noResults: get(analytics, 'noResultSearches'),
		searchVolume: get(analytics, 'searchVolume'),
	};
};
const mapDispatchToProps = dispatch => ({
	fetchAppMetrics: (appId, appName) => dispatch(getAppMetrics(appId, appName)),
	fetchAppAnalytics: (appName, plan) => dispatch(getAppAnalytics(appName, plan)),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PaidUserOverview);
