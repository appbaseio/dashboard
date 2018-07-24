import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Input, Checkbox, Radio, Tooltip, Button, Select } from 'antd';
import { FormBuilder, Validators, FieldGroup, FieldControl } from 'react-reactive-form';
import styles from './styles';
import { Button as UpgradeButton } from './../../../../modules/batteries/components/Mappings/styles';
import Grid from './Grid';
import Flex from './../../../shared/Flex';
import { hoverMessage, fieldMessage, ttlMessage, ipLimitMessage } from './../../../utils/messages';
import { traverseMapping } from './../../../utils/mappings';
import { Types, aclOptions, aclOptionsLabel, defaultAclOptions } from './utils';
import WhiteList from './WhiteList';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
class CreateCredentials extends React.Component {
	constructor(props) {
		super(props);
		this.form = FormBuilder.group({
			description: Types.read.description,
			operationType: [Types.read, Validators.required],
			acl: [{ value: defaultAclOptions, disabled: !props.isPaidUser }, Validators.required],
			referers: [{ value: [], disabled: !props.isPaidUser }],
			sources: [{ value: ['0.0.0.0/0'], disabled: !props.isPaidUser }],
			include_fields: [{ value: ['*'], disabled: !props.isPaidUser }],
			exclude_fields: [{ value: [], disabled: true }],
			ip_limit: [{ value: 0, disabled: !props.isPaidUser }, Validators.required],
			ttl: [{ value: 0, disabled: !props.isPaidUser }, Validators.required],
		});
	}
	componentDidMount() {
		const includeFieldsHandler = this.form.get('include_fields');
		const excludeFieldsHandler = this.form.get('exclude_fields');
		includeFieldsHandler.valueChanges.subscribe((value) => {
			if (value.includes('*')) {
				excludeFieldsHandler.disable({ emitEvent: false });
				excludeFieldsHandler.reset([]);
			} else {
				excludeFieldsHandler.enable({ emitEvent: false });
			}
		});
		excludeFieldsHandler.valueChanges.subscribe((value) => {
			if (value.includes('*')) {
				includeFieldsHandler.disable({ emitEvent: false });
				includeFieldsHandler.reset([]);
			} else {
				includeFieldsHandler.enable({ emitEvent: false });
			}
		});
	}
	componentWillUnmount() {
		this.form.get('include_fields').valueChanges.unsubscribe();
		this.form.get('exclude_fields').valueChanges.unsubscribe();
	}
	handleSubmit = () => {
		this.props.onSubmit(this.form);
	};
	render() {
		const {
 show, handleCancel, isPaidUser, mappings, isSubmitting,
} = this.props;
		const traverseMappings = traverseMapping(mappings);
		return (
			<FieldGroup
				strict={false}
				control={this.form}
				render={({ invalid }) => (
					<Modal
						footer={[
							<Button key="back" onClick={handleCancel}>
								Cancel
							</Button>,
							<Button
								loading={isSubmitting}
								disabled={invalid}
								key="submit"
								type="primary"
								onClick={this.handleSubmit}
							>
								Submit
							</Button>,
						]}
						visible={show}
						onCancel={handleCancel}
					>
						<div css="position: relative">
							<span css="font-weight: 500;color: black;font-size: 16px;">
								Creating a new credential
							</span>
							<FieldControl
								strict={false}
								name="description"
								render={({ handler }) => (
									<Grid
										label="Description"
										component={<Input autoFocus placeholder="Add a description (optional)" {...handler()} />}
									/>
								)}
							/>
							<FieldControl
								name="operationType"
								render={({ handler }) => (
									<Grid
										label="Operation Type"
										component={
											<Radio.Group
												{...handler()}
												css="label { font-weight: 100 }"
											>
												{Object.keys(Types).map(type => (
													<Radio key={type} value={Types[type]}>
														{Types[type].description}
													</Radio>
												))}
											</Radio.Group>
										}
									/>
								)}
							/>
							{!isPaidUser && (
								<div css={styles.overlay}>
									<div css={styles.upgradePlan}>
										<div style={{ marginBottom: 20 }}>
											<Icon type="lock" css="font-size: 40px" />
										</div>
										Upgrade to a paid plan to add security permissions.
										<Tooltip overlay={hoverMessage} mouseLeaveDelay={0}>
											<i className="fas fa-info-circle" />
										</Tooltip>
										<UpgradeButton
											css="margin-top: 10px"
											href="/billing"
											target="_blank"
											style={{
												marginTop: 20,
											}}
										>
											Upgrade Now
										</UpgradeButton>
									</div>
								</div>
							)}
							<FieldControl
								name="acl"
								render={({ handler }) => {
									const inputHandler = handler();
									return (
										<Grid
											label="ACLs"
											component={
												<CheckboxGroup
													css="label { font-weight: 100 }"
													{...inputHandler}
													options={aclOptions.map(o => aclOptionsLabel[o])}
													value={inputHandler.value.map(o => aclOptionsLabel[o])}
													onChange={(value) => {
														inputHandler.onChange(value.map(v => v.toLowerCase()));
													}}
												/>
											}
										/>
									);
								}}
							/>
							<Grid label="Security" />
							<FieldControl
								name="referers"
								render={control => (
									<WhiteList
										control={control}
										type="dropdown"
										defaultSuggestionValue="https://example.com/"
										label="HTTP Referers"
										inputProps={{
											placeholder: 'Add a HTTP Referer',
										}}
									/>
								)}
							/>
							<FieldControl
								name="sources"
								render={control => (
									<WhiteList
										control={control}
										label="IP Sources"
										defaultValue={{
											value: '0.0.0.0/0 (default)',
											description: 'Matches all IP sources',
										}}
										inputProps={{
											placeholder: 'Add an IP Source in CIDR format',
										}}
									/>
								)}
							/>
							<div css="margin-top: 30px">
								<span css={styles.formLabel}>Fields Filtering</span>
								<Tooltip css="margin-left: 5px" overlay={fieldMessage} mouseLeaveDelay={0}>
									<i className="fas fa-info-circle" />
								</Tooltip>
							</div>
							<FieldControl
								strict={false}
								name="include_fields"
								render={({ handler }) => {
									const inputHandler = handler();
									const excludedFields = this.form.get('exclude_fields').value;
									return (
										<Grid
											label={<span css={styles.subHeader}>Include</span>}
											component={
												<Select
													placeholder="Select field value"
													mode="multiple"
													style={{ width: '100%' }}
													{...inputHandler}
													onChange={(value) => {
														if (value.includes('*')) {
															inputHandler.onChange(['*']);
														} else {
															inputHandler.onChange(value);
														}
													}}
												>
												<Option key="*">* (Include all fields)</Option>
												{Object.keys(traverseMappings).map(i =>
													traverseMappings[i].map((v) => {
														if (!excludedFields.includes(v)) {
															return (
																<Option value={v} key={v} title={v}>
																	{v}
																	<span css={styles.fieldBadge}>{i}</span>
																</Option>
															);
														}
														return null;
													}))
												}
												</Select>
											}
										/>
									);
								}}
							/>
							<FieldControl
								strict={false}
								name="exclude_fields"
								render={({ handler }) => {
									const inputHandler = handler();
									const includedFields = this.form.get('include_fields').value;
									return (
										<Grid
											label={<span css={styles.subHeader}>Exclude</span>}
											component={
												<Select
													placeholder="Select field value"
													mode="multiple"
													style={{ width: '100%' }}
													{...inputHandler}
													onChange={(value) => {
														if (!value.length || !value.includes('*')) {
															inputHandler.onChange(value);
														} else {
															inputHandler.onChange(['*']);
														}
													}}
												>
													<Option key="*">* (Exclude all fields)</Option>
													{Object.keys(traverseMappings).map(i =>
													traverseMappings[i].map((v) => {
														if (!includedFields.includes(v)) {
															return (
																<Option value={v} key={v}>
																	{v}
																	<span css={styles.fieldBadge}>{i}</span>
																</Option>
															);
														}
														return null;
													}))
												}
												</Select>
											}
										/>
									);
								}
							}
							/>
							<FieldControl
								name="ip_limit"
								render={({ handler }) => (
									<Grid
										label="Max API calls/IP/hour"
										component={
											<Flex justifyContent="center" alignItems="center">
												<Input
													type="number"
													css="border: solid 1px #9195A2!important;width: 70px"
													{...handler()}
												/>
												<Tooltip css="margin-left: 5px" overlay={ipLimitMessage} mouseLeaveDelay={0}>
													<i className="fas fa-info-circle" />
												</Tooltip>
											</Flex>
										}
									/>
								)}
							/>
							<FieldControl
								name="ttl"
								render={({ handler }) => (
									<Grid
										label="TTL"
										component={
											<Flex justifyContent="center" alignItems="center">
											<Input
												type="number"
												css="border: solid 1px #9195A2!important;width: 70px"
												{...handler()}
											/>
											<Tooltip css="margin-left: 5px" overlay={ttlMessage} mouseLeaveDelay={0}>
													<i className="fas fa-info-circle" />
											</Tooltip>
											</Flex>
										}
									/>
								)}
							/>
						</div>
					</Modal>
				)}
			/>
		);
	}
}
CreateCredentials.defaultProps = {
	show: false,
	isSubmitting: false,
};
CreateCredentials.propTypes = {
	isPaidUser: PropTypes.bool,
	isSubmitting: PropTypes.bool,
	show: PropTypes.bool,
	cancel: PropTypes.func,
	onSubmit: PropTypes.func,
};

export default CreateCredentials;
