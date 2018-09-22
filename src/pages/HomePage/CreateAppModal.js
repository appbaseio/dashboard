import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
 Row, Col, Icon, Modal, Input, Radio,
} from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
 modalHeading, input, radiobtn, pricebtn, clusterInfo,
} from './styles';

import { createApp, resetCreatedApp } from '../../actions';

const RadioGroup = Radio.Group;

class CreateAppModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appName: '',
			plan: 'free',
			hasJSON: false,
			category: 'generic',
			elasticVersion: '5',
		};
	}

	componentDidMount() {
		const { resetApp } = this.props;
		resetApp();
	}

	handleOk = async () => {
		const { appName, category, elasticVersion } = this.state;
		const { handleCreateApp } = this.props;
		const options = {
			appName,
			category,
			es_version: elasticVersion,
		};

		handleCreateApp(options);
	};

	handleChange = (e) => {
		const {
			target: { name, value },
		} = e;
		this.setState({
			[name]: value,
		});
	};

	handleCancel = () => {
		const { handleModal } = this.props;
		handleModal();
	};

	handleMenuClick = (e) => {
		const category = e.key;
		this.setState({
			category,
		});
	};

	componentDidUpdate = () => {
		const { createdApp, history } = this.props; //eslint-disable-line
		const { hasJSON, appName } = this.state;
		if (createdApp.data && createdApp.data.id) {
			if (hasJSON) {
				history.push(`app/${appName}/import`);
			} else {
				history.push(`app/${appName}`);
			}
		}
	};

	generateGrid = ({
		// prettier-ignore
		type,
		price,
		records,
		calls,
	}) => (
		<Row type="flex" justify="space-between">
			<Col span={4}>{type}</Col>
			<Col span={6}>{price}</Col>
			<Col span={4}>{records}</Col>
			<Col span={4}>{calls}</Col>
			<Col>
				<a href="https://appbase.io/pricing/" target="_blank" rel="noopener noreferrer">
					<Icon type="info-circle" />
				</a>
			</Col>
		</Row>
	);

	render() {
		const {
			// prettier-ignore
			appName,
			hasJSON,
			plan,
			elasticVersion,
		} = this.state;
		const { createdApp, showModal } = this.props;

		return (
			<Modal
				visible={showModal}
				onOk={this.handleOk}
				destroyOnClose
				okButtonProps={{ loading: createdApp.isLoading }}
				okText="Create App"
				title="Create App"
				onCancel={this.handleCancel}
				width={600}
			>
				<section className={clusterInfo}>
					<div>
						<Icon
							type="info-circle"
							css={{
								color: 'rgb(24,144,255)',
								marginRight: 8,
							}}
							theme="filled"
						/>
						<span>Click to create a dedicated Cluster instead.</span>
					</div>
					<Link to="/clusters">Create a Cluster</Link>
				</section>

				<div>
					<h3 className={modalHeading}>App Name</h3>
					<p css={{ fontSize: 14, margin: '-8px 0 8px 0' }}>
						App names are unique across appbase.io and should not contain spaces.
					</p>
					<Input
						placeholder="Enter a unique app name"
						name="appName"
						className={input}
						onChange={this.handleChange}
						value={appName}
					/>
					{createdApp && createdApp.error ? (
						<div css={{ color: 'tomato', marginTop: 8 }}>{createdApp.error.actual.message}</div>
					) : null}
				</div>

				<div>
					<h3 className={modalHeading}>Choose Plan</h3>
					<RadioGroup
						value={plan}
						name="plan"
						onChange={this.handleChange}
						style={{ width: '100%' }}
					>
						<Radio value="free" className={pricebtn}>
							{this.generateGrid({
								type: 'Free',
								price: '$0 per month',
								records: '10K records',
								calls: '100K API calls',
							})}
						</Radio>
						<Radio value="bootstrap" className={pricebtn}>
							{this.generateGrid({
								type: 'Bootstrap',
								price: '$29 per month',
								records: '100K records',
								calls: '1M API calls',
							})}
						</Radio>
						<Radio value="growth" className={pricebtn}>
							{this.generateGrid({
								type: 'Growth',
								price: '$89 per month',
								records: '1M records',
								calls: '10M API calls',
							})}
						</Radio>
					</RadioGroup>
				</div>

				<div>
					<h3 className={modalHeading}>
						Do you have a JSON or CSV dataset to import into this app?
					</h3>
					<RadioGroup value={hasJSON} name="hasJSON" onChange={this.handleChange}>
						<Radio className={radiobtn} value>
							Yes
						</Radio>
						<Radio className={radiobtn} value={false}>
							No
						</Radio>
					</RadioGroup>
				</div>

				<Row>
					<Col span={14}>
						<h3 className={modalHeading}>Pick Your Elasticsearch Version</h3>
						<RadioGroup
							value={elasticVersion}
							name="elasticVersion"
							onChange={this.handleChange}
						>
							<Radio className={radiobtn} value="5">
								5
							</Radio>
							<Radio className={radiobtn} value="6">
								6
							</Radio>
						</RadioGroup>
					</Col>
				</Row>
			</Modal>
		);
	}
}

CreateAppModal.propTypes = {
	showModal: PropTypes.bool.isRequired,
	handleModal: PropTypes.func.isRequired,
	createdApp: PropTypes.object.isRequired,
	resetApp: PropTypes.func.isRequired,
};

const mapStateToProps = ({ apps, appsMetrics, createdApp }) => ({
	apps,
	appsMetrics,
	createdApp,
});

const mapDispatchToProps = dispatch => ({
	handleCreateApp: options => dispatch(createApp(options)),
	resetApp: () => dispatch(resetCreatedApp()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateAppModal);
