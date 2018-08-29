import React, { Component } from 'react';
import { Row, Col } from 'antd';

import Header from '../../components/Header';

export default class OverviewPage extends Component {
	render() {
		return (
			<Header compact>
				<Row type="flex" justify="space-between" gutter={16}>
					<Col md={18}>
						<h2>Welcome to your app dashboard</h2>

						<Row>
							<Col span={18}>
								<p>
									Our analytics feature can do much more! Discover what you could
									do by enabling our metrics on Clicks and Conversions, Filters,
									Results.
								</p>
							</Col>
						</Row>
					</Col>
				</Row>
			</Header>
		);
	}
}
