import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import {
 Row, Col, Icon, Button, Card, Skeleton,
} from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';
import Container from '../../components/Container';

import UsageRenderer from './UsageRenderer';

const link = css`
	font-size: 16px;
	margin-right: 30px;

	i {
		margin-right: 4px;
	}
`;

class HomePage extends Component {
	state = {
		showModal: false, // modal for create new app
	};

	render() {
		const {
			apps,
			appsMetrics: { data },
		} = this.props;

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
							<Button size="large" type="primary" block>
								<Icon type="plus" /> Create a new app
							</Button>
						</Col>
					</Row>
				</Header>

				<Container>
					<Row gutter={20}>
						{Object.keys(apps).map(name => (
							<Col key={name} span={8}>
								<Link
									to={`/app/${name}/overview`}
									css={{ marginBottom: 20, display: 'block' }}
								>
									<Card title={name} style={{ height: 166 }}>
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
						))}
					</Row>
				</Container>
			</Fragment>
		);
	}
}

HomePage.propTypes = {
	apps: PropTypes.object.isRequired,
	appsMetrics: PropTypes.object.isRequired,
};

const mapStateToProps = ({ apps, appsMetrics }) => ({
	apps,
	appsMetrics,
});

export default connect(
	mapStateToProps,
	null,
)(HomePage);
