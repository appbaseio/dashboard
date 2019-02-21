import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { css } from 'react-emotion';
import PropTypes from 'prop-types';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import { mediaKey } from '../../utils/media';
import SearchVolumeChart from '../../batteries/components/shared/Chart/SearchVolume';
import Overlay from '../../components/Overlay';
import Flex from '../../batteries/components/shared/Flex';
import DemoCards from '../../components/DemoCard';
import Container from '../../components/Container';
import { getAppAnalyticsByName, getAppPlanByName } from '../../batteries/modules/selectors';
import { exampleConfig } from '../../constants/config';
import { getAppAnalytics } from '../../batteries/modules/actions';
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
		const { fetchAppAnalytics, plan } = this.props;
		if (plan !== 'free') {
			fetchAppAnalytics();
		}
	}

	redirectTo = (url) => {
		window.location = url;
	};

	render() {
		const {
			popularSearches,
			noResults,
			appName,
			searchVolume,
			isPaid,
			isFetching,
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
						{isPaid ? (
							<SearchVolumeChart margin={10} height={210} data={searchVolume} />
						) : (
							<Overlay
								style={{
									maxWidth: '100%',
									height: '100%',
									backgroundColor: '#fff',
								}}
								lockSectionStyle={{
									marginTop: 100,
								}}
								imageStyle={{
									position: 'absolute',
									top: 0,
									bottom: 0,
									left: 0,
									margin: 'auto',
								}}
								iconStyle={{
									fontSize: 30,
								}}
								src="/static/images/analytics/SearchVolume.png"
								alt="analytics"
							/>
						)}
					</div>
				</Flex>
				{isPaid && (
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
				)}
				<div css="margin-top: 20px">
					<RequestLogs
						size={100}
						pageSize={5}
						changeUrlOnTabChange={false}
						appName={appName}
					/>
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
	fetchAppAnalytics: PropTypes.func.isRequired,
	plan: PropTypes.string.isRequired,
	appName: PropTypes.string.isRequired,
	searchVolume: PropTypes.array,
	popularSearches: PropTypes.array,
	isPaid: PropTypes.bool.isRequired,
	isFetching: PropTypes.bool.isRequired,
	noResults: PropTypes.array,
};
const mapStateToProps = (state) => {
	const analytics = getAppAnalyticsByName(state);
	const appPlan = getAppPlanByName(state);
	return {
		isFetching: get(state, '$getAppAnalytics.isFetching'),
		appName: get(state, '$getCurrentApp.name'),
		popularSearches: get(analytics, 'popularSearches'),
		noResults: get(analytics, 'noResultSearches'),
		searchVolume: get(analytics, 'searchVolume'),
		plan: get(appPlan, 'plan'),
		isPaid: get(appPlan, 'isPaid'),
	};
};
const mapDispatchToProps = dispatch => ({
	fetchAppAnalytics: (appName, plan) => dispatch(getAppAnalytics(appName, plan)),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PaidUserOverview);
