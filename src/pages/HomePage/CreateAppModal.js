import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
 Row, Col, Icon, Modal, Input, Radio, List, Popover, notification,
} from 'antd';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
	modalHeading,
	input,
	radiobtn,
	pricebtn,
	clusterInfo,
	planDetails,
	planInfo,
} from './styles';
import { validateAppName, validationsList, capitalizeFirstLetter } from '../../utils/helper';
import { createAppSubscription } from '../../batteries/modules/actions';
import Loader from '../../batteries/components/shared/Loader';

import { createApp, resetCreatedApp } from '../../actions';

const RadioGroup = Radio.Group;
const { confirm } = Modal;

class CreateAppModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appName: '',
			plan: 'free',
			hasJSON: false,
			category: 'generic',
			elasticVersion: '5',
			validationPopOver: false,
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

		const isValid = validateAppName(appName);
		if (isValid) {
			handleCreateApp(options);
		} else {
			notification.error({
				message: 'Invalid App name',
				description: 'Please follow the validations rule.',
			});
			this.setState({
				validationPopOver: true,
			});
		}
	};

	handleChange = (e) => {
		const {
			target: { name, value },
		} = e;
		let inputValue = value;
		if (name === 'appName') {
			inputValue = inputValue.toLowerCase();
		}

		this.setState({
			[name]: inputValue,
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

	handleValidationPopOver = () => {
		this.setState(({ validationPopOver }) => ({
			validationPopOver: !validationPopOver,
		}));
	};

	componentDidUpdate = (prevProps) => {
		const {
			isPaid,
			createdApp,
			history, //eslint-disable-line
			createSubscription,
			isError,
			isSuccess,
			isUsingTrial,
		} = this.props;
		const { hasJSON, plan, appName } = this.state;
		const redirect = () => {
			if (hasJSON) {
				history.push(`app/${appName}/import`);
			} else {
				history.push(`app/${appName}`);
			}
		};
		if (createdApp.data && createdApp.data.id !== get(prevProps, 'createdApp.data.id')) {
			if (!isUsingTrial && isPaid && plan !== 'free') {
				// Only call for previously paid customers
				createSubscription(plan, appName);
				this.handleCancel();
			} else {
				redirect();
			}
		}
		if (isError && isError !== prevProps.isError) {
			confirm({
				title: `Your app has been created successfully, but we were unable to set the plan to ${capitalizeFirstLetter(
					plan,
				)}.`,
				content:
					'You can still update your plan by visiting the billing section of the app.',
				okText: 'Go To Billing',
				onOk() {
					history.push(`app/${appName}/billing`);
				},
				onCancel() {},
			});
		}
		if (isSuccess && isSuccess !== prevProps.isSuccess) {
			redirect();
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
			<Col span={4} className={planDetails}>
				{type}
			</Col>
			<Col span={6} className={planDetails}>
				{price}
			</Col>
			<Col span={4} className={planDetails}>
				{records}
			</Col>
			<Col span={4} className={planDetails}>
				{calls}
			</Col>
			<Col className={planInfo}>
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
			validationPopOver,
		} = this.state;
		const { createdApp, showModal, isLoading } = this.props;
		if (isLoading) {
			return <Loader show message="Updating Plan... Please wait!" />;
		}
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
						<span>Alternatively, you can also create a dedicated cluster.</span>
					</div>
					<Link to="/clusters">Create a Cluster</Link>
				</section>

				<div>
					<Row type="flex" justify="space-between" align="middle">
						<h3 className={modalHeading}>App Name</h3>
						<Popover
							placement="right"
							content={(
								<List
									size="small"
									dataSource={validationsList}
									renderItem={item => <List.Item>{item}</List.Item>}
								/>
							)} // prettier-ignore
							title="App name validations"
							trigger="click"
							visible={validationPopOver}
						>
							<Icon type="info-circle" onClick={this.handleValidationPopOver} />
						</Popover>
					</Row>
					<p css={{ fontSize: 14, margin: '-4px 0 8px 0', lineHeight: '20px' }}>
						App names are unique across appbase.io and should be lowercase. Click
						<span style={{ color: '#1890ff' }} onClick={this.handleValidationPopOver}>
							{' '}
							here
						</span>{' '}
						to see more rules.
					</p>
					<Input
						placeholder="Enter a unique app name"
						name="appName"
						className={input}
						onChange={this.handleChange}
						value={appName}
					/>
					{createdApp && createdApp.error ? (
						<div css={{ color: 'tomato', marginTop: 8 }}>
							{createdApp.error.actual.message}
						</div>
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
CreateAppModal.defaultProps = {
	isError: null,
};
CreateAppModal.propTypes = {
	showModal: PropTypes.bool.isRequired,
	handleModal: PropTypes.func.isRequired,
	createSubscription: PropTypes.func.isRequired,
	createdApp: PropTypes.object.isRequired,
	resetApp: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	isError: PropTypes.any,
	isSuccess: PropTypes.any.isRequired,
	isUsingTrial: PropTypes.bool.isRequired,
	isPaid: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
	const {
 apps, appsMetrics, createdApp, $createAppSubscription,
} = state;
	return {
		apps,
		appsMetrics,
		createdApp,
		isLoading: get($createAppSubscription, 'isFetching'),
		isError: get($createAppSubscription, 'error') || null,
		isSuccess: get($createAppSubscription, 'success') || false,
		isUsingTrial: get(state, '$getUserPlan.trial') || false,
		isPaid: get(state, '$getUserPlan.isPaid') || false,
	};
};

const mapDispatchToProps = dispatch => ({
	handleCreateApp: options => dispatch(createApp(options)),
	resetApp: () => dispatch(resetCreatedApp()),
	createSubscription: (plan, appName) => dispatch(createAppSubscription(undefined, plan, appName)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateAppModal);
