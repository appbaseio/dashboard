import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import { SaveOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { connect } from 'react-redux';
import { get } from 'lodash';

import IntegerStep from '../components/IntegerStep';
import StripeCheckout from '../../../components/StripeCheckout';

import { card } from '../styles';
import { scaleCluster, PLAN_LABEL, EFFECTIVE_PRICE_BY_PLANS } from '../utils';

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
			isStripeCheckoutOpen: false,
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

	handleStripeModal = () => {
		this.setState(currentState => ({
			isStripeCheckoutOpen: !currentState.isStripeCheckoutOpen,
		}));
	};

	handleStripeSubmit = data => {
		const { handleStripeSubmit, clusterId } = this.props;
		this.setState({ isStripeCheckoutOpen: false });

		handleStripeSubmit({ clusterId, ...data });
	};

	render() {
		const {
			isDirty,
			nodes,
			defaultValue,
			isStripeCheckoutOpen,
		} = this.state;
		const { isUsingClusterTrial, cluster } = this.props;

		return (
			<div>
				<div className={card}>
					<div className="col light">
						<h3>Scale Cluster</h3>
						<p>Power up your cluster</p>
					</div>

					<div className={column}>
						{isUsingClusterTrial &&
						get(cluster, 'subscription_id') !== '' ? (
							<React.Fragment>
								{isStripeCheckoutOpen && (
									<StripeCheckout
										visible={isStripeCheckoutOpen}
										onCancel={this.handleStripeModal}
										plan={PLAN_LABEL[cluster.pricing_plan]}
										price={EFFECTIVE_PRICE_BY_PLANS[
											cluster.pricing_plan
										].toString()}
										monthlyPrice={PRICE_BY_PLANS[
											cluster.pricing_plan
										].toString()}
										onSubmit={this.handleStripeSubmit}
									/>
								)}
								<p style={{ margin: '0', width: '100%' }}>
									Scaling the cluster size requires an upgrade
									to a paid plan.
								</p>
								<Button
									type="primary"
									onClick={this.handleStripeModal}
								>
									Upgrade Now
								</Button>
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
							icon={<SaveOutlined />}
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

ScaleClusterScreen.propTypes = {
	isUsingClusterTrial: PropTypes.bool.isRequired,
	cluster: PropTypes.object.isRequired,
	clusterId: PropTypes.string.isRequired,
	nodes: PropTypes.number.isRequired,
	handleStripeSubmit: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, null)(ScaleClusterScreen);
