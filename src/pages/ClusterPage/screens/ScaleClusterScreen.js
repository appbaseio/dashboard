import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Button, notification, Alert } from 'antd';
import { connect } from 'react-redux';
import Stripe from 'react-stripe-checkout';
import { get } from 'lodash';

import IntegerStep from '../components/IntegerStep';
import { card } from '../styles';
import { scaleCluster, STRIPE_KEY } from '../utils';

const column = css`
	display: flex;
	flex: 1;
	flex-direction: row;
	align-items: center;
	padding: 0 20px;
`;

class ScaleClusterScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			nodes: props.nodes,
			defaultValue: props.nodes,
			isDirty: false,
		};
	}

	handleChange = nodes => {
		this.setState({
			nodes,
			isDirty: true,
		});
	};

	scaleCluster = () => {
		const { clusterId } = this.props;
		const { nodes } = this.state;
		this.setState({
			isDirty: false,
		});
		scaleCluster(clusterId, nodes)
			.then(res => {
				notification.success({
					message: 'Cluster scaling has started',
					description: res,
				});
			})
			.catch(e => {
				notification.error({
					message: "Cluster scaling couldn't be applied",
					description: e,
				});
				this.setState({
					isDirty: true,
				});
			});
	};

	render() {
		const { isDirty, nodes, defaultValue } = this.state;
		const {
			isUsingClusterTrial,
			cluster,
			toggleOverlay,
			handleToken,
		} = this.props;

		return (
			<div>
				<div className={card}>
					<div className="col light">
						<h3>Scale Cluster</h3>
						<p>Power up your cluster</p>
					</div>

					<div className={column}>
						{isUsingClusterTrial ? (
							<React.Fragment>
								<p style={{ margin: '0', width: '100%' }}>
									Scaling the cluster size requires an upgrade
									to a paid plan.
								</p>
								<Stripe
									name="Appbase.io Clusters"
									amount={(cluster.plan_rate || 0) * 100}
									token={token =>
										handleToken(cluster.id, token)
									}
									disabled={false}
									stripeKey={STRIPE_KEY}
									closed={toggleOverlay}
								>
									<Button
										type="primary"
										onClick={toggleOverlay}
									>
										Upgrade Now
									</Button>
								</Stripe>
							</React.Fragment>
						) : (
							<IntegerStep
								defaultValue={defaultValue}
								value={nodes}
								onChange={this.handleChange}
							/>
						)}
					</div>
				</div>

				<div css={{ display: 'flex', flexDirection: 'row-reverse' }}>
					{isUsingClusterTrial ? null : (
						<Button
							size="large"
							icon="save"
							type="primary"
							disabled={!isDirty}
							onClick={this.scaleCluster}
						>
							Apply Changes
						</Button>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isUsingClusterTrial: get(state, '$getUserPlan.cluster_trial') || false,
});

export default connect(mapStateToProps, null)(ScaleClusterScreen);
