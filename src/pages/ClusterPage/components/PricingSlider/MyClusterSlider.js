import React, { Component, Fragment } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Slider, Tooltip } from 'antd';
import AnimatedNumber from 'react-animated-number';
import get from 'lodash/get';

import { array, bool, func, object } from 'prop-types';
import { clusterInfo } from '../../styles';

export default class PricingSlider extends Component {
	constructor(props) {
		super(props);

		const marks = JSON.parse(JSON.stringify(props.marks));
		let active = 0;

		Object.keys(marks).forEach((key, index) => {
			if (index === 0) {
				active = key;
			}
			marks[key].style = Object.assign(marks[key] || {}, {
				marginTop: '15px',
				fontSize: '14px',
				color: '#232E44',
			});
		});

		this.state = { marks, active, value: 0 };
	}

	onChange = active => {
		const { marks } = this.state;
		const keys = Object.keys(marks).map(number => Number(number));

		let firstKey;
		let lastKey;
		let finalKey;

		keys.forEach((key, index) => {
			if (key <= active) {
				firstKey = index;
			}
		});

		if (firstKey + 1 < keys.length) {
			lastKey = firstKey + 1;
		} else {
			lastKey = -1;
		}

		if (lastKey && lastKey !== -1) {
			const temp = (keys[lastKey] + keys[firstKey]) / 2;
			finalKey = active <= temp ? firstKey : lastKey;
		} else {
			finalKey = firstKey;
		}

		this.setState({
			active: keys[finalKey],
			value: active,
		});
	};

	onAfterChange = () => {
		const { active } = this.state;
		const { onChange, marks } = this.props;
		// snap to nearest value
		this.setState({ value: active });
		onChange(marks[active]);
	};

	render() {
		const { marks, active, value } = this.state;
		const mark = get(marks, active, {});
		const {
			sliderProps,
			showPPH,
			showNodesSupported,
			customCardNode,
		} = this.props;

		return (
			<Fragment>
				<div className="col grow expanded">
					<Slider
						marks={marks}
						onChange={this.onChange}
						onAfterChange={this.onAfterChange}
						defaultValue={value}
						step={null}
						tooltipVisible={false}
						{...sliderProps}
					/>
				</div>
				{customCardNode ? (
					customCardNode(mark)
				) : (
					<div className="col grey">
						<div className={clusterInfo}>
							{showPPH ? (
								<div className="cluster-info__item">
									<div>
										$
										<AnimatedNumber
											value={mark.pph}
											duration={100}
											stepPrecision={0}
										/>
									</div>
									<div>Price per hour</div>
								</div>
							) : null}
							{showNodesSupported ? (
								<div className="cluster-info__item">
									<Tooltip title="Node refers to the total ElasticSearch nodes. As your underlying node count changes, the pricing plan updates dynamically. Learn More">
										<div>
											<AnimatedNumber
												value={mark.nodes}
												duration={100}
												stepPrecision={0}
											/>{' '}
											{mark.nodes === 1
												? 'Node'
												: 'Nodes'}
											<QuestionCircleOutlined
												style={{
													size: 14,
													marginLeft: 5,
												}}
											/>
										</div>
									</Tooltip>
									<div>Supported</div>
								</div>
							) : null}
						</div>
						<div className={clusterInfo}>
							<div>
								<div className="price">
									<span>$</span>
									<AnimatedNumber
										value={mark.cost}
										duration={100}
										stepPrecision={0}
									/>{' '}
									{mark.nodes === 1 ? 'Node' : 'Nodes'}
									<QuestionCircleOutlined
										style={{ size: 14, marginLeft: 5 }}
									/>
								</div>
								<h3>Estimated Cost</h3>
							</div>
						</div>
						<div style={{ marginTop: '20px' }}>
							{this.props.showNoCardNeeded && (
								<code>No card needed for the trial</code>
							)}
						</div>
					</div>
				)}
			</Fragment>
		);
	}
}

PricingSlider.defaultProps = {
	showPPH: true,
	showNodesSupported: true,
	showNoCardNeeded: false,
	sliderProps: {},
};

PricingSlider.propTypes = {
	sliderProps: object,
	showPPH: bool,
	showNodesSupported: bool,
	showNoCardNeeded: bool,
	customCardNode: func,
	onChange: func,
	marks: array,
};
