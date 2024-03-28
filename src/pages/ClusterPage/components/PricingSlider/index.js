import React, { Component, Fragment } from 'react';
import { Slider } from 'antd';
import AnimatedNumber from 'react-animated-number';
import PropTypes from 'prop-types';
import SubscriptionDetails from './SubscriptionDetails';
import { clusterInfo } from '../../styles';

class PricingSlider extends Component {
	static propTypes = {
		marks: PropTypes.arrayOf(PropTypes.number.isRequired),
		onChange: PropTypes.func.isRequired,
		currValue: PropTypes.number.isRequired,
		showNoCardNeeded: PropTypes.bool,
		sliderProps: PropTypes.object,
	};

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

		const trialDays = {
			0: 14,
			50: 7,
			100: 3,
		};

		this.state = { marks, active, value: 0, trialDays };
	}

	onChange = active => {
		const { onChange, marks } = this.props;
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
		// snap to nearest value
		onChange(marks[active], active);
	};

	componentDidMount = () => {
		const { currValue } = this.props;
		this.onChange(currValue);
	};

	render() {
		const { marks, active, value, trialDays } = this.state;
		console.log('marks', marks, 'active', active, 'value', value); // eslint-disable-line no-console
		const mark = marks[active] || {};
		const { sliderProps } = this.props;
		return (
			<Fragment>
				<div className="col grow expanded">
					<Slider
						style={{
							marginBottom: '40px',
						}}
						marks={marks}
						onChange={this.onChange}
						defaultValue={value}
						step={null}
						tooltipVisible={false}
						value={value}
						{...sliderProps}
					/>
					<SubscriptionDetails
						startDate="Jan 23"
						firstInvoiceDate="Feb 23"
						trialDays={trialDays[active]}
						trialEndDate="Jan 31"
					/>
				</div>
				<div className="col grey">
					<div className={clusterInfo}>
						<div
							className="cluster-info__item"
							style={{ width: '100%' }}
						>
							<div>
								<AnimatedNumber
									value={mark.nodes}
									duration={100}
									stepPrecision={0}
								/>{' '}
								{mark.nodes === 1 ? 'Node' : 'Nodes'}
							</div>
							<div>{mark.nodes >= 3 ? 'HA' : ''}</div>
						</div>
						<div className="cluster-info__item">
							<div>
								<AnimatedNumber
									value={mark.memory * mark.nodes}
									duration={100}
									stepPrecision={0}
								/>{' '}
								GB
							</div>
							<div>Memory</div>
						</div>
						<div className="cluster-info__item">
							<div>
								<AnimatedNumber
									value={mark.cpu * mark.nodes}
									duration={100}
									stepPrecision={0}
								/>{' '}
							</div>
							<div>CPUs</div>
						</div>
						<div className="cluster-info__item">
							<div>
								<AnimatedNumber
									value={mark.storage}
									duration={100}
									stepPrecision={0}
								/>{' '}
								GB
							</div>
							<div>Storage (SSD)</div>
						</div>
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
								/mo
							</div>
							<h3>Estimated Cost</h3>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default PricingSlider;
