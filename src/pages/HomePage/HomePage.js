import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import {
 Row, Col, Icon, Button, Tooltip, Dropdown, Menu,
} from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';
import Container from '../../components/Container';
import CreateAppModal from './CreateAppModal';
import AppCard from '../../components/AppCard';

import { getAppsOwners as getOwners } from '../../actions';

const link = css`
	font-size: 16px;
	margin-right: 30px;

	i {
		margin-right: 4px;
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
		const { appsOwners, getAppsOwners } = this.props;
		if (!appsOwners.isFetching && !getAppsOwners.data) {
			getAppsOwners();
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
			history,
			appsOwners,
		} = this.props;

		const owners = appsOwners.data || {};
		const sortedApps = this.getSortedApps();

		return (
			<Fragment>
				<FullHeader />
				<Header>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col md={18}>
							<h2>Howdy, bud. Welcome to your dashboard!</h2>

							<Row>
								<Col span={18}>
									<p>
										Our analytics feature can do much more! Discover what you
										could do by enabling our metrics on Clicks and Conversions,
										Filters, Results.
									</p>
								</Col>
							</Row>

							<Link to="/tutorial" className={link}>
								<Icon type="book" /> Interactive Tutorial
							</Link>
							<Link to="/" className={link}>
								<Icon type="rocket" /> JS Quickstart
							</Link>
							<Link to="/" className={link}>
								<Icon type="code-o" /> REST Quickstart
							</Link>
						</Col>
						<Col
							md={6}
							css={{
								display: 'flex',
								flexDirection: 'column-reverse',
								paddingBottom: 20,
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
								<Col key={name} span={8}>
									<Link
										to={`/app/${name}/overview`}
										css={{ marginBottom: 20, display: 'block' }}
									>
										<AppCard
											key={name}
											title={title}
											data={data}
											appName={name}
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
	apps: PropTypes.object.isRequired,
	appsMetrics: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	appsOwners: PropTypes.object.isRequired,
	getAppsOwners: PropTypes.func.isRequired,
};

const mapStateToProps = ({
 user, apps, appsMetrics, appsOwners,
}) => ({
	user: user.data.email,
	apps,
	appsMetrics,
	appsOwners,
});

const mapDispatchToProps = dispatch => ({
	getAppsOwners: () => dispatch(getOwners()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(HomePage);
