import React from 'react';
import { Icon, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import styles from './styles';
import Grid from './Grid';
import Flex from './../../../shared/Flex';
import { Suggestions, getSuggestionCode, ipValidator } from './utils';

class WhiteList extends React.Component {
	constructor(props) {
		super(props);
		this.inputRef = undefined;
		this.state = {
			text: undefined,
		};
	}
	handleSelectOption = (value) => {
		this.setState((prevState) => {
			const { control } = this.props;
			if (value && !control.value.includes(value)) {
				control.onChange([...control.value, value]);
				return {
					text: undefined,
				};
			}
			return prevState;
		});
	};
	hanldeOnChange = (value) => {
		this.setState({
			text: value,
		});
	};
	handleOnSearch = (value) => {
		if (!(value && value.length === 1 && value[0] === '*')) {
			this.setState({
				text: value.trim(),
			});
		}
	};
	removeItem = (item) => {
		const { control } = this.props;
		const { value } = control;
		const index = value.indexOf(item);
		if (index > -1) {
			value.splice(index, 1);
			control.onChange(value);
		}
	};
	submitOnBlur = () => {
		if (!this.props.control.value.includes(this.state.text)) {
			if (ipValidator(this.state.text)) {
				this.props.control.onChange([...this.props.control.value, this.state.text]);
				this.setState({
					text: undefined,
				});
			} else if (this.state.text) {
				this.props.control.setErrors({ invalidIP: true });
			} else {
				this.props.control.setErrors(undefined);
			}
		}
	};
	render() {
		const {
			label,
			inputProps,
			defaultSuggestionValue,
			control: { value, handler, hasError },
			type,
		} = this.props;
		const { text } = this.state;
		return (
			<Grid
				label={<span css={styles.subHeader}>{label}</span>}
				component={
					<Flex css="width: 100%;position: relative" flexDirection="column">
						{value.map(item => (
							<Flex
								key={item}
								justifyContent="space-between"
								css={styles.addedWhiteList}
							>
								<div>
									<div>{item}</div>
									{type === 'dropdown' && (
										<div css="font-size: 12px;font-weight: normal">
											{Suggestions[getSuggestionCode(item)].description}
										</div>
									)}
								</div>
								<div css="cursor:pointer">
									<Icon
										onClick={() => this.removeItem(item)}
										type="close-circle-o"
									/>
								</div>
							</Flex>
						))}
						<div>
							{type === 'dropdown' ? (
								<Select
									showSearch
									{...inputProps}
									{...handler()}
									value={text}
									onSearch={this.handleOnSearch}
									onSelect={this.handleSelectOption}
									onBlur={this.handleSelectOption}
									defaultActiveFirstOption={!!text}
									showArrow={false}
									filterOption={false}
									style={{ width: '100%' }}
								>
									{Object.keys(Suggestions).map((k) => {
										const suggestion = Suggestions[k];
										if (text && text.length > 1) {
											const suggestionValue = `${suggestion.prefix}${text}${
												suggestion.suffix
											}`;
											return (
												<Select.Option key={suggestionValue}>
													<Flex justifyContent="space-between">
														<span>{suggestionValue}</span>
														<span css={styles.description}>
															{suggestion.description}
														</span>
													</Flex>
												</Select.Option>
											);
										}
										return (
											<Select.Option css="pointer-events: none" key={k}>
												<Flex
													justifyContent="space-between"
													css="color: #d9d9d9;font-weight: 100;font-size: 12px"
												>
													<span>
														{suggestion.prefix}
														{defaultSuggestionValue}
														{suggestion.suffix}
													</span>
													<span css={styles.description}>
														{suggestion.description}
													</span>
												</Flex>
											</Select.Option>
										);
									})}
								</Select>
							) : (
								<Input
									{...inputProps}
									{...handler()}
									value={text}
									onChange={(e) => {
										this.hanldeOnChange(e.target.value);
									}}
									onBlur={this.submitOnBlur}
									onKeyPress={(event) => {
										if (event.key === 'Enter') {
											this.submitOnBlur();
										}
									}}
								/>
							)}
							{hasError('invalidIP') && <div css={styles.error}>Invalid IP</div>}
						</div>
					</Flex>
				}
			/>
		);
	}
}
WhiteList.propTypes = {
	label: PropTypes.string,
	inputProps: PropTypes.object,
	defaultSuggestionValue: PropTypes.string,
	control: PropTypes.object,
	type: PropTypes.oneOf(['dropdown']),
};
export default WhiteList;
