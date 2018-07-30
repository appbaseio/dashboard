import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Icon, Modal, Input, Checkbox, Radio, Tooltip, Button, Select } from 'antd';
import { FormBuilder, Validators, FieldGroup, FieldControl } from 'react-reactive-form';
import get from 'lodash/get';
import styles from './styles';
import { Button as UpgradeButton } from './../../../../modules/batteries/components/Mappings/styles';
import Grid from './Grid';
import Flex from './../../../shared/Flex';
import { createCredentials as Messages, hoverMessage } from './../../../utils/messages';
import { traverseMapping } from './../../../../modules/batteries/utils/mappings';
import { Types, aclOptions, aclOptionsLabel, defaultAclOptions, isNegative } from '../utils';
import WhiteList from './WhiteList';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const modal = css`
	.ant-modal-content {
		width: 580px;
	}
`;
class CreateCredentials extends React.Component {
	constructor(props) {
		super(props);
		this.form = FormBuilder.group({
			description: '',
			operationType: [Types.read, Validators.required],
			acl: [{ value: defaultAclOptions, disabled: !props.isPaidUser }, Validators.required],
			referers: [{ value: ['*'], disabled: !props.isPaidUser }],
			sources: [{ value: ['0.0.0.0/0'], disabled: !props.isPaidUser }],
			include_fields: [{ value: ['*'], disabled: !props.isPaidUser }],
			exclude_fields: [{ value: [], disabled: true }],
			ip_limit: [
				{ value: 7200, disabled: !props.isPaidUser },
				[Validators.required, isNegative],
			],
			ttl: [{ value: 0, disabled: !props.isPaidUser }, [Validators.required, isNegative]],
		});
		this.mappings = traverseMapping(this.props.mappings);
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
		if (this.props.initialValues) {
			this.form.patchValue(this.props.initialValues);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.mappings !== this.props.mappings) {
			this.mappings = traverseMapping(nextProps.mappings);
		}
	}
	componentWillUnmount() {
		this.form.get('include_fields').valueChanges.unsubscribe();
		this.form.get('exclude_fields').valueChanges.unsubscribe();
	}
	get isEditing() {
		return !!this.props.initialValues;
	}
	handleSubmit = () => {
		this.props.onSubmit(this.form, get(this.props, 'initialValues.meta.username'));
	};
	render() {
		const {
 show, handleCancel, isPaidUser, isSubmitting,
} = this.props;
		return (
			<FieldGroup
				strict={false}
				control={this.form}
				render={({ invalid }) => (
					<Modal
						style={{
							width: '600px',
						}}
						css={modal}
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
								{this.isEditing ? 'Save' : 'Generate'}
							</Button>,
						]}
						visible={show}
						onCancel={handleCancel}
					>
						<div css="position: relative">
							<span css="font-weight: 500;color: black;font-size: 16px;">
								{this.isEditing ? 'Edit credential' : 'Create a new credential'}
							</span>
							<FieldControl
								strict={false}
								name="description"
								render={({ handler }) => (
									<Grid
										label="Description"
										toolTipMessage={Messages.description}
										component={
											<Input
												autoFocus={!this.isEditing}
												placeholder="Add an optional description for this credential"
												{...handler()}
											/>
										}
									/>
								)}
							/>
							<FieldControl
								name="operationType"
								render={({ handler }) => (
									<Grid
										label="Operation Type"
										toolTipMessage={Messages.operationType}
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
											toolTipMessage={Messages.acls}
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
							<Grid label="Security" toolTipMessage={Messages.security} />
							<FieldControl
								name="referers"
								render={control => (
									<WhiteList
										toolTipMessage={Messages.security}
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
										toolTipMessage={Messages.sources}
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
								<Tooltip
									css="margin-left: 5px;color:#898989"
									overlay={Messages.fieldFiltering}
									mouseLeaveDelay={0}
								>
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
											toolTipMessage={Messages.include}
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
													{Object.keys(this.mappings).map(i =>
														this.mappings[i].map((v) => {
															if (!excludedFields.includes(v)) {
																return (
																	<Option
																		value={v}
																		key={v}
																		title={v}
																	>
																		{v}
																		<span
																			css={styles.fieldBadge}
																		>
																			{i}
																		</span>
																	</Option>
																);
															}
															return null;
														}))}
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
											toolTipMessage={Messages.exclude}
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
													{Object.keys(this.mappings).map(i =>
														this.mappings[i].map((v) => {
															if (!includedFields.includes(v)) {
																return (
																	<Option value={v} key={v}>
																		{v}
																		<span
																			css={styles.fieldBadge}
																		>
																			{i}
																		</span>
																	</Option>
																);
															}
															return null;
														}))}
												</Select>
											}
										/>
									);
								}}
							/>
							<FieldControl
								name="ip_limit"
								render={({ handler, hasError }) => (
									<Grid
										label="Max API calls/IP/hour"
										toolTipMessage={Messages.ipLimit}
										component={
											<Flex justifyContent="center" alignItems="center">
												<Input
													type="number"
													css="border: solid 1px #9195A2!important;width: 120px"
													{...handler()}
												/>
												{hasError('isNegative') && (
													<span css="color: red;margin-left: 10px">
														Field value can{"'"}t be negative.
													</span>
												)}
											</Flex>
										}
									/>
								)}
							/>
							<FieldControl
								name="ttl"
								render={({ handler, hasError }) => (
									<Grid
										label="TTL"
										toolTipMessage={Messages.ttl}
										component={
											<Flex justifyContent="center" alignItems="center">
												<Input
													type="number"
													css="border: solid 1px #9195A2!important;width: 120px"
													{...handler()}
												/>
												{hasError('isNegative') && (
													<span css="color: red;margin-left: 10px">
														Field value can{"'"}t be negative.
													</span>
												)}
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
	initialValues: PropTypes.shape({
		description: PropTypes.string,
		operationType: PropTypes.object,
		acl: PropTypes.arrayOf(PropTypes.string),
		referers: PropTypes.arrayOf(PropTypes.string),
		sources: PropTypes.arrayOf(PropTypes.string),
		include_fields: PropTypes.arrayOf(PropTypes.string),
		exclude_fields: PropTypes.arrayOf(PropTypes.string),
		ip_limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		ttl: PropTypes.number,
		meta: PropTypes.object,
	}),
};

export default CreateCredentials;
