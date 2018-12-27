import React from 'react';
import {
 Slider, InputNumber, Row, Col,
} from 'antd';
import PropTypes from 'prop-types';

export default class IntegerStep extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			inputValue: props.value || 1,
		};
	}

	onChange = (value) => {
		this.setState({
			inputValue: value,
		});

		const { onChange } = this.props;
		if (onChange) onChange(value);
	};

	render() {
		const { inputValue } = this.state;
		return (
			<Row>
				<Col span={12}>
					<Slider
						min={1}
						max={20}
						onChange={this.onChange}
						value={typeof inputValue === 'number' ? inputValue : 0}
					/>
				</Col>
				<Col span={4}>
					<InputNumber
						min={1}
						max={20}
						style={{ marginLeft: 16 }}
						value={inputValue}
						onChange={this.onChange}
					/>
				</Col>
			</Row>
		);
	}
}

IntegerStep.propTypes = {
	value: PropTypes.number.isRequired,
	onChange: PropTypes.func, // eslint-disable-line
};
