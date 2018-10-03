import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import {
 Row, Col, Icon, Button, Tooltip, Dropdown, Menu,
} from 'antd';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';
import Container from '../../components/Container';
import CreateAppModal from './CreateAppModal';
import AppCard from '../../components/AppCard';

import { getAppsOwners as getOwners } from '../../actions';
import { getUserPermissions } from '../../batteries/modules/actions';
import { mediaKey } from '../../utils/media';

const link = css`
	font-size: 16px;
	margin-right: 30px;

	i {
		margin-right: 4px;
	}

	${mediaKey.small} {
		display: block;
		line-height: 48px;
	}
`;

class HomePage extends Component {
	constructor() {
		super();
		this.sortOptions = [{ label: 'Name', key: 'name' }, { label: 'Most Recent', key: 'time' }];
		this.state = {
			showModal: false, // modal for create new app
			sortBy: 'name',
		};
	}

	componentDidMount() {
		const {
			// prettier-ignore
			appsOwners,
			getAppsOwners,
			permissions,
			fetchPermissions,
			apps,
			history,
		} = this.props;

		const hasVisitedTutorial = JSON.parse(localStorage.getItem('hasVisitedTutorial'));

		if (!hasVisitedTutorial && !Object.keys(apps).length) {
			history.push('/tutorial');
		}

		if (!appsOwners.isFetching && !getAppsOwners.data) {
			getAppsOwners();
		}
		if (!permissions) {
			fetchPermissions();
		}
	}

	handleSortOption = (e) => {
		const { key } = e;
		this.setState({
			sortBy: key,
		});
	};

	renderSortOptions = () => {
		const { sortBy } = this.state;
		const selectedOption = this.sortOptions.find(option => option.key === sortBy);
		const menu = (
			<Menu onClick={this.handleSortOption}>
				{this.sortOptions.map(option => (
					<Menu.Item key={option.key}>{option.label}</Menu.Item>
				))}
			</Menu>
		);
		return (
			<Dropdown overlay={menu} trigger={['click']}>
				<Button>
					Sort by {selectedOption.label} <Icon type="down" />
				</Button>
			</Dropdown>
		);
	};

	getSortedApps = () => {
		const {
			apps,
			appsMetrics: { data },
		} = this.props;
		const { sortBy } = this.state;

		switch (sortBy) {
			case 'time':
				return Object.keys(data).reverse();
			default:
				return Object.keys(apps);
		}
	};

	handleChange = () => {
		this.setState(state => ({
			showModal: !state.showModal,
		}));
	};

	render() {
		const { showModal } = this.state;
		const {
			user,
			appsMetrics: { data },
			apps,
			username,
			history,
			appsOwners,
			permissions,
		} = this.props;

		const owners = appsOwners.data || {};
		const sortedApps = this.getSortedApps();
		return (
			<Fragment>
				<FullHeader />
				<Header>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col lg={18}>
							<h2>Howdy, {username}. Welcome to your dashboard!</h2>

							<Row>
								<Col lg={18}>
									<p>
										This is your apps manager view. Here, you can create a new
										app and manage your existing apps.
									</p>
								</Col>
							</Row>

							<Link to="/tutorial" className={link}>
								<Icon type="book" /> Interactive Tutorial
							</Link>
							<a
								href="https://docs.appbase.io/javascript/quickstart.html"
								className={link}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon type="rocket" /> JS Quickstart
							</a>
							<a
								href="https://docs.appbase.io/rest-quickstart.html"
								className={link}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon type="code-o" /> REST Quickstart
							</a>
						</Col>
						<Col
							lg={6}
							css={{
								display: 'flex',
								flexDirection: 'column-reverse',
								paddingBottom: 20,

								[mediaKey.small]: {
									paddingTop: 20,
								},
							}}
						>
							<Button size="large" type="primary" block onClick={this.handleChange}>
								<Icon type="plus" /> Create a new app
							</Button>
						</Col>
					</Row>
				</Header>

				<Container>
					<Row gutter={20}>
						{sortedApps.length ? (
							<Row
								type="flex"
								justify="space-between"
								gutter={16}
								style={{
									height: 60,
									alignItems: 'center',
									padding: '0px 18px',
								}}
							>
								<h2
									style={{
										paddingLeft: 0,
										lineHeight: '21px',
										margin: 0,
									}}
								>
									All Apps
								</h2>
								{this.renderSortOptions()}
							</Row>
						) : (
							<section
								css={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									paddingTop: '80px',
								}}
							>
								<Icon
									type="exclamation-circle"
									theme="outlined"
									style={{ fontSize: 34, marginBottom: 10 }}
								/>
								<h2>No apps found</h2>
								<p>Create an app to get started</p>
							</section>
						)}

						{sortedApps.map((name) => {
							const title = (
								<div
									css={{
										display: 'flex',
										justifyContent: 'space-between',
										height: 32,
										alignItems: 'center',
									}}
								>
									{name}{' '}
									{owners[name] && user !== owners[name] ? (
										<Tooltip title={`Shared by ${owners[name]}`}>
											<Button shape="circle" icon="share-alt" />
										</Tooltip>
									) : null}
								</div>
							);

							return (
								<Col key={name} lg={8} md={12} sm={24}>
									<Link
										to={`/app/${name}/overview`}
										css={{ marginBottom: 20, display: 'block' }}
									>
										<AppCard
											key={name}
											title={title}
											data={data}
											appName={name}
											appId={apps[name]}
											permissions={permissions ? permissions[name] : null}
											shared={owners[name] && user !== owners[name]}
										/>
									</Link>
								</Col>
							);
						})}
					</Row>
				</Container>
				<CreateAppModal
					history={history}
					handleModal={this.handleChange}
					showModal={showModal}
				/>
			</Fragment>
		);
	}
}

HomePage.propTypes = {
	user: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
	apps: PropTypes.object.isRequired,
	appsMetrics: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	appsOwners: PropTypes.object.isRequired,
	getAppsOwners: PropTypes.func.isRequired,
	permissions: PropTypes.object, // eslint-disable-line
	fetchPermissions: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	user: get(state, 'user.data.email'),
	username: get(state, 'user.data.name'),
	apps: get(state, 'apps'),
	appsMetrics: get(state, 'appsMetrics'),
	appsOwners: get(state, 'appsOwners'),
	permissions: get(state, '$getAppPermissions.results'),
});

const mapDispatchToProps = dispatch => ({
	getAppsOwners: () => dispatch(getOwners()),
	fetchPermissions: () => dispatch(getUserPermissions()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(HomePage);
