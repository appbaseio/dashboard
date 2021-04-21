import { Button, message, notification, Select } from 'antd';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import get from 'lodash/get';
import ArcDetail from '../components/ArcDetail';
import CredentialsBox from '../components/CredentialsBox';
import StripeCheckout from '../../../components/StripeCheckout';
import { V7_ARC } from '../new';
import {
	card,
	clusterButtons,
	clusterEndpoint,
	esContainer,
	settingsItem,
} from '../styles';
import {
	getClusters,
	getSnapshots,
	hasAddon,
	restore,
	PLAN_LABEL,
	EFFECTIVE_PRICE_BY_PLANS,
	PRICE_BY_PLANS,
} from '../utils';

const { Option } = Select;

class ClusterScreen extends Component {
	constructor(props) {
		super(props);

		let visualization = 'none';

		switch (true) {
			case props.kibana:
				visualization = 'kibana';
				break;
			case props.grafana:
				visualization = 'grafana';
				break;
			default:
				visualization = 'none';
		}
		this.state = {
			cluster: props.cluster,
			arc: props.arc,
			deployment: props.deployment,
			kibana: props.kibana,
			streams: props.streams,
			elasticsearchHQ: props.elasticsearchHQ,
			clusters: [],
			isClusterLoading: true,
			snapshots: [],
			isSnapshotsLoading: false,
			restore_from: null,
			snapshot_id: null,
			repository_name: null,
			isRestoring: false,
			visualization,
			isStripeCheckoutOpen: false,
		};

		this.paymentButton = React.createRef();
		this.paymentTriggered = false;
	}

	componentDidMount() {
		this.triggerPayment();
		this.initClusters();
	}

	initClusters = () => {
		getClusters()
			.then(clusters => {
				const activeClusters = clusters.filter(
					item => item.status === 'active' && item.role === 'admin',
				);
				this.setState({
					clustersAvailable: !!clusters.length,
					clusters: activeClusters,
					isClusterLoading: false,
				});
			})
			.catch(e => {
				console.error(e);
				this.setState({
					isClusterLoading: false,
				});
			});
	};

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
		});
	};

	handleCluster = value => {
		this.setState({
			restore_from: value,
			snapshots: [],
		});
		this.fetchClusterSnapshots(value);
	};

	handleSnapshot = value => {
		const split = value.split(`___`);
		this.setState({
			snapshot_id: split[0],
			repository_name: split[1],
		});
	};

	fetchClusterSnapshots = restoreFrom => {
		this.setState({
			isSnapshotsLoading: true,
		});
		getSnapshots(restoreFrom)
			.then(snapshots => {
				this.setState({
					snapshotsAvailable: !!snapshots.length,
					snapshots,
					isSnapshotsLoading: false,
				});
				if (!snapshots.length) {
					message.info(`No snapshots found`);
				}
			})
			.catch(e => {
				console.error(e);
				this.setState({
					isSnapshotsLoading: false,
				});
			});
	};

	restoreCluster = () => {
		const { restore_from, snapshot_id, repository_name } = this.state;
		const { clusterId } = this.props;

		this.setState({
			isRestoring: true,
		});

		restore(clusterId, restore_from, snapshot_id, repository_name)
			.then(response => {
				if (response.status.code >= 400) {
					notification.error({
						message: 'Restoration Failed!',
						description: get(response, 'status.message'),
					});
				} else {
					message.success(get(response, 'status.message'));
				}
				this.setState({
					isRestoring: false,
				});
			})
			.catch(e => {
				console.error(e);
				this.setState({
					isRestoring: false,
				});
			});
	};

	toggleConfig = type => {
		this.setState(state => ({
			...state,
			[type]: !state[type],
		}));
	};

	includedInOriginal = key => {
		const { deployment: original } = this.props;
		return get(original, key)
			? !!Object.keys(get(original, key)).length
			: hasAddon(key, original);
	};

	saveClusterSettings = () => {
		const body = {
			remove_deployments: [],
		};

		const {
			cluster,
			arc,
			kibana,
			grafana,
			streams,
			elasticsearchHQ // prettier-ignore
		} = this.state;

		const { clusterId, onDeploy } = this.props;

		if (kibana && !this.includedInOriginal('kibana')) {
			body.kibana = {
				create_node: false,
				version: cluster.es_version,
			};
		} else if (!kibana && this.includedInOriginal('kibana')) {
			body.remove_deployments = [...body.remove_deployments, 'kibana'];
		}

		if (grafana && !this.includedInOriginal('grafana')) {
			body.grafana = true;
		} else if (!grafana && this.includedInOriginal('grafana')) {
			body.remove_deployments = [...body.remove_deployments, 'grafana'];
		}

		if (streams && !this.includedInOriginal('streams')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'streams',
					image: 'appbaseio/streams:6',
					exposed_port: 80,
				},
			];
		} else if (!streams && this.includedInOriginal('streams')) {
			body.remove_deployments = [...body.remove_deployments, 'streams'];
		}

		if (arc && !this.includedInOriginal('arc')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'arc',
					image: `siddharthlatest/arc:${V7_ARC}`,
					exposed_port: 8000,
				},
			];
		} else if (!arc && this.includedInOriginal('arc')) {
			body.remove_deployments = [...body.remove_deployments, 'arc'];
		}

		if (elasticsearchHQ && !this.includedInOriginal('elasticsearch-hq')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'elasticsearch-hq',
					image: 'elastichq/elasticsearch-hq:release-v3.5.0',
					exposed_port: 5000,
				},
			];
		} else if (
			!elasticsearchHQ &&
			this.includedInOriginal('elasticsearch-hq')
		) {
			body.remove_deployments = [
				...body.remove_deployments,
				'elasticsearch-hq',
			];
		}

		onDeploy(body, clusterId);
	};

	handleStripeModal = () => {
		this.setState(currentState => ({
			isStripeCheckoutOpen: !currentState.isStripeCheckoutOpen,
		}));
	};

	handleStripeSubmit = data => {
		this.setState({
			isStripeCheckoutOpen: false,
		});
		this.props.handleToken(data);
	};

	renderClusterEndpoint = source => {
		if (
			Object.keys(source).length &&
			source.name &&
			source.name !== 'gateway' &&
			source.name !== 'elasticsearch-hq'
		) {
			const username = source.username || source.dashboard_username;
			const password = source.password || source.dashboard_password;
			const [protocol, url] = (source.url || source.dashboard_url).split(
				'://',
			);
			const copyURL =
				source.name === 'kibana'
					? `${protocol}://${url}`
					: `${protocol}://${username}:${password}@${url}`.replace(
							/\/$/,
							'',
					  );
			let { name } = source;

			if (name === 'arc') {
				name = 'Appbase.io';
			}
			if (name === 'elasticsearch') {
				name = 'Elasticsearch';
			}
			return (
				<div key={name} className={clusterEndpoint}>
					<h4>
						{name}
						<CopyToClipboard
							text={copyURL}
							onCopy={() =>
								notification.success({
									message: ` ${name} URL copied successfully`,
								})
							}
						>
							<span
								data-clipboard-text={copyURL}
								style={{
									color: 'dodgerblue',
									cursor: 'pointer',
								}}
							>
								Copy URL
							</span>
						</CopyToClipboard>
					</h4>
					<CredentialsBox
						name={name}
						text={`${username}:${password}`}
					/>
				</div>
			);
		}

		return null;
	};

	triggerPayment = () => {
		if (
			!this.paymentTriggered &&
			window.location.search.startsWith('?subscribe=true')
		) {
			if (this.paymentButton.current) {
				this.paymentButton.current.buttonNode.click();
				this.paymentTriggered = true;
			}
		}
	};

	render() {
		const { cluster, deployment, isStripeCheckoutOpen } = this.state;

		const {
			clusterId,
			isPaid,
			handleDeleteModal,
			isExternalCluster,
		} = this.props;
		const isViewer = cluster.user_role === 'viewer';

		let addons = deployment.addons || [];

		addons = addons.filter(i => i.name === 'arc');
		if (isExternalCluster) {
			const arcDeployment =
				deployment &&
				deployment.addons &&
				deployment.addons.find(addon => addon.name === 'arc');
			return (
				<Fragment>
					<ArcDetail
						cluster={cluster}
						arc={arcDeployment}
						handleDeleteModal={handleDeleteModal}
					/>
					{isStripeCheckoutOpen && (
						<StripeCheckout
							visible={isStripeCheckoutOpen}
							plan={PLAN_LABEL[cluster.pricing_plan]}
							price={EFFECTIVE_PRICE_BY_PLANS[
								cluster.pricing_plan
							].toString()}
							monthlyPrice={PRICE_BY_PLANS[
								cluster.pricing_plan
							].toString()}
							onCancel={this.handleStripeModal}
							onSubmit={data =>
								this.handleStripeSubmit({ clusterId, ...data })
							}
						/>
					)}
					<div className={clusterButtons}>
						<div>
							{!isPaid &&
							window.location.search.startsWith(
								'?subscribe=true',
							) ? (
								<Button
									size="large"
									css={{
										marginRight: 12,
									}}
									ref={this.paymentButton}
									onClick={this.handleStripeModal}
								>
									Pay now
								</Button>
							) : null}
						</div>
					</div>
				</Fragment>
			);
		}

		return (
			<Fragment>
				<li className={card}>
					<div className="col light">
						<h3>Elasticsearch</h3>
						<p>Live cluster endpoint</p>
					</div>

					<div className="col">
						{Object.keys(deployment)
							.filter(item => item !== 'addons')
							.map(key =>
								this.renderClusterEndpoint(deployment[key]),
							)}
					</div>
				</li>

				<li className={card}>
					<div className="col light">
						<h3>Appbase.io Server</h3>
						<a
							href="https://docs.appbase.io/docs/hosting/clusters/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Learn more
						</a>
					</div>

					<div className="col">
						{addons.map(key => this.renderClusterEndpoint(key))}
					</div>
				</li>

				<li className={card}>
					<div className="col light">
						<h3>Choose Visualization Tool</h3>
					</div>

					<div
						className={settingsItem}
						css={{
							padding: 30,
							alignItems: 'baseline',
						}}
					>
						<div className={esContainer}>
							<Button
								type={
									this.state.visualization === 'none'
										? 'primary'
										: 'default'
								}
								size="large"
								css={{
									height: 160,
									width: '100%',
									color: '#000',
									backgroundColor:
										this.state.visualization === 'none'
											? '#eaf5ff'
											: '#fff',
								}}
								onClick={() => {
									this.setConfig('visualization', 'none');
									this.setConfig('kibana', false);
									this.setConfig('grafana', false);
								}}
							>
								None
							</Button>
						</div>
						<div className={esContainer}>
							<Button
								size="large"
								type={
									this.state.visualization === 'kibana'
										? 'primary'
										: 'default'
								}
								css={{
									height: 160,
									width: '100%',
									backgroundColor:
										this.state.visualization === 'kibana'
											? '#eaf5ff'
											: '#fff',
								}}
								onClick={() => {
									this.setConfig('visualization', 'kibana');
									this.setConfig('kibana', true);
									this.setConfig('grafana', false);
								}}
							>
								<img
									width={150}
									src="https://static-www.elastic.co/v3/assets/bltefdd0b53724fa2ce/blt8781708f8f37ed16/5c11ec2edf09df047814db23/logo-elastic-kibana-lt.svg"
									alt="Kibana"
								/>
							</Button>
							<p>
								The default visualization dashboard for
								ElasticSearch.
							</p>
						</div>
					</div>
				</li>

				<li className={card}>
					<div className="col light">
						<h3>Restore From Snapshot</h3>
						<p>Select cluster & snapshots</p>
					</div>

					<div className="col">
						<Select
							css={{
								width: '100%',
								maxWidth: 400,
							}}
							placeholder="Select a cluster"
							onChange={this.handleCluster}
						>
							{this.state.clusters
								.filter(i => i.recipe === 'default')
								.map(item => (
									<Option key={item.id}>{item.name}</Option>
								))}
						</Select>
						{this.state.isSnapshotsLoading && (
							<p>Snapshots Loading</p>
						)}
						{this.state.snapshots.length > 0 && (
							<Select
								css={{
									width: '100%',
									maxWidth: 400,
									margin: '20px 0',
								}}
								placeholder="Select a snapshot"
								onChange={this.handleSnapshot}
							>
								{this.state.snapshots.map(item => (
									<Option
										key={`${item.id}___${item.repository_name}`}
										value={`${item.id}___${item.repository_name}`}
									>
										{new Date(+item.id * 1000).toString().substring(0, 15)}
									</Option>
								))}
							</Select>
						)}

						{this.state.restore_from && this.state.snapshot_id && (
							<Button
								style={{ marginLeft: 8 }}
								type="primary"
								loading={this.state.isRestoring}
								onClick={this.restoreCluster}
							>
								Restore
							</Button>
						)}
					</div>
				</li>
				{isViewer || (
					<div className={clusterButtons}>
						<Button
							onClick={handleDeleteModal}
							type="danger"
							size="large"
							icon="delete"
							className="delete"
						>
							Delete Cluster
						</Button>

						<div>
							{!isPaid &&
							window.location.search.startsWith(
								'?subscribe=true',
							) ? (
								<Button
									size="large"
									ref={this.paymentButton}
									css={{
										marginRight: 12,
									}}
									onClick={this.handleStripeModal}
								>
									Pay now
								</Button>
							) : null}
							<Button
								size="large"
								icon="save"
								type="primary"
								onClick={this.saveClusterSettings}
							>
								Save Cluster Settings
							</Button>
						</div>
					</div>
				)}
			</Fragment>
		);
	}
}

ClusterScreen.propTypes = {
	clusterId: PropTypes.string.isRequired,
	cluster: PropTypes.object.isRequired,
	deployment: PropTypes.object.isRequired,
	handleToken: PropTypes.func.isRequired,
	isPaid: PropTypes.bool,
	handleDeleteModal: PropTypes.func.isRequired,
	isExternalCluster: PropTypes.bool,
	onDeploy: PropTypes.func.isRequired,
	kibana: PropTypes.bool.isRequired,
	grafana: PropTypes.bool.isRequired,
	elasticsearchHQ: PropTypes.bool.isRequired,
	arc: PropTypes.bool.isRequired,
	streams: PropTypes.bool.isRequired,
};

export default ClusterScreen;
