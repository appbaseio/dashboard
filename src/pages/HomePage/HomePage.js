import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import {
 Row, Col, Icon, Button, Card, Skeleton, Tooltip,
} from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';
import Container from '../../components/Container';
import CreateAppModal from './CreateAppModal';
import UsageRenderer from './UsageRenderer';

import { getAppsOwners as getOwners } from '../../actions';

const link = css`
	font-size: 16px;
	margin-right: 30px;

	i {
		margin-right: 4px;
	}
`;

class HomePage extends Component {
	state = {
		showModal: false,
	};

	componentDidMount() {
		const { appsOwners, getAppsOwners } = this.props;
		if (!appsOwners.isFetching && !getAppsOwners.data) {
			getAppsOwners();
		}
	}

	handleChange = () => {
		this.setState(state => ({
			showModal: !state.showModal,
		}));
	};

	render() {
		const { showModal } = this.state;
		const {
			user,
			apps,
			appsMetrics: { data },
			history,
			appsOwners,
		} = this.props;

		const owners = appsOwners.data || {};

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
								rel="noopener noreferer"
							>
								<Icon type="rocket" /> JS Quickstart
							</a>
							<a
								href="https://docs.appbase.io/rest-quickstart.html"
								className={link}
								target="_blank"
								rel="noopener noreferer"
							>
								<Icon type="code-o" /> REST Quickstart
							</a>
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
						{Object.keys(apps).map((name) => {
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
										<Card title={title} style={{ height: 174 }}>
											{/* Free Plan is taken as default */}
											<Skeleton
												title={false}
												paragraph={{ rows: 2 }}
												loading={!(data && data[apps[name]])}
											>
												{data && data[apps[name]] ? (
													<UsageRenderer
														plan="free"
														computedMetrics={{
															calls: data[apps[name]].api_calls,
															records: data[apps[name]].records,
														}}
													/>
												) : null}
											</Skeleton>
										</Card>
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
