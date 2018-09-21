import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import get from 'lodash/get';

import AppPageContainer from '../../components/AppPageContainer';
import AppHeader from '../../components/AppHeader';
import ShareSettings from '../ShareSettingsPage';
import Loader from '../../components/Loader';
import { setCurrentApp } from '../../batteries/modules/actions';
import UpgradeButton from '../../components/Button/UpgradeBtnSidebar';
import Logo from '../../components/Logo';

const { Sider } = Layout;
const { SubMenu } = Menu;

const AnalyticsPage = Loadable({
	loader: () => import('../AnalyticsPage'),
	loading: Loader,
});
const GeoDistributionPage = Loadable({
	loader: () => import('../GeoDistributionPage'),
	loading: Loader,
});
const SearchPerformance = Loadable({
	loader: () => import('../SearchPerformance'),
	loading: Loader,
});

const BillingPage = Loadable({
	loader: () => import('../BillingPage'),
	loading: Loader,
});

const CredentialsPage = Loadable({
	loader: () => import('../CredentialsPage'),
	loading: Loader,
});

const OverviewPage = Loadable({
	loader: () => import('../OverviewPage'),
	loading: Loader,
});

const ImporterPage = Loadable({
	loader: () => import('../ImporterPage'),
	loading: Loader,
});

const MappingsPage = Loadable({
	loader: () => import('../MappingsPage'),
	loading: Loader,
});

const BrowserPage = Loadable({
	loader: () => import('../BrowserPage'),
	loading: Loader,
});

const SandboxPage = Loadable({
	loader: () => import('../SandboxPage'),
	loading: Loader,
});

const PopularSearches = Loadable({
	loader: () => import('../PopularSearches'),
	loading: Loader,
});

const PopularResults = Loadable({
	loader: () => import('../PopularResults'),
	loading: Loader,
});

const PopularFilters = Loadable({
	loader: () => import('../PopularFilters'),
	loading: Loader,
});

const NoResultSearches = Loadable({
	loader: () => import('../NoResultSearches'),
	loading: Loader,
});

const RequestLogs = Loadable({
	loader: () => import('../RequestLogs'),
	loading: Loader,
});

const routes = {
	'App Overview': {
		icon: 'home',
		link: '',
	},
	Develop: {
		icon: 'dashboard',
		menu: [
			{ label: 'Import Data', link: 'import' },
			{ label: 'Manage Mappings', link: 'mappings' },
			{ label: 'Browse Data', link: 'browse' },
			{ label: 'Search Preview', link: 'search-preview' },
		],
	},
	Analytics: {
		icon: 'line-chart',
		menu: [
			{ label: 'Overview', link: 'analytics' },
			{ label: 'Popular Searches', link: 'popular-searches' },
			{ label: 'No Result Searches', link: 'no-results-searches' },
			{ label: 'Popular Results', link: 'popular-results' },
			{ label: 'Popular Filters', link: 'popular-filters' },
			{ label: 'Request Logs', link: 'request-logs' },
			{ label: 'Geo Distribution', link: 'geo-distribution' },
			{ label: 'Search Performance', link: 'search-performance' },
		],
	},
	Security: {
		icon: 'key',
		menu: [
			{ label: 'API Credentials', link: 'credentials' },
			{ label: 'Sharing Settings', link: 'share-settings' },
		],
	},
	Billing: {
		icon: 'credit-card',
		link: 'billing',
	},
};

class AppWrapper extends Component {
	state = {
		collapsed: false,
		appName: this.props.match.params.appName, // eslint-disable-line
	};

	static getDerivedStateFromProps(props, state) {
		const { appName } = props.match.params;
		const { currentApp } = props;

		if (appName && appName !== state.appName) {
			return { appName };
		}

		if (!appName && !state.appName && currentApp) {
			// gets last used appName from redux-persist
			return { appName: currentApp };
		}
		return null;
	}

	componentDidMount() {
		const { appName } = this.state;
		const { history, match } = this.props;

		if (!match.params.appName && appName) {
			history.push(`/app/${appName}/`);
		}
	}

	componentDidUpdate() {
		const { history, currentApp, match } = this.props;
		const { appName } = this.state;

		const route = match.params.route || '';

		if (currentApp && appName !== currentApp) {
			history.push(`/app/${currentApp}/${route}`);
		}
	}

	onCollapse = (collapsed) => {
		this.setState({ collapsed });
	};

	getActiveMenu = () => {
		let activeSubMenu = 'App Overview';
		let activeMenuItem = 'App Overview';
		const { route: pathname } = this.props.match.params; // eslint-disable-line

		Object.keys(routes).some((route) => {
			if (routes[route].menu) {
				const active = routes[route].menu.find(item => pathname === item.link);

				if (active) {
					activeSubMenu = route;
					activeMenuItem = active.label;
					return true;
				}
			} else if (pathname === routes[route].link) {
				activeSubMenu = route;
				activeMenuItem = route;
				return true;
			}
			return false;
		});

		return {
			activeSubMenu,
			activeMenuItem,
		};
	};

	render() {
		const { activeSubMenu, activeMenuItem } = this.getActiveMenu();
		const { collapsed, appName } = this.state;

		return (
			<Layout>
				<Sider width={260} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
					<Menu
						theme="dark"
						defaultOpenKeys={[activeSubMenu]}
						defaultSelectedKeys={[activeMenuItem]}
						mode="inline"
					>
						<Menu.Item style={{ margin: '15px auto' }}>
							<Link to="/">
								{collapsed ? (
									<Logo type="small" width={20} />
								) : (
									<Logo type="white" width={160} />
								)}
							</Link>
						</Menu.Item>
						{Object.keys(routes).map((route) => {
							if (routes[route].menu) {
								const Title = (
									<span>
										<Icon type={routes[route].icon} />
										<span>{route}</span>
									</span>
								);
								return (
									<SubMenu key={route} title={Title}>
										{routes[route].menu.map(item => (
											<Menu.Item key={item.label}>
												<Link replace to={`/app/${appName}/${item.link}`}>
													{item.label}
												</Link>
											</Menu.Item>
										))}
									</SubMenu>
								);
							}
							return (
								<Menu.Item key={route}>
									<Link replace to={`/app/${appName}/${routes[route].link}`}>
										<Icon type={routes[route].icon} />
										<span>{route}</span>
									</Link>
								</Menu.Item>
							);
						})}
						{!collapsed && <UpgradeButton link={`/app/${appName}/billing`} />}
					</Menu>
				</Sider>
				<Layout css={{ paddingTop: 60, minHeight: '100vh' }}>
					<AppHeader big={collapsed} />
					<section>
						<Switch>
							<Route
								exact
								path="/app/:appName"
								component={props => (
									<AppPageContainer {...props} component={OverviewPage} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/overview"
								component={props => (
									<AppPageContainer {...props} component={OverviewPage} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/analytics/:tab?/:subTab?"
								component={props => (
									<AppPageContainer {...props} component={AnalyticsPage} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/popular-searches"
								component={props => (
									<AppPageContainer {...props} component={PopularSearches} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/credentials"
								component={props => (
									<AppPageContainer {...props} component={CredentialsPage} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/popular-results"
								component={props => (
									<AppPageContainer {...props} component={PopularResults} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/geo-distribution"
								component={props => (
									<AppPageContainer {...props} component={GeoDistributionPage} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/search-performance"
								component={props => (
									<AppPageContainer {...props} component={SearchPerformance} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/popular-filters"
								component={props => (
									<AppPageContainer {...props} component={PopularFilters} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/request-logs/:tab?"
								component={props => (
									<AppPageContainer {...props} component={RequestLogs} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/no-results-searches"
								component={props => (
									<AppPageContainer {...props} component={NoResultSearches} />
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
										shouldFetchAppPlan={false}
									/>
								)}
							/>
							<Route
								exact
								path="/app/:appName/mappings"
								render={props => (
									<AppPageContainer
										{...props}
										component={MappingsPage}
										shouldFetchAppInfo={false}
									/>
								)}
							/>
							<Route
								exact
								path="/app/:appName/share-settings"
								component={props => (
									<AppPageContainer {...props} component={ShareSettings} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/billing"
								component={props => (
									<AppPageContainer {...props} component={BillingPage} />
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
										shouldFetchAppPlan={false}
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
						</Switch>
					</section>
				</Layout>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
	currentApp: get(state, '$getCurrentApp.name'),
});

const mapDispatchToProps = dispatch => ({
	updateCurrentApp: (appName, appId) => dispatch(setCurrentApp(appName, appId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AppWrapper);
