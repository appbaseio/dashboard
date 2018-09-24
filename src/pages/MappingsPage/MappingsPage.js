import React, { Fragment } from 'react';
import {
 Row, Col, Button, Icon,
} from 'antd';
import { string } from 'prop-types';

import Header from '../../components/Header';
import Mappings from '../../batteries/components/Mappings';

const MappingsPage = ({ appName, appId }) => (
	<Fragment>
		<Header compact>
			<Row type="flex" justify="space-between" gutter={16}>
				<Col md={18}>
					<h2>Manage Mappings</h2>

					<Row>
						<Col span={18}>
							<p>
								View mappings, edit use-case and data types, add or delete fields -{' '}
								<a
									href="https://docs.appbase.io/concepts/mappings.html"
									target="_blank"
									rel="noopener noreferrer"
								>
									learn more
								</a>
								.
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
					<Button
						size="large"
						type="primary"
						href="https://appbase.io/pricing#features"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon type="info-circle" />
						Requires A Paid Plan
					</Button>
				</Col>
			</Row>
		</Header>
		<section>
			<Mappings key={appName} appName={appName} appId={appId} />
		</section>
	</Fragment>
);

MappingsPage.propTypes = {
	appName: string.isRequired,
	appId: string.isRequired,
};

export default MappingsPage;
