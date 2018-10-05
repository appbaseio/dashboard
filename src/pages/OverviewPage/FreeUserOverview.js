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
	box-shadow: none;
`;

const FreeUserOverview = () => (
	<React.Fragment>
		<Header compact>
			<Row type="flex" justify="space-between" gutter={16}>
				<Col md={18}>
					<h2>Welcome to your app's dashboard view</h2>
					<Row>
						<Col span={18}>
							<p>
								You can refer to one of our quick start guides for building a web
								app, a mobile app or a maps based app.
							</p>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row type="flex" gutter={16}>
				<Col>
					<img alt="Web Apps" css={image} src="../../../static/images/WebApp@2x.png" />
					<div>
						<Button
							css={appLink}
							href="https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html"
							target="_blank"
							rel="noreferrer noopener"
						>
							Web App
						</Button>
					</div>
				</Col>
				<Col css="margin-left: 50px">
					<img
						alt="Mobile Apps"
						css={image}
						src="../../../static/images/ReactiveNative@2x.png"
					/>
					<div>
						<Button
							css={appLink}
							href="https://opensource.appbase.io/reactive-manual/native/getting-started/reactivesearch.html"
							target="_blank"
							rel="noreferrer noopener"
						>
							Mobile App
						</Button>
					</div>
				</Col>
				<Col css="margin-left: 50px">
					<img
						alt="Maps Apps"
						css={image}
						src="../../../static/images/ReactiveMaps@2x.png"
					/>
					<div>
						<Button
							css={appLink}
							href="https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html"
							target="_blank"
							rel="noreferrer noopener"
						>
							Maps App
						</Button>
					</div>
				</Col>
			</Row>
		</Header>
		<Container>
			<DemoCards cardConfig={exampleConfig} />
		</Container>
	</React.Fragment>
);
export default FreeUserOverview;
