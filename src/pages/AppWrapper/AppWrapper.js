import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';
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
			{ label: 'Search Sandbox', link: 'sandbox' },
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
		],
	},
	Security: {
		icon: 'key',
		menu: [
			{ label: 'API Credentials', link: 'credentials' },
			{ label: 'Sharing Settings', link: 'share-settings' },
		],
	},
};

class AppWrapper extends Component {
	state = {
		collapsed: false,
		appName: this.props.match.params.appName, // eslint-disable-line
	};

	static getDerivedStateFromProps(props, state) {
		console.log('called getDerivedStateFromProps');
		const { appName } = props.match.params;
		if (appName && appName !== state.appName) {
			return { appName };
		}

		if (!appName && !state.appName) {
			// get last known appName from localstorage
			return { appName: 'marketplacev6' };
		}
		return null;
	}

	componentDidMount() {
		console.log('mounted');
		// const { apps, updateCurrentApp, match } = this.props;
		// const { appname } = match.params;
		// updateCurrentApp(appname, apps[appname]);
	}

	componentDidUpdate(prevProps, prevState) {
		console.log('updated called');
		if (prevState.appName !== this.state.appName) {
		}
	}

	onCollapse = (collapsed) => {
		this.setState({ collapsed });
	};

	getActiveMenu = () => {
		let activeSubMenu = 'App Overview';
		let activeMenuItem = 'App Overview';
		const { route: pathname, appName } = this.props.match.params; // eslint-disable-line

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

		const appId = this.props.apps[appName];

		return (
			<Layout>
				<Sider width={260} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
					<Menu
						theme="dark"
						defaultOpenKeys={[activeSubMenu]}
						defaultSelectedKeys={[activeMenuItem]}
						mode="inline"
					>
						<Logo />
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
												<Link replace to={item.link}>
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
						<UpgradeButton link={`/app/${appName}/billing`} />
					</Menu>
				</Sider>
				<Layout>
					<AppHeader />
					<section style={{ minHeight: '100vh' }}>
						<Switch>
							<Route
								exact
								path="/app/:appname"
								component={props => (
									<AppPageContainer {...props} component={OverviewPage} />
								)}
							/>
							<Route exact path="/app/:appname/overview" component={OverviewPage} />
							<Route
								exact
								path="/app/:appName/analytics/:tab?/:subTab?"
								component={AnalyticsPage}
							/>
							<Route
								exact
								path="/app/:appName/popular-searches"
								component={PopularSearches}
							/>
							<Route
								exact
								path="/app/:appname/credentials"
								component={props => (
									<AppPageContainer {...props} component={CredentialsPage} />
								)}
							/>
							<Route
								exact
								path="/app/:appName/popular-results"
								component={PopularResults}
							/>
							<Route
								exact
								path="/app/:appName/popular-filters"
								component={PopularFilters}
							/>
							<Route
								exact
								path="/app/:appName/request-logs/:tab?"
								component={RequestLogs}
							/>
							<Route
								exact
								path="/app/:appName/no-results-searches"
								component={NoResultSearches}
							/>
							<Route exact path="/app/:appName/import" component={ImporterPage} />
							<Route
								exact
								path="/app/:appName/mappings"
								render={() => <MappingsPage appName={appName} appId={appId} />}
							/>
							<Route
								exact
								path="/app/:appname/share-settings"
								component={props => (
									<AppPageContainer {...props} component={ShareSettings} />
								)}
							/>
							<Route
								exact
								path="/app/:appname/billing"
								component={props => (
									<AppPageContainer {...props} component={BillingPage} />
								)}
							/>
							<Route exact path="/app/:appname/browse" component={BrowserPage} />
							<Route exact path="/app/:appname/sandbox" component={SandboxPage} />
						</Switch>
					</section>
				</Layout>
			</Layout>
		);
	}
}

const mapStateToProps = ({ apps }) => ({
	apps,
});

const mapDispatchToProps = dispatch => ({
	updateCurrentApp: (appName, appId) => dispatch(setCurrentApp(appName, appId)),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AppWrapper);
