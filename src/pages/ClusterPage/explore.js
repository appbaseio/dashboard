import React, { Component, Fragment } from 'react';
import { Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import get from 'lodash/get';

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
		const arc = get(props, 'location.state.arc', null);
		const cluster = get(props, 'location.state.cluster', null);

		this.state = {
			arc,
			isLoading: !arc,
			error: null,
			isFrameLoading: false,
			cluster,
		};
	}

	componentDidMount() {
		if (!this.state.arc) {
			this.init();
		}
	}

	init = () => {
		getClusterData(get(this, 'props.match.params.id'))
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
				cluster={get(this, 'props.match.params.id')}
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
								to={`/clusters/${get(
									this,
									'props.match.params.id',
								)}`}
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

		const arcURL = get(this, 'state.arc.url', '').slice(0, -1);
		let mainURL = 'https://dash.appbase.io';
		let arcParams = '';

		if (urlParams) {
			const { view, ...otherParams } = urlParams;
			if (view && !get(otherParams, 'insights-id')) {
				const nestedRoute = view.startsWith('/')
					? view.replace('/', '')
					: view;

				mainURL = `${mainURL}/${nestedRoute}`;
			}

			const insightsId = get(otherParams, 'insights-id');
			if (insightsId) {
				arcParams = `&insights-id=${get(
					otherParams,
					'insights-id',
				)}&insights-sidebar=true`;

				mainURL = `${mainURL}/cluster/analytics`;
			}
		}
		const url = `${mainURL}/?url=${arcURL}&username=${get(
			this,
			'state.arc.username',
		)}&password=${get(this, 'state.arc.password')}&cluster=${get(
			this,
			'state.cluster',
		)}&showHelpChat=false&showProfile=false${arcParams}`;

		return (
			<Fragment>
				<FullHeader
					isCluster
					cluster={get(this, 'props.match.params.id')}
					trialMessage="You are currently on a free 14-day trial. Once this expires, you will have to upgrade to a paid plan to continue accessing the cluster. The cluster will be removed after a trial expires."
				/>
				{this.state.isFrameLoading && <Loader />}
				<Frame
					src={url}
					id="cluster"
					frameBorder="0"
					width="100%"
					height={`${window.innerHeight - 65}px`}
					onLoad={this.frameLoaded}
					data-hj-allow-iframe=""
				/>
			</Fragment>
		);
	}
}
