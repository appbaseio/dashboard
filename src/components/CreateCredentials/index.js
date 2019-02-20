import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import {
	Icon, Modal, Input, Checkbox,
	Radio, Tooltip, Button, Select,
} from 'antd';
import {
	FormBuilder, Validators, FieldGroup, FieldControl,
} from 'react-reactive-form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import styles from './styles';
import Flex from '../../batteries/components/shared/Flex';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import { displayErrors } from '../../utils/helper';
import { getPermission } from '../../batteries/modules/actions/permission';
import Grid from './Grid';
import { getAppMappings } from '../../batteries/modules/actions';
import { createCredentials as Messages, hoverMessage } from '../../utils/messages';
import { getTraversedMappingsByAppName, getAppPermissionsByName, getAppPlanByName } from '../../batteries/modules/selectors';
import {
	Types, getDefaultAclOptionsByPlan,
	aclOptionsLabel, getAclOptionsByPlan, isNegative,
} from './utils';
import WhiteList from './WhiteList';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const modal = css`
	.ant-modal-content {
		width: 580px;
	}
`;
const calculateValue = (value) => {
	const index = value.indexOf('*');
	if (index > -1) {
		if (index === 0 && value.length !== 1) {
			value.splice(index, 1);
			return value;
		}
		return ['*'];
	}
	return value;
};
class CreateCredentials extends React.Component {
	constructor(props) {
		super(props);
		this.form = FormBuilder.group({
			description: '',
			operationType: [Types.read, Validators.required],
			acl: [{ value: getDefaultAclOptionsByPlan(props.plan), disabled: !props.isPaidUser },
				Validators.required],
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
	}

	componentDidMount() {
		const {
			disabled, initialValues, isPermissionPresent, isPaidUser,
		} = this.props;
		if (disabled) {
			this.form.disable();
		} else if (isPaidUser) {
			const includeFieldsHandler = this.form.get('include_fields');
			const excludeFieldsHandler = this.form.get('exclude_fields');
			includeFieldsHandler.valueChanges.subscribe((value) => {
				if (value && value.includes('*')) {
					excludeFieldsHandler.disable({ emitEvent: false });
					excludeFieldsHandler.reset([]);
				} else {
					excludeFieldsHandler.enable({ emitEvent: false });
				}
			});
			excludeFieldsHandler.valueChanges.subscribe((value) => {
				if (value && value.includes('*')) {
					includeFieldsHandler.disable({ emitEvent: false });
					includeFieldsHandler.reset([]);
				} else {
					includeFieldsHandler.enable({ emitEvent: false });
				}
			});
		}
		if (initialValues) {
			let operationType;
			Object.keys(Types).every((k) => {
				const type = Types[k];
				if (type.read === initialValues.read && type.write === initialValues.write) {
					operationType = type;
					return false;
				}
				return true;
			});
			this.form.patchValue({ ...initialValues, operationType });
		}
		if (!isPermissionPresent) {
			const { fetchPermissions } = this.props;
			fetchPermissions();
		}
	}

	componentDidUpdate(prevProps) {
		const { errors, credentials } = this.props;
		if (credentials && credentials !== prevProps.credentials) {
			this.getMappings();
		}
		displayErrors(errors, prevProps.errors);
	}

	componentWillUnmount() {
		this.form.get('include_fields').valueChanges.unsubscribe();
		this.form.get('exclude_fields').valueChanges.unsubscribe();
	}

	getMappings() {
		const { appName, fetchMappings, credentials } = this.props;
		if (credentials) {
			// Fetch Mappings if permissions are present
			const { username, password } = credentials;
			fetchMappings(appName, `${username}:${password}`);
		}
	}

	get getText() {
		const { titleText } = this.props;
		return titleText || (this.isEditing ? 'Edit credential' : 'Create a new credential');
	}

	get isEditing() {
		const { initialValues } = this.props;
		return !!initialValues;
	}

	handleSubmit = () => {
		const { onSubmit } = this.props;
		onSubmit(this.form, get(this.props, 'initialValues.meta.username'));
	};

	render() {
		const {
 show, handleCancel, isPaidUser, isSubmitting, plan, mappings, disabled,
 saveButtonText, isLoadingMappings, shouldHaveEmailField, initialValues,
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
						title={this.getText}
						css={modal}
						footer={!disabled ? [
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
								{saveButtonText || (this.isEditing ? 'Save' : 'Generate')}
							</Button>,
						] : [
								<Button key="back" onClick={handleCancel}>
									Cancel
								</Button>,
							]
						}
						visible={show}
						onCancel={handleCancel}
					>
					{
						isLoadingMappings ? <Loader style={{ marginTop: '-100px', marginBottom: '120px' }} /> : (
						<React.Fragment>
							<div css="position: relative">
								{shouldHaveEmailField && (
									<FieldControl
										strict={false}
										name="email"
										formState={initialValues && initialValues.email}
										options={{
											validators: [Validators.required, Validators.email],
										}}
										render={({ handler }) => (
											<Grid
												label="Email"
												toolTipMessage={Messages.email}
												component={(
													<Input
														autoFocus={!this.isEditing}
														placeholder="Add email"
														{...handler()}
													/>
												)}
											/>
										)}
									/>)
								}
								<FieldControl
									strict={false}
									name="description"
									render={({ handler }) => (
										<Grid
											label="Description"
											toolTipMessage={Messages.description}
											component={(
												<Input
													autoFocus={!shouldHaveEmailField && !this.isEditing}
													placeholder="Add an optional description for this credential"
													{...handler()}
												/>
											)}
										/>
									)}
								/>
								<FieldControl
									name="operationType"
									render={({ handler }) => (
										<Grid
											label="Key Type"
											toolTipMessage={Messages.operationType}
											component={(
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
											)}
										/>
									)}
								/>
								{!isPaidUser && (
									<div css={styles.overlay}>
										<div css={styles.upgradePlan}>
											<div style={{ marginBottom: 20 }}>
												<Icon type="lock" css="font-size: 40px" />
											</div>
											Upgrade to a paid plan to add advanced security permissions.
											<Tooltip overlay={hoverMessage} mouseLeaveDelay={0}>
												<i className="fas fa-info-circle" />
											</Tooltip>
											<Button
												type="primary"
												css="margin-top: 10px"
												href="billing"
												target="_blank"
												style={{
													marginTop: 20,
												}}
											>
												Upgrade Now
											</Button>
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
												component={(
													<CheckboxGroup
														css="label { font-weight: 100 }"
														{...inputHandler}
														options={getAclOptionsByPlan(plan).map(o => aclOptionsLabel[o])}
														value={inputHandler.value.map(o => aclOptionsLabel[o])}
														onChange={(value) => {
															inputHandler.onChange(value.map(v => v.toLowerCase()));
														}}
													/>
												)}
											/>
										);
									}}
								/>
								<Grid label="Security" toolTipMessage={Messages.security} />
								<FieldControl
									name="referers"
									render={control => (
										<WhiteList
											toolTipMessage={Messages.referers}
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
												component={(
													<Select
														placeholder="Select field value"
														mode="multiple"
														style={{ width: '100%' }}
														{...inputHandler}
														onChange={(value) => {
																inputHandler.onChange(calculateValue(value));
														}}
													>
														<Option key="*">* (Include all fields)</Option>
														{Object.keys(mappings).map(i => mappings[i].map((v) => {
																if (!excludedFields.includes(v)) {
																	return (
																		<Option
																			key={v}
																			title={v}
																		>
																			{v}
																			{/* <span
																				css={styles.fieldBadge}
																			>
																				{i}
																			</span> */}
																		</Option>
																	);
																}
																return null;
															}))}
													</Select>
												)}
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
												component={(
													<Select
														placeholder="Select field value"
														mode="multiple"
														style={{ width: '100%' }}
														{...inputHandler}
														onChange={(value) => {
															inputHandler.onChange(calculateValue(value));
														}}
													>
														<Option key="*">* (Exclude all fields)</Option>
														{Object.keys(mappings).map(i => mappings[i].map((v) => {
																if (!includedFields.includes(v)) {
																	return (
																		<Option key={v}>
																			{v}
																			{/* <span
																				css={styles.fieldBadge}
																			>
																				{i}
																			</span> */}
																		</Option>
																	);
																}
																return null;
															}))}
													</Select>
												)}
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
											component={(
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
											)}
										/>
									)}
								/>
								<FieldControl
									name="ttl"
									render={({ handler, hasError }) => (
										<Grid
											label="TTL"
											toolTipMessage={Messages.ttl}
											component={(
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
											)}
										/>
									)}
								/>
							</div>
						</React.Fragment>)
					}

					</Modal>
				)}
			/>
		);
	}
}
CreateCredentials.defaultProps = {
	show: false,
	isSubmitting: false,
	isPaidUser: false,
	initialValues: undefined,
	disabled: false,
	saveButtonText: undefined,
	permissions: undefined,
	titleText: undefined,
	shouldHaveEmailField: false,
};
CreateCredentials.propTypes = {
	isPaidUser: PropTypes.bool,
	isSubmitting: PropTypes.bool,
	show: PropTypes.bool,
	onSubmit: PropTypes.func.isRequired,
	fetchPermissions: PropTypes.func.isRequired,
	initialValues: PropTypes.shape({
		description: PropTypes.string,
		read: PropTypes.bool,
		write: PropTypes.bool,
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
	isPermissionPresent: PropTypes.bool.isRequired,
	appName: PropTypes.string.isRequired,
	handleCancel: PropTypes.func.isRequired,
	isLoadingMappings: PropTypes.bool.isRequired,
	disabled: PropTypes.bool,
	permissions: PropTypes.array,
	saveButtonText: PropTypes.string,
	errors: PropTypes.array.isRequired,
	plan: PropTypes.oneOf(['free', 'growth', 'bootstrap']).isRequired,
	titleText: PropTypes.string,
	shouldHaveEmailField: PropTypes.bool,
};

const mapStateToProps = (state) => {
	const mappings = getTraversedMappingsByAppName(state);
	const appPermissions = getAppPermissionsByName(state);
	const plan = getAppPlanByName(state);
	return {
		isPaidUser: get(plan, 'isPaid'),
		appName: get(state, '$getCurrentApp.name'),
		mappings: mappings || [],
		isPermissionPresent: !!appPermissions,
		isLoadingMappings: get(state, '$getAppMappings.isFetching') || get(state, '$getAppPermissions.isFetching'),
		credentials: get(appPermissions, 'credentials'),
		plan: get(plan, 'plan'),
		isSubmitting: get(state, '$createAppPermission.isFetching') || get(state, '$updateAppPermission.isFetching') || get(state, '$createAppShare.isFetching'),
		errors: [
			get(state, '$getAppMappings.error'),
			get(state, '$createAppPermission.error'),
			get(state, '$updateAppPermission.error'),
			get(state, '$createAppShare.error'),
		],
	};
};

const mapDispatchToProps = dispatch => ({
	fetchMappings: (appName, credentials) => dispatch(getAppMappings(appName, credentials)),
	fetchPermissions: appName => dispatch(getPermission(appName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateCredentials);
