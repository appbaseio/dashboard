import React from 'react';
import { Row, Col, Button } from 'antd';
import { css } from 'react-emotion';
import DemoCards from '../../components/DemoCard';
import Container from '../../components/Container';
import { exampleConfig } from '../../constants/config';

import Header from '../../components/Header';

const image = css`
	max-height: 52px;
`;

const appLink = css`
	color: #1a74ff;
	border: none;
	padding: 0px;
`;

const FreeUserOverview = () => (
	<Container>
		<Header compact>
			<Row type="flex" justify="space-between" gutter={16}>
				<Col md={18}>
					<h2>Welcome to your app dashboard</h2>
					<Row>
						<Col span={18}>
							<p>
								Our analytics feature can do much more! Discover what you could do
								by enabling our metrics on Clicks and Conversions, Filters, Results.
							</p>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row type="flex" gutter={16}>
				<Col>
					<img alt="Web Apps" css={image} src="../../../static/images/WebApp@2x.png" />
					<div>
						<Button css={appLink}>WEB APP</Button>
					</div>
				</Col>
				<Col css="margin-left: 50px">
					<img
						alt="Mobile Apps"
						css={image}
						src="../../../static/images/ReactiveNative@2x.png"
					/>
					<div>
						<Button css={appLink}>Mobile APP</Button>
					</div>
				</Col>
				<Col css="margin-left: 50px">
					<img
						alt="Maps Apps"
						css={image}
						src="../../../static/images/ReactiveMaps@2x.png"
					/>
					<div>
						<Button css={appLink}>MAPS APP</Button>
					</div>
				</Col>
			</Row>
		</Header>
		<DemoCards cardConfig={exampleConfig} />
	</Container>
);
export default FreeUserOverview;
