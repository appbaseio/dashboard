import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import {
 Row, Col, Icon, Button, Divider,
} from 'antd';
import Stripe from 'react-stripe-checkout';

import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';
import Container from '../../components/Container';
import Loader from '../../components/Loader';

import { getClusters, createSubscription } from './utils';
import { machineMarks } from './new';
import { mediaKey } from '../../utils/media';
import { clusterContainer, clustersList } from './styles';
import { regions } from './utils/regions';

// test key
export const STRIPE_KEY = 'pk_test_DYtAxDRTg6cENksacX1zhE02';
// live key
// export const STRIPE_KEY = 'pk_live_ihb1fzO4h1ykymhpZsA3GaQR';

export default class ClusterPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			clustersAvailable: true,
			clusters: [],
		};
	}

	componentDidMount() {
		this.initClusters();
	}

	getFromPricing = (plan, key, provider = 'azure') => {
		const selectedPlan = Object.values(machineMarks[provider]).find(
			item => item.label === plan,
		);

		return (selectedPlan ? selectedPlan[key] : '-') || '-';
	};

	initClusters = () => {
		getClusters()
			.then((clusters) => {
				this.setState({
					clustersAvailable: !!clusters.length,
					clusters,
					isLoading: false,
				});

				clusters.every((cluster) => {
					if (cluster.status === 'in progress') {
						setTimeout(this.initClusters, 30000);
						return false;
					}
					return true;
				});
			})
			.catch((e) => {
				console.error(e);
				this.setState({
					isLoading: false,
				});
			});
	};

	handleToken = async (clusterId, token) => {
		try {
			await createSubscription(clusterId, token);
			this.setState({
				isLoading: true,
			});
			this.initClusters();
		} catch (e) {
			console.log('error bro', e);
		}
	};

	renderClusterRegion = (region, provider = 'azure') => {
		if (!region) return null;

		const { name, flag } = regions[provider][region];
		return (
			<div className="region-info">
				{flag && <img src={`/static/images/flags/${flag}`} alt={name} />}
				<span>{name}</span>
			</div>
		);
	};

	renderClusterCard = cluster => (
		<li key={cluster.name} className="cluster-card compact">
			<h3>
				{cluster.name}
				<span className="tag">
					{cluster.status === 'delInProg' ? 'deletion in progress' : cluster.status}
				</span>
			</h3>

			<div className="info-row">
				<div>
					<h4>Region</h4>
					{this.renderClusterRegion(cluster.region, cluster.provider)}
				</div>

				<div>
					<h4>Pricing Plan</h4>
					<div>{cluster.pricing_plan}</div>
				</div>

				<div>
					<h4>ES Version</h4>
					<div>{cluster.es_version}</div>
				</div>

				<div>
					<h4>Memory</h4>
					<div>
						{this.getFromPricing(cluster.pricing_plan, 'memory', cluster.provider)} GB
					</div>
				</div>

				<div>
					<h4>Disk Size</h4>
					<div>
						{this.getFromPricing(cluster.pricing_plan, 'storage', cluster.provider)} GB
					</div>
				</div>

				<div>
					<h4>Nodes</h4>
					<div>{cluster.total_nodes}</div>
				</div>

				{cluster.status === 'active' ? (
					<div>
						{cluster.trial || cluster.subscription_id ? (
							<Link to={`/clusters/${cluster.id}`}>
								<Button type="primary">View Details</Button>
							</Link>
						) : (
							<div>
								<p
									css={{
										fontSize: 12,
										lineHeight: '18px',
										color: '#999',
										margin: '-20px 0 12px 0',
									}}
								>
									Your regular payment is due for this cluster.
								</p>
								<Stripe
									name="Appbase.io Clusters"
									amount={(cluster.plan_rate || 0) * 100}
									token={token => this.handleToken(cluster.id, token)}
									disabled={false}
									stripeKey={STRIPE_KEY}
								>
									<Button>Pay now to access</Button>
								</Stripe>
							</div>
						)}
					</div>
				) : <div />}
			</div>
		</li>
	);

	renderClusterHeading = (text, length) => (length ? (
			<Divider>
				<b css={{ color: '#999', fontSize: '14px' }}>
					{text} - ({length})
				</b>
			</Divider>
		) : null);

	render() {
		const vcenter = {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: 'calc(100vh - 200px)',
			width: '100%',
			fontSize: '20px',
		};

		const { isLoading, clustersAvailable, clusters } = this.state;

		const deletedClusters = clusters.filter(cluster => cluster.status === 'deleted');
		const activeClusters = clusters.filter(cluster => cluster.status === 'active');
		const clustersInProgress = clusters.filter(
			cluster => cluster.status !== 'deleted' && cluster.status !== 'active',
		);

		if (isLoading) {
			return <Loader />;
		}

		if (!isLoading && !clustersAvailable) {
			return (
				<div style={vcenter}>
					<i className="fas fa-gift" style={{ fontSize: 36 }} />
					<h2 style={{ marginTop: 24, fontSize: 22 }}>
						You
						{"'"}
						ve unlocked 14 days free trial
					</h2>
					<p style={{ margin: '15px 0 20px', fontSize: 16 }}>
						Get started with clusters today
					</p>
					<div style={{ textAlign: 'center' }}>
						<Link to="/clusters/new">
							<Button type="primary">
								<i className="fas fa-plus" />
								&nbsp; Create a New Cluster
							</Button>
						</Link>
					</div>
				</div>
			);
		}

		return (
			<Fragment>
				<FullHeader />
				<Header>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col lg={18}>
							<h2>Welcome to Appbase Clusters</h2>

							<Row>
								<Col lg={18}>
									<p>
										This is your clusters manager view. Here, you can create a
										new cluster and manage your existing ones.
									</p>
								</Col>
							</Row>
						</Col>
						<Col
							lg={6}
							css={{
								display: 'flex',
								flexDirection: 'column-reverse',
								paddingBottom: 20,

								[mediaKey.small]: {
									paddingTop: 20,
								},
							}}
						>
							<Link to="/clusters/new">
								<Button size="large" type="primary" block>
									<Icon type="plus" /> Create a New Cluster
								</Button>
							</Link>
						</Col>
					</Row>
				</Header>
				<Container>
					<section className={clusterContainer}>
						<article>
							<h2>My Clusters</h2>

							{this.renderClusterHeading('Active Clusters', activeClusters.length)}
							{activeClusters.length ? (
								<ul className={clustersList}>
									{activeClusters.map(cluster => this.renderClusterCard(cluster))}
								</ul>
							) : null}

							{this.renderClusterHeading(
								'Clusters in progress',
								clustersInProgress.length,
							)}
							{clustersInProgress.length ? (
								<ul className={clustersList}>
									{clustersInProgress.map(cluster => this.renderClusterCard(cluster))}
								</ul>
							) : null}

							{this.renderClusterHeading('Deleted Clusters', deletedClusters.length)}
							{deletedClusters.length ? (
								<ul className={clustersList}>
									{deletedClusters.map(cluster => this.renderClusterCard(cluster))}
								</ul>
							) : null}
						</article>
					</section>
				</Container>
			</Fragment>
		);
	}
}
