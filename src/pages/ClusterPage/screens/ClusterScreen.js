import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'antd';
import Stripe from 'react-stripe-checkout';

import CredentialsBox from '../components/CredentialsBox';
import Overlay from '../components/Overlay';
import { getAddon, hasAddon } from '../utils';
import {
 card, settingsItem, clusterEndpoint, clusterButtons,
} from '../styles';
import { STRIPE_KEY } from '../ClusterPage';

export default class ClusterScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cluster: props.cluster,
			arc: props.arc,
			deployment: props.deployment,
			kibana: props.kibana,
			mirage: props.mirage,
			dejavu: props.dejavu,
			elasticsearchHQ: props.elasticsearchHQ,
			showOverlay: false,
		};

		this.paymentButton = React.createRef();
		this.paymentTriggered = false;
	}

	componentDidMount() {
		this.triggerPayment();
	}

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
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
			mirage,
			dejavu,
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

		if (dejavu && !this.includedInOriginal('dejavu')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'dejavu',
					image: 'appbaseio/dejavu:3.0.0-alpha',
					exposed_port: 1358,
				},
			];
		} else if (!dejavu && this.includedInOriginal('dejavu')) {
			body.remove_deployments = [...body.remove_deployments, 'dejavu'];
		}

		if (arc && !this.includedInOriginal('arc')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'arc',
					image: 'siddharthlatest/arc:0.0.25',
					exposed_port: 8000,
				},
			];
		} else if (!arc && this.includedInOriginal('arc')) {
			body.remove_deployments = [...body.remove_deployments, 'arc'];
		}

		if (mirage && !this.includedInOriginal('mirage')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'mirage',
					image: 'appbaseio/mirage:0.8.0',
					exposed_port: 3030,
				},
			];
		} else if (!mirage && this.includedInOriginal('mirage')) {
			body.remove_deployments = [...body.remove_deployments, 'mirage'];
		}

		if (elasticsearchHQ && !this.includedInOriginal('elasticsearch-hq')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'elasticsearch-hq',
					image: 'elastichq/elasticsearch-hq:release-v3.4.1',
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
						<a
							href={`${protocol}://${username}:${password}@${url}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon type="link" theme="outlined" />
							{source.name}
						</a>
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
			mirage,
			dejavu,
			elasticsearchHQ,
			showOverlay,
		} = this.state;
		const {
			clusterId,
			deployment: originalDeployment,
			planRate,
			handleToken,
			isPaid,
		} = this.props;

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
						<h3>Edit Cluster Settings</h3>
						<p>Customise as per your needs</p>
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
										onChange={() => this.toggleConfig('arc')}
									/>
									Arc Middleware
								</label>

								<label htmlFor="dejavu">
									<input
										type="checkbox"
										defaultChecked={dejavu}
										id="dejavu"
										onChange={() => this.toggleConfig('dejavu')}
									/>
									Dejavu
								</label>

								<label htmlFor="elasticsearchHQ">
									<input
										type="checkbox"
										defaultChecked={elasticsearchHQ}
										id="elasticsearchHQ"
										onChange={() => this.toggleConfig('elasticsearchHQ')}
									/>
									Elasticsearch-HQ
								</label>

								<label htmlFor="mirage">
									<input
										type="checkbox"
										defaultChecked={mirage}
										id="mirage"
										onChange={() => this.toggleConfig('mirage')}
									/>
									Mirage
								</label>
							</div>
						</div>
					</div>
				</li>

				<div className={clusterButtons}>
					<Button
						onClick={this.props.onDelete}
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
			</Fragment>
		);
	}
}
