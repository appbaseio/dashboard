import React from 'react';
import { css } from 'react-emotion';
import { Modal, Button, Icon, Row, Col, Card, Divider } from 'antd';

const cancelButton = css`
	display: inline;
	width: 200px;
`;

const modalTitle = css`
	letter-spacing: 1.3px;
	font-size: 1em;
	font-weight: 600;
	color: #0000006e;
	margin: 15px 15px 10px 20px;
	text-align: center;
	vertical-align: middle;
`;

const cardWrapper = css`
	height: 180px;
	width: 300px;
	margin: 20px;
	position: relative;
`;

const cardHeading = css`
	letter-spacing: 1px;
	font-size: 1em;
	font-weight: 500;
	text-align: center;
	vertical-align: middle;
	height: 40px;
`;

const cardActions = css`
	position: absolute;
	bottom: 20%;
	left: 5%;
`;

class Directives extends React.Component {
	state = {
		visible: false,
	};

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};

	openDocs = name => {
		let url = '';
		switch (name) {
			case 'search-app':
				url = 'https://docs.appbase.io/docs/gettingstarted/quickstart/';
				break;
			case 'relevant-search':
				url = 'https://docs.appbase.io/docs/search/relevancy/';
				break;
			case 'search-analytics':
				url = 'https://docs.appbase.io/docs/analytics/overview/';
				break;
			case 'access-control':
				url = 'https://docs.appbase.io/docs/security/credentials/';
				break;
			default:
				url = 'https://docs.appbase.io/';
				break;
		}
		window.open(url, '_blank');
	};

	openPLaylist = name => {
		let url = '';
		switch (name) {
			case 'search-app':
				url =
					'https://www.youtube.com/playlist?list=PL33Tgi3iO5Fi83YY-weI8oVaWhp_DK_nd';
				break;
			case 'relevant-search':
				url =
					'https://www.youtube.com/playlist?list=PL33Tgi3iO5FgknACjZYDniot5bWCrShPc';
				break;
			case 'search-analytics':
				url =
					'https://www.youtube.com/playlist?list=PL33Tgi3iO5FjZ71-D749Vug1XBH6mrjYC';
				break;
			case 'access-control':
				url =
					'https://www.youtube.com/playlist?list=PL33Tgi3iO5Fg1HZ_8kjq1bNB3WnVJdq22';
				break;
			default:
				url =
					'https://www.youtube.com/channel/UCZ1UE9xilKewkX-5mkqwfwQ';
				break;
		}
		window.open(url, '_blank');
	};

	render() {
		const { visible } = this.state;
		return (
			<div>
				<Button
					type="primary"
					className={cancelButton}
					onClick={this.showModal}
				>
					<Icon type="switcher" /> Learn More
				</Button>
				<Modal
					visible={visible}
					onCancel={this.handleCancel}
					footer={null}
					width={750}
				>
					<Row>
						<div className={modalTitle}>
							While your cluster is getting deployed, you can read
							more or watch the following videos to get
							familiarized with the appbase.io platform.
						</div>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Card className={cardWrapper}>
								<Row className={cardHeading}>
									Building your first search app powered by
									appbase.io
								</Row>
								<Divider />
								<Row gutter={4} className={cardActions}>
									<Col span={12}>
										<Button
											type="primary"
											onClick={() =>
												this.openDocs('search-app')
											}
										>
											Read (5 min)
										</Button>
									</Col>
									<Col span={12}>
										<Button
											onClick={() =>
												this.openPLaylist('search-app')
											}
										>
											<Icon type="play-circle" /> Watch
											series
										</Button>
									</Col>
								</Row>
							</Card>
						</Col>
						<Col span={12}>
							<Card className={cardWrapper}>
								<Row className={cardHeading}>
									How relevant search works with appbase.io
								</Row>
								<Divider />
								<Row gutter={4} className={cardActions}>
									<Col span={12}>
										<Button
											type="primary"
											onClick={() =>
												this.openDocs('relevant-search')
											}
										>
											Read (5 min)
										</Button>
									</Col>
									<Col span={12}>
										<Button
											onClick={() =>
												this.openPLaylist(
													'relevant-search',
												)
											}
										>
											<Icon type="play-circle" /> Watch
											series
										</Button>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Card className={cardWrapper}>
								<Row className={cardHeading}>
									How search and click analytics works with
									appbase.io
								</Row>
								<Divider />
								<Row gutter={4} className={cardActions}>
									<Col span={12}>
										<Button
											type="primary"
											onClick={() =>
												this.openDocs(
													'search-analytics',
												)
											}
										>
											Read (5 min)
										</Button>
									</Col>
									<Col span={12}>
										<Button
											onClick={() =>
												this.openPLaylist(
													'search-analytics',
												)
											}
										>
											<Icon type="play-circle" /> Watch
											series
										</Button>
									</Col>
								</Row>
							</Card>
						</Col>
						<Col span={12}>
							<Card className={cardWrapper}>
								<Row className={cardHeading}>
									Set access control for search
								</Row>
								<Divider />
								<Row gutter={4} className={cardActions}>
									<Col span={12}>
										<Button
											type="primary"
											onClick={() =>
												this.openDocs('access-control')
											}
										>
											Read (5 min)
										</Button>
									</Col>
									<Col span={12}>
										<Button
											onClick={() =>
												this.openPLaylist(
													'access-control',
												)
											}
										>
											<Icon type="play-circle" /> Watch
											series
										</Button>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
				</Modal>
			</div>
		);
	}
}

export default Directives;
