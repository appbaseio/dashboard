import React from 'react';
import {
 Row, Col, Button, Icon,
} from 'antd';
import Header from '../Header';

const BannerHeader = ({ title, description }) => (
	<Header compact>
		<Row type="flex" justify="space-between" gutter={16}>
			<Col md={18}>
				{title && <h2>{title}</h2>}

				<Row>
					<Col span={18}>{description && <p>{description}</p>}</Col>
				</Row>
			</Col>
			{/* <Col
				md={6}
				css={{
					display: 'flex',
					flexDirection: 'column-reverse',
					paddingBottom: 20,
				}}
			>
				<Button size="large" type="primary">
					<Icon type="customer-service" />
					Talk to Support
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
			</Col> */}
		</Row>
	</Header>
);

export default BannerHeader;
