import React from 'react';
import { Icon, Input, Select } from 'antd';
import styles from './styles';
import Grid from './Grid';
import Flex from './../../../shared/Flex';

const Suggestions = {
	1: {
		prefix: '',
		suffix: '',
		description: 'Matches exactly',
	},
	2: {
		prefix: '',
		suffix: '*',
		description: 'Matches refers starting with',
	},
	3: {
		prefix: '*',
		suffix: '',
		description: 'Matches refers ending with',
	},
	4: {
		prefix: '*',
		suffix: '*',
		description: 'Matches refers containing',
	},
};
const getSuggestionCode = (str) => {
	if (str.startsWith('*') && str.endsWith('*')) {
		return 4;
	}
	if (str.startsWith('*')) {
		return 2;
	}
	if (str.endsWith('*')) {
		return 3;
	}
	return 1;
};
const ipValidator = (value) => {
	const splitIp = value.split('/');
	if (
		/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(splitIp[0])
	) {
		const parsedNumber = parseInt(splitIp[1], 10);
		if (parsedNumber > -1 && parsedNumber < 256) {
			return true;
		}
		return false;
	}
	return false;
};
class WhiteList extends React.Component {
	constructor(props) {
		super(props);
		this.inputRef = undefined;
		this.state = {
			isFocused: false,
			selectedSuggestion: 1,
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
	selectOption = (key) => {
		this.setState({
			selectedSuggestion: key,
		});
	};
	handleFocus = () => {
		this.setState({
			isFocused: true,
		});
	};
	handleBlur = () => {
		setTimeout(
			() =>
				this.setState({
					isFocused: false,
				}),
			100,
		);
	};
	hanldeOnChange = (value) => {
		this.setState({
			text: value,
		});
	};
	handleOnSearch = (value) => {
		this.setState({
			text: value.replace('*', '').trim(),
		});
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
					text: '',
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
			// defaultValue,
			control: { value, handler, hasError },
			type,
		} = this.props;
		const { text } = this.state;
		return (
			<Grid
				label={<span css={styles.subHeader}>{label}</span>}
				component={
					<Flex css="width: 100%;position: relative" flexDirection="column">
						{/* {defaultValue && (
							<div key={defaultValue.value} css={styles.addedWhiteList}>
								<div>{defaultValue.value}</div>
								<div css="font-size: 12px;font-weight: normal">
									{defaultValue.description}
								</div>
							</div>
						)} */}
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
										if (text) {
											const suggestionValue = `${
												suggestion.prefix
											}${text}${suggestion.suffix}`;
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
							{this.state.isFocused && (
								<div css={styles.serachResultsCls}>
									{Object.keys(Suggestions).map((k, index) => {
										const suggestion = Suggestions[k];
										const isSelected =
											index === this.state.selectedSuggestion - 1;
										return text ? (
											<Flex
												onClick={() => this.handleSelectOption()}
												onMouseOver={() => this.selectOption(k)}
												onFocus={() => this.selectOption(k)}
												justifyContent="space-between"
												key={k}
												css={`
													background-color: ${isSelected && '#83a2ee'};
													color: ${isSelected ? '#fff' : '#d9d9d9'};
													padding: 5px 10px;
													font-weight: 100;
													cursor: pointer;
													font-size: 12px;
												`}
											>
												<span
													css={`
														color: ${isSelected ? '#fff' : 'black'};
													`}
												>
													{suggestion.prefix}
													{text}
													{suggestion.suffix}
												</span>
												<span css={styles.description}>
													{suggestion.description}
												</span>
											</Flex>
										) : (
											<Flex
												justifyContent="space-between"
												key={k}
												css="padding: 5px 10px;color: #d9d9d9;font-weight: 100;font-size: 12px"
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
										);
									})}
								</div>
							)}
						</div>
					</Flex>
				}
			/>
		);
	}
}

export default WhiteList;
