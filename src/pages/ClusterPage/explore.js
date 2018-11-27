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

		this.state = {
			arc: props.location.state.arc || null,
			isLoading: !props.location.state.arc,
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
					const addon = this.getAddon('arc', deployment);
					this.setState({
						arc: addon ? addon.arc : null,
					});

					if (cluster.status === 'in progress') {
						setTimeout(this.init, 30000);
					}
				}

				this.setState({
					isLoading: false,
				});
			})
			.catch((e) => {
				this.setState({
					error: e,
				});
			});
	};

	getAddon = (item, source) => source.addons.find(key => key.name === item);

	renderErrorScreen = () => (
		<Fragment>
			<FullHeader />
			<Container>
				<section
					className={clusterContainer}
					style={{ textAlign: 'center', paddingTop: 40 }}
				>
					<article>
						<Icon css={{ fontSize: 42 }} type="frown" theme="outlined" />
						<h2>Some error occurred</h2>
						<p>{this.state.error}</p>
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
			return 'No Deployment Found';
		}

		if (this.state.error) {
			return this.renderErrorScreen();
		}

		const arcURL = this.state.arc.url ? this.state.arc.url.slice(0, -1) : '';
		const url = `https://arc-dashboard-dev.netlify.com/?url=${arcURL}&username=${
			this.state.arc.username
		}&password=${this.state.arc.password}`;

		return (
			<Fragment>
				<iframe src={url} frameBorder="0" width="100%" height={`${window.innerHeight}px`} />
			</Fragment>
		);
	}
}
