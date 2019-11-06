import React, { Component, Fragment } from 'react';
import {
 Button, Select, message, notification,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Stripe from 'react-stripe-checkout';

import CredentialsBox from '../components/CredentialsBox';
import Overlay from '../components/Overlay';
import {
 hasAddon, getClusters, getSnapshots, restore,
} from '../utils';
import {
 card, settingsItem, clusterEndpoint, clusterButtons,
} from '../styles';
import { STRIPE_KEY } from '../ClusterPage';
import ArcDetail from '../components/ArcDetail';

const { Option } = Select;

export default class ClusterScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cluster: props.cluster,
			arc: props.arc,
			deployment: props.deployment,
			kibana: props.kibana,
			streams: props.streams,
			elasticsearchHQ: props.elasticsearchHQ,
			showOverlay: false,
			clusters: [],
			isClusterLoading: true,
			snapshots: [],
			isSnapshotsLoading: false,
			restore_from: null,
			snapshot_id: null,
			isRestoring: false,
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
			.then((clusters) => {
				const activeClusters = clusters.filter(
					item => item.status === 'active' && item.role === 'admin',
				);
				this.setState({
					clustersAvailable: !!clusters.length,
					clusters: activeClusters,
					isClusterLoading: false,
				});
			})
			.catch((e) => {
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

	handleCluster = (value) => {
		this.setState({
			restore_from: value,
			snapshots: [],
		});
		this.fetchClusterSnapshots(value);
	};

	handleSnapshot = (value) => {
		this.setState({
			snapshot_id: value,
		});
	};

	fetchClusterSnapshots = (restoreId) => {
		const { clusterId } = this.props;
		this.setState({
			isSnapshotsLoading: true,
		});
		getSnapshots(clusterId, restoreId)
			.then((snapshots) => {
				this.setState({
					snapshotsAvailable: !!snapshots.length,
					snapshots,
					isSnapshotsLoading: false,
				});
			})
			.catch((e) => {
				console.error(e);
				this.setState({
					isSnapshotsLoading: false,
				});
			});
	};

	restoreCluster = () => {
		const { restore_from, snapshot_id } = this.state;
		const { clusterId } = this.props;

		this.setState({
			isRestoring: true,
		});

		restore(clusterId, restore_from, snapshot_id)
			.then((response) => {
				if (response.status.code >= 400) {
					notification.error({
						message: 'Restoration Failed!',
						description: response.status.message,
					});
				} else {
					message.success(response.status.message);
				}
				this.setState({
					isRestoring: false,
				});
			})
			.catch((e) => {
				console.error(e);
				this.setState({
					isRestoring: false,
				});
			});
	};

	toggleConfig = (type) => {
		this.setState(state => ({
			...state,
			[type]: !state[type],
		}));
	};

	toggleOverlay = () => {
		this.setState(state => ({
			...state,
			showOverlay: !state.showOverlay,
		}));
	};

	includedInOriginal = (key) => {
		const { deployment: original } = this.props;
		return original[key] ? !!Object.keys(original[key]).length : hasAddon(key, original);
	};

	saveClusterSettings = () => {
		const body = {
			remove_deployments: [],
		};

		const {
			cluster,
			arc,
			kibana,
			streams,
			elasticsearchHQ, // prettier-ignore
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
					image: 'siddharthlatest/arc:7.6.0-cluster', // TODO: Dynamically load image as per ES version
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
		} else if (!elasticsearchHQ && this.includedInOriginal('elasticsearch-hq')) {
			body.remove_deployments = [...body.remove_deployments, 'elasticsearch-hq'];
		}

		onDeploy(body, clusterId);
	};

	renderClusterEndpoint = (source) => {
		if (Object.keys(source).length) {
			const username = source.username || source.dashboard_username;
			const password = source.password || source.dashboard_password;
			const [protocol, url] = (source.url || source.dashboard_url).split('://');
			return (
				<div key={source.name} className={clusterEndpoint}>
					<h4>
						{source.name}
						<CopyToClipboard
							text={`${protocol}://${username}:${password}@${url}`}
							onCopy={() => notification.success({
									message: ` ${source.name} URL Copied Successfully`,
								})
							}
						>
							<a data-clipboard-text={`${protocol}://${username}:${password}@${url}`}>
								Copy URL
							</a>
						</CopyToClipboard>
					</h4>
					<CredentialsBox name={source.name} text={`${username}:${password}`} />
				</div>
			);
		}

		return null;
	};

	triggerPayment = () => {
		if (!this.paymentTriggered && window.location.search.startsWith('?subscribe=true')) {
			if (this.paymentButton.current) {
				this.paymentButton.current.buttonNode.click();
				this.paymentTriggered = true;
			}
		}
	};

	render() {
		const {
			cluster,
			arc,
			deployment,
			kibana,
			streams,
			elasticsearchHQ,
			showOverlay,
		} = this.state;
		const {
			clusterId,
			deployment: originalDeployment,
			planRate,
			handleToken,
			isPaid,
			handleDeleteModal,
			isExternalCluster,
		} = this.props;
		const isViewer = cluster.user_role === 'viewer';

		if (isExternalCluster) {
			const arcDeployment = deployment && deployment.addons.find(addon => addon.name === 'arc');
			return (
				<Fragment>
					<ArcDetail cluster={cluster} arc={arcDeployment} />
					<div className={clusterButtons}>
						<div>
							{!isPaid && window.location.search.startsWith('?subscribe=true') ? (
								<Stripe
									name="Appbase.io Clusters"
									amount={planRate * 100}
									token={token => handleToken(clusterId, token)}
									disabled={false}
									stripeKey={STRIPE_KEY}
									closed={this.toggleOverlay}
								>
									<Button
										size="large"
										ref={this.paymentButton}
										css={{
											marginRight: 12,
										}}
										onClick={this.toggleOverlay}
									>
										Pay now
									</Button>
								</Stripe>
							) : null}
						</div>
					</div>
				</Fragment>
			);
		}

		return (
			<Fragment>
				<li className={card}>
					{showOverlay && <Overlay />}
					<div className="col light">
						<h3>Elasticsearch</h3>
						<p>Live cluster endpoint</p>
					</div>

					<div className="col">
						{Object.keys(deployment)
							.filter(item => item !== 'addons')
							.map(key => this.renderClusterEndpoint(deployment[key]))}
					</div>
				</li>

				<li className={card}>
					<div className="col light">
						<h3>Dashboard</h3>
						<p>Manage your cluster</p>
					</div>

					<div className="col">{this.renderClusterEndpoint(cluster)}</div>
				</li>

				<li className={card}>
					<div className="col light">
						<h3>Add-ons</h3>
						<p>Elasticsearch add-ons endpoint</p>
					</div>

					<div className="col">
						{(deployment.addons || []).map(key => this.renderClusterEndpoint(key))}
					</div>
				</li>

				<li className={card}>
					<div className="col light">
						<h3>{isViewer ? 'View' : 'Edit'} Cluster Settings</h3>
						{isViewer || <p>Customise as per your needs</p>}
					</div>
					<div className="col grow">
						<div className={settingsItem}>
							<h4>Kibana</h4>
							<div>
								<label htmlFor="yes">
									<input
										type="radio"
										name="kibana"
										defaultChecked={kibana}
										id="yes"
										disabled={isViewer}
										onChange={() => this.setConfig('kibana', true)}
									/>
									Yes
								</label>

								<label htmlFor="no">
									<input
										type="radio"
										name="kibana"
										defaultChecked={!kibana}
										id="no"
										disabled={isViewer}
										onChange={() => this.setConfig('kibana', false)}
									/>
									No
								</label>
							</div>
						</div>

						<div className={settingsItem}>
							<h4>Add-ons</h4>
							<div className="settings-label">
								<label htmlFor="arc">
									<input
										type="checkbox"
										defaultChecked={arc}
										id="arc"
										disabled={isViewer}
										onChange={() => this.toggleConfig('arc')}
									/>
									Appbase.io GUI
								</label>

								<label htmlFor="streams">
									<input
										type="checkbox"
										defaultChecked={streams}
										id="streams"
										disabled={isViewer}
										onChange={() => this.toggleConfig('streams')}
									/>
									Realtime Streaming
								</label>

								<label htmlFor="elasticsearchHQ">
									<input
										type="checkbox"
										defaultChecked={elasticsearchHQ}
										id="elasticsearchHQ"
										disabled={isViewer}
										onChange={() => this.toggleConfig('elasticsearchHQ')}
									/>
									Elasticsearch-HQ
								</label>
							</div>
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
							{this.state.clusters.map(item => (
								<Option key={item.id}>{item.name}</Option>
							))}
						</Select>
						{this.state.isSnapshotsLoading && <p>Snapshots Loading</p>}
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
								{this.state.snapshots
									.sort(item => +item.id)
									.reverse()
									.map(item => (
										<Option key={item.id}>
											{new Date(+item.id * 1000).toString()}
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
							{!isPaid && window.location.search.startsWith('?subscribe=true') ? (
								<Stripe
									name="Appbase.io Clusters"
									amount={planRate * 100}
									token={token => handleToken(clusterId, token)}
									disabled={false}
									stripeKey={STRIPE_KEY}
									closed={this.toggleOverlay}
								>
									<Button
										size="large"
										ref={this.paymentButton}
										css={{
											marginRight: 12,
										}}
										onClick={this.toggleOverlay}
									>
										Pay now
									</Button>
								</Stripe>
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
