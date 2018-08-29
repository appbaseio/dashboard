import React, { Component } from 'react';
import {
 Link, Switch, Route, Redirect,
} from 'react-router-dom';
import Loadable from 'react-loadable';
import { Layout, Menu, Icon } from 'antd';

import AppHeader from '../../components/AppHeader';
import Loader from '../../components/Loader';
import Logo from '../../components/Logo';

const { Sider } = Layout;
const { SubMenu } = Menu;

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

const routes = {
	'App Overview': {
		icon: 'home',
		link: '/app/overview',
	},
	Develop: {
		icon: 'dashboard',
		menu: [
			{ label: 'Import Data', link: '/app/import' },
			{ label: 'Manage Mappings', link: '/app/mappings' },
			{ label: 'Browse Data', link: '/app/browse' },
			{ label: 'Search Sandbox', link: '/app/sandbox' },
		],
	},
};

export default class AppWrapper extends Component {
	state = {
		collapsed: false,
		appname: this.props.match.params.appname, // eslint-disable-line
	};

	static getDerivedStateFromProps(props, state) {
		console.log('called getDerivedStateFromProps');
		const { appname } = props.match.params;
		if (appname && appname !== state.appname) {
			return { appname };
		}

		if (!appname && !state.appname) {
			// get last known appname from localstorage
			return { appname: 'marketplacev6' };
		}
		return null;
	}

	componentDidMount() {
		console.log('mounted');
	}

	componentDidUpdate(prevProps, prevState) {
		console.log('updated called');
		if (prevState.appname !== this.state.appname) {
		}
	}

	onCollapse = (collapsed) => {
		this.setState({ collapsed });
	};

	getActiveMenu = () => {
		let activeSubMenu = 'App Overview';
		let activeMenuItem = 'App Overview';
		const { route: activeRoute } = this.props.match.params; // eslint-disable-line
		const pathname = `/app/${activeRoute}`;

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
		const { collapsed, appname } = this.state;

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
												<Link to={`${item.link}/${appname}`}>
													{item.label}
												</Link>
											</Menu.Item>
										))}
									</SubMenu>
								);
							}
							return (
								<Menu.Item key={route}>
									<Link to={`${routes[route].link}/${appname}`}>
										<Icon type={routes[route].icon} />
										<span>{route}</span>
									</Link>
								</Menu.Item>
							);
						})}
					</Menu>
				</Sider>
				<Layout>
					<AppHeader />
					<section style={{ minHeight: '100vh' }}>
						<Switch>
							<Route exact path="/app/overview/:appname?" component={OverviewPage} />
							<Route exact path="/app/import/:appname?" component={ImporterPage} />
							<Route exact path="/app/mappings/:appname?" component={MappingsPage} />
							<Route exact path="/app/browse/:appname?" component={BrowserPage} />
							<Route exact path="/app/sandbox/:appname?" component={SandboxPage} />
							<Redirect from="/app" to="/app/overview/" />
						</Switch>
					</section>
				</Layout>
			</Layout>
		);
	}
}
