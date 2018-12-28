import React from 'react';
import {
 Slider, InputNumber, Row, Col,
} from 'antd';
import PropTypes from 'prop-types';

export default class IntegerStep extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			inputValue: props.defaultValue || 1,
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
			<Row css={{ width: '100%' }}>
				<Col span={12}>
					<Slider
						min={1}
						max={5}
						onChange={this.onChange}
						value={typeof inputValue === 'number' ? inputValue : 0}
					/>
				</Col>
				<Col span={4}>
					<InputNumber
						min={1}
						max={5}
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
	defaultValue: PropTypes.number.isRequired,
	onChange: PropTypes.func, // eslint-disable-line
};
