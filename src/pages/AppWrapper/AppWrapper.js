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

export default class AppWrapper extends Component {
	state = {
		collapsed: false,
	};

	onCollapse = collapsed => {
		this.setState({ collapsed });
	};

	render() {
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
						defaultOpenKeys={['sub1']}
						defaultSelectedKeys={['1']}
						mode="inline"
					>
						<Logo style={{ fill: 'yellow' }} />
						<SubMenu
							key="sub1"
							title={
								<span>
									<Icon type="dashboard" />
									<span>Develop</span>
								</span>
							}
						>
							<Menu.Item key="1">
								<Link to="/app/mappings">Mappings</Link>
							</Menu.Item>
							<Menu.Item key="2">
								<Link to="/app/sandbox">Search Sandbox</Link>
							</Menu.Item>
						</SubMenu>
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
