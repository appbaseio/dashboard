import React from 'react';
import { Layout } from 'antd';
import Loadable from 'react-loadable';
import { Switch, Route } from 'react-router-dom';
import AppHeader from '../AppHeader';
import Loader from '../Loader';
import AppPageContainer from '../AppPageContainer';
import ErrorPage from '../../pages/ErrorPage';

const AnalyticsPage = Loadable({
	loader: () => import('../../pages/AnalyticsPage'),
	loading: Loader,
});
const GeoDistributionPage = Loadable({
	loader: () => import('../../pages/GeoDistributionPage'),
	loading: Loader,
});
const RequestDistributionPage = Loadable({
	loader: () => import('../../pages/RequestDistributionPage'),
	loading: Loader,
});
const SearchLatency = Loadable({
	loader: () => import('../../pages/SearchLatency'),
	loading: Loader,
});

const SearchTemplatesPage = Loadable({
	loader: () => import('../../pages/SearchTemplatesPage'),
	loading: Loader,
});

const BillingPage = Loadable({
	loader: () => import('../../pages/BillingPage'),
	loading: Loader,
});

const CredentialsPage = Loadable({
	loader: () => import('../../pages/CredentialsPage'),
	loading: Loader,
});

const OverviewPage = Loadable({
	loader: () => import('../../pages/OverviewPage'),
	loading: Loader,
});

const ImporterPage = Loadable({
	loader: () => import('../../pages/ImporterPage'),
	loading: Loader,
});

const QueryRulesPage = Loadable({
	loader: () => import('../../pages/QueryRules'),
	loading: Loader,
});

const MappingsPage = Loadable({
	loader: () => import('../../pages/MappingsPage'),
	loading: Loader,
});

const BrowserPage = Loadable({
	loader: () => import('../../pages/BrowserPage'),
	loading: Loader,
});

const SandboxPage = Loadable({
	loader: () => import('../../pages/SandboxPage'),
	loading: Loader,
});

const PopularSearches = Loadable({
	loader: () => import('../../pages/PopularSearches'),
	loading: Loader,
});

const PopularResults = Loadable({
	loader: () => import('../../pages/PopularResults'),
	loading: Loader,
});

const PopularFilters = Loadable({
	loader: () => import('../../pages/PopularFilters'),
	loading: Loader,
});

const NoResultSearches = Loadable({
	loader: () => import('../../pages/NoResultSearches'),
	loading: Loader,
});
const ShareSettings = Loadable({
	loader: () => import('../../pages/ShareSettingsPage'),
	loading: Loader,
});

const RequestLogs = Loadable({
	loader: () => import('../../pages/RequestLogs'),
	loading: Loader,
});

const RoleBaseAccess = Loadable({
	loader: () => import('../../pages/RoleBaseAccess'),
	loading: Loader,
});

const QueryExplorerPage = Loadable({
	loader: () => import('../../pages/QueryExplorer'),
	loading: Loader,
});

class AppLayout extends React.PureComponent {
	render() {
		const { collapsed } = this.props;
		return (
			<Layout
				css={{
					paddingTop: 60,
					minHeight: '100vh',
					marginLeft: collapsed ? '80px' : '260px',
					position: 'relative',
				}}
			>
				<AppHeader big={collapsed} />
				<ErrorPage {...this.props}>
					<Switch>
						<Route
							exact
							path="/app/:appName"
							component={props => (
								<AppPageContainer
									{...props}
									component={OverviewPage}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/overview"
							component={props => (
								<AppPageContainer
									{...props}
									component={OverviewPage}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/analytics/:tab?/:subTab?"
							component={props => (
								<AppPageContainer
									{...props}
									component={AnalyticsPage}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/popular-searches"
							component={props => (
								<AppPageContainer
									{...props}
									component={PopularSearches}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/credentials"
							component={props => (
								<AppPageContainer
									{...props}
									component={CredentialsPage}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/popular-results"
							component={props => (
								<AppPageContainer
									{...props}
									component={PopularResults}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/geo-distribution"
							component={props => (
								<AppPageContainer
									{...props}
									component={GeoDistributionPage}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/search-latency"
							component={props => (
								<AppPageContainer
									{...props}
									component={SearchLatency}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/popular-filters"
							component={props => (
								<AppPageContainer
									{...props}
									component={PopularFilters}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/request-logs/:tab?"
							component={props => (
								<AppPageContainer
									{...props}
									component={RequestLogs}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/requests-per-minute"
							component={props => (
								<AppPageContainer
									{...props}
									component={RequestDistributionPage}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/no-results-searches"
							component={props => (
								<AppPageContainer
									{...props}
									component={NoResultSearches}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/import"
							render={props => (
								<AppPageContainer
									{...props}
									component={ImporterPage}
									shouldFetchAppInfo={false}
									shouldFetchAppPlan
								/>
							)}
						/>

						<Route
							exact
							path="/app/:appName/query-rules"
							render={props => (
								<AppPageContainer
									{...props}
									component={QueryRulesPage}
									shouldFetchAppInfo={false}
									shouldFetchAppPlan
								/>
							)}
						/>

						<Route
							exact
							path="/app/:appName/search-template"
							render={props => (
								<AppPageContainer
									{...props}
									component={SearchTemplatesPage}
									shouldFetchAppInfo={false}
									shouldFetchAppPlan
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/settings"
							render={props => (
								<AppPageContainer
									{...props}
									component={MappingsPage}
									shouldFetchAppInfo
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/share-settings"
							component={props => (
								<AppPageContainer
									{...props}
									component={ShareSettings}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/billing"
							component={props => (
								<AppPageContainer
									{...props}
									component={BillingPage}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/browse"
							render={props => (
								<AppPageContainer
									{...props}
									component={BrowserPage}
									shouldFetchAppInfo={false}
									shouldFetchAppPlan
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/query"
							render={props => (
								<AppPageContainer
									{...props}
									component={QueryExplorerPage}
									shouldFetchAppInfo={false}
									shouldFetchAppPlan
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/search-preview"
							render={props => (
								<AppPageContainer
									{...props}
									component={SandboxPage}
									shouldFetchAppInfo={false}
									shouldFetchAppPlan={false}
								/>
							)}
						/>
						<Route
							exact
							path="/app/:appName/role-based-access"
							component={props => (
								<AppPageContainer
									{...props}
									component={RoleBaseAccess}
								/>
							)}
						/>
					</Switch>
				</ErrorPage>
			</Layout>
		);
	}
}

export default AppLayout;
