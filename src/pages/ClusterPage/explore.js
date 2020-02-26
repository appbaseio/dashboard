import React, { Component, Fragment } from 'react';
import { Button, Icon } from 'antd';
import { Link } from 'react-router-dom';

import FullHeader from '../../components/FullHeader';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import { getClusterData } from './utils';
import { clusterContainer } from './styles';
import Frame from '../../components/Frame';
import { getUrlParams } from '../../utils/helper';

export default class ExploreCluster extends Component {
	constructor(props) {
		super(props);
		const arc = props.location.state ? props.location.state.arc : null;
		const cluster = props.location.state
			? props.location.state.cluster
			: null;
		const isClusterBilling = props.location.state
			? props.location.state.isClusterBilling
			: null;
		this.state = {
			arc,
			isLoading: !arc,
			error: null,
			isFrameLoading: false,
			cluster,
			isClusterBilling,
		};
	}

	componentDidMount() {
		if (!this.state.arc) {
			this.init();
		}
	}

	init = () => {
		getClusterData(this.props.match.params.id)
			.then(res => {
				const { cluster, deployment } = res;
				if (cluster && deployment) {
					this.setState({
						arc: this.getAddon('arc', deployment) || null,
						isLoading: false,
						cluster: cluster.name,
					});

					if (cluster.status === 'in progress') {
						setTimeout(this.init, 30000);
					}
				} else {
					this.setState({
						isLoading: false,
					});
				}
			})
			.catch(e => {
				this.setState({
					isLoading: false,
					error: e,
				});
			});
	};

	getAddon = (item, source) => source.addons.find(key => key.name === item);

	renderErrorScreen = message => (
		<Fragment>
			<FullHeader
				isCluster
				cluster={this.props.match.params.id}
				trialMessage="You are currently on a free 14-day trial. Once this expires, you will have to upgrade to a paid plan to continue accessing the cluster. The cluster will be removed after a trial expires."
			/>
			<Container>
				<section
					className={clusterContainer}
					style={{ textAlign: 'center', paddingTop: 40 }}
				>
					<article>
						<Icon
							css={{ fontSize: 42 }}
							type="frown"
							theme="outlined"
						/>
						<h2>Some error occurred</h2>
						<p>{this.state.error || message}</p>
						<div style={{ marginTop: 30 }}>
							<Link
								to={`/clusters/${this.props.match.params.id}`}
							>
								<Button size="large" icon="arrow-left">
									Go Back
								</Button>
							</Link>
						</div>
					</article>
				</section>
			</Container>
		</Fragment>
	);

	frameLoaded = () => {
		this.setState({
			isFrameLoading: false,
		});
	};

	render() {
		if (!this.state.arc) {
			if (this.state.isLoading) {
				return <Loader />;
			}
			return this.renderErrorScreen('No Deployment Found');
		}

		if (this.state.error) {
			return this.renderErrorScreen();
		}
		const { location } = this.props;
		const urlParams = getUrlParams(location.search);

		const arcURL = this.state.arc.url
			? this.state.arc.url.slice(0, -1)
			: '';
		let mainURL = this.state.isClusterBilling
			? 'https://arc-dashboard.appbase.io/cluster/billing'
			: 'https://arc-dashboard.appbase.io';

		if (urlParams && urlParams.view) {
			const nestedRoute = urlParams.view.startsWith('/')
				? urlParams.view.replace('/', '')
				: urlParams.view;

			mainURL = `${mainURL}/${nestedRoute}`;
		}
		const url = `${mainURL}/?clusterId=${this.props.match.params.id}&url=${arcURL}&username=${this.state.arc.username}&password=${this.state.arc.password}&cluster=${this.state.cluster}&header=false&showHelpChat=false`;

		return (
			<Fragment>
				<FullHeader
					isCluster
					cluster={this.props.match.params.id}
					trialMessage="You are currently on a free 14-day trial. Once this expires, you will have to upgrade to a paid plan to continue accessing the cluster. The cluster will be removed after a trial expires."
				/>
				{this.state.isFrameLoading && <Loader />}
				<Frame
					src={url}
					id="cluster"
					frameBorder="0"
					width="100%"
					height={`${window.innerHeight - 60}px`}
					onLoad={this.frameLoaded}
				/>
			</Fragment>
		);
	}
}
