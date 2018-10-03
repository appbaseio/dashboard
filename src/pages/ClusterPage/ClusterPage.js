import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import {
 Row, Col, Icon, Button,
} from 'antd';

import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';
import Container from '../../components/Container';
import Loader from '../../components/Loader';

import { getClusters } from './utils';
import { machineMarks } from './new';
import { mediaKey } from '../../utils/media';
import { clusterContainer, clustersList } from './styles';
import { regions } from './utils/regions';

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

	getFromPricing = (plan, key) => {
		const selectedPlan = Object.values(machineMarks).find(item => item.label === plan);

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

	renderClusterRegion = (region) => {
		if (!region) return null;

		const { name, flag } = regions[region];
		return (
			<div className="region-info">
				<img src={`/static/images/flags/${flag}`} alt={name} />
				<span>{name}</span>
			</div>
		);
	};

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

							<ul className={clustersList}>
								{clusters.map(cluster => (
									<li key={cluster.name} className="cluster-card compact">
										<h3>
											{cluster.name}
											<span className="tag">
												{cluster.status === 'delInProg'
													? 'deletion in progress'
													: cluster.status}
											</span>
										</h3>

										<div className="info-row">
											<div>
												<h4>Region</h4>
												{this.renderClusterRegion(cluster.region)}
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
													{this.getFromPricing(
														cluster.pricing_plan,
														'memory',
													)}{' '}
													GB
												</div>
											</div>

											<div>
												<h4>Disk Size</h4>
												<div>
													{this.getFromPricing(
														cluster.pricing_plan,
														'storage',
													)}{' '}
													GB
												</div>
											</div>

											<div>
												<h4>Nodes</h4>
												<div>{cluster.total_nodes}</div>
											</div>

											<div>
												<Link to={`/clusters/${cluster.id}`}>
													<Button type="primary">View Details</Button>
												</Link>
											</div>
										</div>
									</li>
								))}
							</ul>
						</article>
					</section>
				</Container>
			</Fragment>
		);
	}
}
