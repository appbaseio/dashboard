import React, { Component, Fragment } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import Loader from '../../components/Loader';
import Logo from '../../components/Logo';

const { Header, Sider } = Layout;
const SubMenu = Menu.SubMenu;

const DashboardPage = Loadable({
	loader: () => import('../DashboardPage'),
	loading: Loader,
});

const MappingsPage = Loadable({
	loader: () => import('../MappingsPage'),
	loading: Loader,
});

const SandboxPage = Loadable({
	loader: () => import('../SandboxPage'),
	loading: Loader,
});

const routes = {
	Develop: {
		icon: 'dashboard',
		menu: [
			{ label: 'Mappings', link: '/app/mappings' },
			{ label: 'Search Sandbox', link: '/app/sandbox' },
		],
	},
};

export default class AppWrapper extends Component {
	state = {
		collapsed: false,
	};

	onCollapse = collapsed => {
		this.setState({ collapsed });
	};

	getActiveMenu = () => {
		let activeSubMenu = null;
		let activeMenuItem = null;
		const { pathname } = this.props.location;

		Object.keys(routes).some(route => {
			if (routes[route].menu) {
				const active = routes[route].menu.find(item => pathname.startsWith(item.link));

				if (active) {
					activeSubMenu = route;
					activeMenuItem = active.label;
					return true;
				}
			}
		});

		return {
			activeSubMenu,
			activeMenuItem,
		};
	};

	render() {
		const { activeSubMenu, activeMenuItem } = this.getActiveMenu();

		return (
			<Layout>
				<Sider
					width={260}
					collapsible
					collapsed={this.state.collapsed}
					onCollapse={this.onCollapse}
				>
					<Menu
						theme="dark"
						defaultOpenKeys={[activeSubMenu]}
						defaultSelectedKeys={[activeMenuItem]}
						mode="inline"
					>
						<Logo />
						{Object.keys(routes).map(route => {
							if (routes[route].menu) {
								return (
									<SubMenu
										key={route}
										title={
											<span>
												<Icon type={routes[route].icon} />
												<span>{route}</span>
											</span>
										}
									>
										{routes[route].menu.map(item => (
											<Menu.Item key={item.label}>
												<Link to={item.link}>{item.label}</Link>
											</Menu.Item>
										))}
									</SubMenu>
								);
							} else {
								return (
									<Menu.Item key={route}>
										<Icon type={routes[route].icon} />
										{route}
									</Menu.Item>
								);
							}
						})}
					</Menu>
				</Sider>
				<Layout>
					<Header style={{ background: '#fff', padding: 0 }} />
					<section style={{ minHeight: '100vh' }}>
						<Switch>
							<Route exact path="/app/mappings" component={MappingsPage} />
							<Route exact path="/app/sandbox" component={SandboxPage} />
							<Route exact path="/app/" component={DashboardPage} />
						</Switch>
					</section>
				</Layout>
			</Layout>
		);
	}
}
