import React, { Fragment } from 'react';
import {
 Row, Col, Button, Icon,
} from 'antd';

import Header from '../../components/Header';
import { IMPORTER_LINK } from '../../constants/config';

function getLink() {
	const parameters = {
		platform: 'appbase',
	};
	return `${IMPORTER_LINK}${JSON.stringify(parameters)}`;
}

const ImporterPage = () => (
	<Fragment>
		<Header compact>
			<Row type="flex" justify="space-between" gutter={16}>
				<Col lg={18}>
					<h2>Import Data</h2>

					<Row>
						<Col lg={18}>
							<p>
								Bring your data from JSON or CSV files into appbase.io via the
								Import GUI.
								<br />
								<br />
								Or use our CLI tool for importing data from data sources like
								MongoDB, Postgres, MySQL -{' '}
								<a
									href="https://medium.appbase.io/abc-import-import-your-mongodb-sql-json-csv-data-into-elasticsearch-a202cafafc0d"
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
					lg={6}
					css={{
						display: 'flex',
						flexDirection: 'column-reverse',
						paddingBottom: 20,
					}}
				>
					<Button
						size="large"
						type="primary"
						href="https://appbase.io/contact/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon type="form" />
						Contact Us
					</Button>
					<p
						css={{
							marginTop: 20,
							fontSize: 13,
							textAlign: 'center',
							lineHeight: '20px',
						}}
					>
						Need help with your dataset?
						<br />
						We now offer paid support.
					</p>
				</Col>
			</Row>
		</Header>
		<section>
			<iframe
				title="Importer"
				src={getLink()}
				frameBorder="0"
				width="100%"
				height={`${window.innerHeight - 243 || 600}px`}
			/>
		</section>
	</Fragment>
);

export default ImporterPage;
