import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Button, notification } from 'antd';

import IntegerStep from '../components/IntegerStep';
import { card } from '../styles';
import { scaleCluster } from '../utils';

const column = css`
	display: flex;
	flex: 1;
	flex-direction: row;
	align-items: center;
	padding: 0 20px;
`;

export default class ScaleClusterScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			nodes: props.nodes,
			isDirty: false,
		};
	}

	handleChange = (nodes) => {
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
			.then((res) => {
				notification.success({
					message: 'Cluster Scaling Successful',
					description: res,
				});
			})
			.catch((e) => {
				notification.error({
					message: 'Cluster Scaling Failed',
					description: e,
				});
				this.setState({
					isDirty: true,
				});
			});
	};

	render() {
		const { isDirty, nodes } = this.state;
		return (
			<div>
				<div className={card}>
					<div className="col light">
						<h3>Scale Cluster</h3>
						<p>Power up your cluster</p>
					</div>

					<div className={column}>
						<IntegerStep defaultValue={nodes} onChange={this.handleChange} />
					</div>
				</div>

				<div css={{ display: 'flex', flexDirection: 'row-reverse' }}>
					<Button
						size="large"
						icon="save"
						type="primary"
						disabled={!isDirty}
						onClick={this.scaleCluster}
					>
						Apply Changes
					</Button>
				</div>
			</div>
		);
	}
}
