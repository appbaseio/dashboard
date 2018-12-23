import React, { Component, Fragment } from 'react';
import { Button, Icon } from 'antd';
import { Link } from 'react-router-dom';

import FullHeader from '../../components/FullHeader';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import { getClusterData } from './utils';
import { clusterContainer } from './styles';

export default class ExploreCluster extends Component {
	constructor(props) {
		super(props);
		const arc = props.location.state ? props.location.state.arc : null;

		this.state = {
			arc,
			isLoading: !arc,
			error: null,
		};
	}

	componentDidMount() {
		if (!this.state.arc) {
			this.init();
		}
	}

	init = () => {
		getClusterData(this.props.match.params.id)
			.then((res) => {
				const { cluster, deployment } = res;
				if (cluster && deployment) {
					this.setState({
						arc: this.getAddon('arc', deployment) || null,
						isLoading: false,
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
			.catch((e) => {
				this.setState({
					isLoading: false,
					error: e,
				});
			});
	};

	getAddon = (item, source) => source.addons.find(key => key.name === item);

	renderErrorScreen = message => (
		<Fragment>
			<FullHeader isCluster cluster={this.props.match.params.id} />
			<Container>
				<section
					className={clusterContainer}
					style={{ textAlign: 'center', paddingTop: 40 }}
				>
					<article>
						<Icon css={{ fontSize: 42 }} type="frown" theme="outlined" />
						<h2>Some error occurred</h2>
						<p>{this.state.error || message}</p>
						<div style={{ marginTop: 30 }}>
							<Link to={`/clusters/${this.props.match.params.id}`}>
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

		const arcURL = this.state.arc.url ? this.state.arc.url.slice(0, -1) : '';
		const url = `https://arc-dashboard-dev.netlify.com/?url=${arcURL}&username=${
			this.state.arc.username
		}&password=${this.state.arc.password}&header=false`;

		return (
			<Fragment>
				<FullHeader cluster={this.props.match.params.id} />
				<iframe
					src={url}
					frameBorder="0"
					width="100%"
					height={`${window.innerHeight - 60}px`}
				/>
			</Fragment>
		);
	}
}
