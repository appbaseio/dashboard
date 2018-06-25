import React, { Component, Fragment } from 'react';
import AnimatedNumber from 'react-animated-number';
import Slider from 'rc-slider/lib/Slider';

export default class PricingSlider extends Component {
	constructor(props) {
		super(props);
		const { marks } = props;
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

	onChange = (active) => {
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
		// snap to nearest value
		this.setState({ value: this.state.active });
	};

	render() {
		const { marks, active, value } = this.state;
		const mark = marks[active] || {};
		return (
			<Fragment>
				<div className="col grow" style={{ padding: '55px 70px 0 55px' }}>
					<Slider
						marks={marks}
						onChange={this.onChange}
						onAfterChange={this.onAfterChange}
						value={value}
					/>
				</div>
				<div className="col grey" style={{ width: 300 }}>
					<div className="cluster-info">
						<div className="cluster-info__item">
							<div>
								<AnimatedNumber
									value={mark.storage}
									duration={100}
									stepPrecision={0}
								/> GB
							</div>
							<div>Storage (SSD)</div>
						</div>
						<div className="cluster-info__item">
							<div>
								<AnimatedNumber
									value={mark.memory}
									duration={100}
									stepPrecision={0}
								/> GB
							</div>
							<div>Memory</div>
						</div>
						<div className="cluster-info__item">
							<div>
								<AnimatedNumber
									value={mark.nodes}
									duration={100}
									stepPrecision={0}
								/> Nodes
							</div>
							<div>HA</div>
						</div>
					</div>
					<div className="cluster-info">
						<div>
							<div className="price">
								<span>$</span>
								<AnimatedNumber
									value={mark.cost}
									duration={100}
									stepPrecision={0}
								/> /mo
							</div>
							<h3>Estimated Cost</h3>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}
