import React from 'react';
import { css } from 'react-emotion';
import { Modal, Button, Icon, Row, Col, Card } from 'antd';

const loadButton = css`
	width: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const modalTitle = css`
	letter-spacing: 0.01rem;
	font-size: 1em;
	margin: 15px 25px 10px 10px;
	text-align: center;
	vertical-align: middle;

	word-spacing: 0.05em;
	line-height: 26px;
	font-size: 16px;
	color: #595959;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const cardWrapper = css`
	height: 240px;
	width: 300px;
	margin: 10px;
	position: relative;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
`;

const searchCard = css`
	background-image: url('/static/images/explainer/search_preview.png');
`;

const relevancyCard = css`
	background-image: url('/static/images/explainer/manage_mappings.png');
`;

const securityCard = css`
	background-image: url('/static/images/explainer/security.png');
`;

const analyticsCard = css`
	background-image: url('/static/images/explainer/setup_analytics.png');
`;

const cardHeading = css`
	letter-spacing: 1px;
	font-size: 1em;
	font-weight: 500;
	text-align: center;
	vertical-align: middle;
	height: 20px;
	width: 90%;
	position: absolute;
	top: 5%;
	left: 5%;
`;

const cardActions = css`
	position: absolute;
	bottom: 7%;
	left: 5.5%;
`;

const button = css`
	box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
`;

const PLAY_LISTS = {
	SEARCH_APP: 'search-app',
	RELEVANT_SEARCH: 'relevant-search',
	SEARCH_ANALYTICS: 'search-analytics',
	ACCESS_CONTROL: 'access-control',
};

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
			case PLAY_LISTS.SEARCH_APP:
				url =
					'https://docs.appbase.io/docs/reactivesearch/gettingstarted/';
				break;
			case PLAY_LISTS.RELEVANT_SEARCH:
				url = 'https://docs.appbase.io/docs/search/relevancy/';
				break;
			case PLAY_LISTS.SEARCH_ANALYTICS:
				url = 'https://docs.appbase.io/docs/analytics/overview/';
				break;
			case PLAY_LISTS.ACCESS_CONTROL:
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
			case PLAY_LISTS.SEARCH_APP:
				url =
					'https://www.youtube.com/playlist?list=PL33Tgi3iO5Fi83YY-weI8oVaWhp_DK_nd';
				break;
			case PLAY_LISTS.RELEVANT_SEARCH:
				url =
					'https://www.youtube.com/playlist?list=PL33Tgi3iO5FgknACjZYDniot5bWCrShPc';
				break;
			case PLAY_LISTS.SEARCH_ANALYTICS:
				url =
					'https://www.youtube.com/playlist?list=PL33Tgi3iO5FjZ71-D749Vug1XBH6mrjYC';
				break;
			case PLAY_LISTS.ACCESS_CONTROL:
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
					className={loadButton}
					onClick={this.showModal}
				>
					<Icon
						component={() => (
							<img
								src="/static/images/buttons/learn-more.svg"
								style={{ width: '17px' }}
								alt="learn more"
							/>
						)}
					/>{' '}
					Learn More
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
							familiarized with the reactivesearch.io platform.
						</div>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Card className={[cardWrapper, searchCard]}>
								<Row className={cardHeading}>
									Building your first search app powered by
									reactivesearch.io
								</Row>
								<Row gutter={4} className={cardActions}>
									<Col span={12}>
										<Button
											type="primary"
											onClick={() =>
												this.openDocs(
													PLAY_LISTS.SEARCH_APP,
												)
											}
											className={button}
										>
											Read (5 min)
										</Button>
									</Col>
									<Col span={12}>
										<Button
											onClick={() =>
												this.openPLaylist(
													PLAY_LISTS.SEARCH_APP,
												)
											}
											className={button}
										>
											<Icon type="play-circle" /> Watch
											series
										</Button>
									</Col>
								</Row>
							</Card>
						</Col>
						<Col span={12}>
							<Card className={[cardWrapper, relevancyCard]}>
								<Row className={cardHeading}>
									How relevant search works with
									reactivesearch.io
								</Row>
								<Row gutter={4} className={cardActions}>
									<Col span={12}>
										<Button
											type="primary"
											onClick={() =>
												this.openDocs(
													PLAY_LISTS.RELEVANT_SEARCH,
												)
											}
											className={button}
										>
											Read (5 min)
										</Button>
									</Col>
									<Col span={12}>
										<Button
											onClick={() =>
												this.openPLaylist(
													PLAY_LISTS.RELEVANT_SEARCH,
												)
											}
											className={button}
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
							<Card className={[cardWrapper, analyticsCard]}>
								<Row className={cardHeading}>
									How search and click analytics works with
									reactivesearch.io
								</Row>
								<Row gutter={4} className={cardActions}>
									<Col span={12}>
										<Button
											type="primary"
											onClick={() =>
												this.openDocs(
													PLAY_LISTS.SEARCH_ANALYTICS,
												)
											}
											className={button}
										>
											Read (5 min)
										</Button>
									</Col>
									<Col span={12}>
										<Button
											onClick={() =>
												this.openPLaylist(
													PLAY_LISTS.SEARCH_ANALYTICS,
												)
											}
											className={button}
										>
											<Icon type="play-circle" /> Watch
											series
										</Button>
									</Col>
								</Row>
							</Card>
						</Col>
						<Col span={12}>
							<Card className={[cardWrapper, securityCard]}>
								<Row className={cardHeading}>
									Set access control for search
								</Row>
								<Row gutter={4} className={cardActions}>
									<Col span={12}>
										<Button
											type="primary"
											onClick={() =>
												this.openDocs(
													PLAY_LISTS.ACCESS_CONTROL,
												)
											}
											className={button}
										>
											Read (5 min)
										</Button>
									</Col>
									<Col span={12}>
										<Button
											onClick={() =>
												this.openPLaylist(
													PLAY_LISTS.ACCESS_CONTROL,
												)
											}
											className={button}
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
