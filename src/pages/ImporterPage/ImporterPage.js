import React, { Fragment } from 'react';
import {
 Row, Col, Button, Icon,
} from 'antd';

import Header from '../../components/Header';

const ImporterPage = () => (
	<Fragment>
		<Header compact>
			<Row type="flex" justify="space-between" gutter={16}>
				<Col md={18}>
					<h2>Import Data</h2>

					<Row>
						<Col span={18}>
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
									rel="noopener noreferer"
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
					<Button size="large" type="primary">
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
				src="https://importer.appbase.io?header=false"
				frameBorder="0"
				width="100%"
				height={`${window.innerHeight - 243 || 600}px`}
			/>
		</section>
	</Fragment>
);

export default ImporterPage;
