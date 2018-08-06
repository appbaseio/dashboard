import React, { Component } from 'react';
import { func, number } from 'prop-types';
import styled from 'react-emotion';
import { PlusCircle, MinusCircle } from 'react-feather';

const Switcher = styled('div')`
	display: flex;
	margin: 0 auto;
	padding: 10px;
	max-width: 126px;
	justify-content: space-between;
	align-items: center;
	background: #ffffff;
	border-radius: 25px;
	text-align: center;
	color: #232e44;
`;

export default class PlusMinus extends Component {
	state = { values: [], selectedValueIndex: 0 };
	componentWillReceiveProps(nextProps) {
		this.setState(prevState => ({
			values: nextProps.values,
			selectedValueIndex: nextProps.selected || prevState.selectedValueIndex,
		}));
	}

	handleRecordsMinus = () => {
		const { handleMinus, selected, onChange } = this.props;
		const { selectedValueIndex = selected } = this.state;
		const index = selectedValueIndex <= 0 ? selectedValueIndex : selectedValueIndex - 1;

		this.setState({
			selectedValueIndex: index,
		});
		if (handleMinus) {
			handleMinus(this.state.values[index], index);
		}
		if (onChange) {
			onChange(this.state.values[index], index, 'minus');
		}
	};

	handleRecordsPlus = () => {
		const { handlePlus, onChange } = this.props;
		const { selectedValueIndex } = this.state;

		const index =
			selectedValueIndex >= this.state.values.length - 1
				? selectedValueIndex
				: selectedValueIndex + 1;
		if (handlePlus) {
			handlePlus(this.state.values[index], index);
		}

		if (onChange) {
			onChange(this.state.values[index], index, 'plus');
		}

		this.setState({
			selectedValueIndex: index,
		});
	};

	render() {
		const { values, selectedValueIndex } = this.state;
		return (
			<Switcher>
				<MinusCircle
					color="#FFFFFF"
					fill="#1A74FF"
					css={{ cursor: 'pointer' }}
					onClick={this.handleRecordsMinus}
				/>
				<span>{values[selectedValueIndex]}</span>
				<PlusCircle
					color="#FFFFFF"
					fill="#1A74FF"
					css={{ cursor: 'pointer' }}
					onClick={this.handleRecordsPlus}
				/>
			</Switcher>
		);
	}
}

PlusMinus.propTypes = {
	handleMinus: func,
	handlePlus: func,
	selected: number,
	onChange: func,
};
