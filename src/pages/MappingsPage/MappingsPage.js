import React, { Fragment } from 'react';
import {
 Row, Col, Button, Icon,
} from 'antd';
import { string } from 'prop-types';

import Header from '../../components/Header';
import Mappings from '../../batteries/components/Mappings';

const MappingsPage = ({ appname, appId }) => (
	<Fragment>
		<Header compact>
			<Row type="flex" justify="space-between" gutter={16}>
				<Col md={18}>
					<h2>Manage Mappings</h2>

					<Row>
						<Col span={18}>
							<p>
								Our analytics feature can do much more! Discover what you could do
								by enabling our metrics on Clicks and Conversions, Filters, Results.
							</p>
						</Col>
					</Row>
				</Col>
				<Col
					md={6}
					css={{
						display: 'flex',
						flexDirection: 'column-reverse',
						paddingBottom: 20,
					}}
				>
					<Button size="large" type="primary">
						<Icon type="to-top" />
						Upgrade your Plan
					</Button>
				</Col>
			</Row>
		</Header>
		<section>
			<Mappings appName={appname} appId={appId} />
		</section>
	</Fragment>
);

MappingsPage.propTypes = {
	appname: string.isRequired,
	appId: string.isRequired,
};

export default MappingsPage;
