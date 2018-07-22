import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import { Icon, Modal, Input, Checkbox, Radio, Tooltip, Button } from 'antd';
import { css } from 'emotion';
import { FormBuilder, Validators, FieldGroup, FieldControl } from 'react-reactive-form';
import styles from './styles';
import { Button as UpgradeButton } from './../../../../modules/batteries/components/Mappings/styles';
import Grid from './Grid';
import Flex from './../../../shared/Flex';
import WhiteList from './WhiteList';
import ListInput from './ListInput';

const hoverMessage = () => (
	<div style={{ maxWidth: 220 }}>
		Editing security permissions isn{"'"}t a native feature in Elasticsearch. All appbase.io
		paid plans offer editable security permissions by performing a lossless re-indexing of your
		data whenever you edit them from this UI.
	</div>
);

const traverseMapping = (mappings = {}) => {
	const fieldObject = {};
	const checkIfPropertyPresent = (m, type) => {
		fieldObject[type] = [];
		const setFields = (mp, prefix = '') => {
			if (mp.properties) {
				Object.keys(mp.properties).forEach((mpp) => {
					fieldObject[type].push(`${prefix}${mpp}`);
					const field = mp.properties[mpp];
					if (field && field.properties) {
						setFields(field, `${prefix}${mpp}.`);
					}
				});
			}
		};
		setFields(m);
	};
	Object.keys(mappings).forEach(k => checkIfPropertyPresent(mappings[k], k));
	return fieldObject;
};
const Types = {
	read: {
		description: 'Read-only key',
		read: true,
		write: false,
	},
	write: {
		description: 'Write-only key',
		read: false,
		write: true,
	},
	admin: {
		description: 'Admin key',
		read: true,
		write: true,
	},
};

const aclOptions = ['index', 'get', 'search', 'settings', 'stream', 'bulk', 'delete'];
const aclOptionsLabel = {
	index: 'Index',
	get: 'Get',
	search: 'Search',
	settings: 'Settings',
	stream: 'Stream',
	bulk: 'Bulk',
	delete: 'Delete',
};
const defaultAclOptions = ['index', 'get'];
const CheckboxGroup = Checkbox.Group;
const overlay = css`
	position: absolute;
	top: 160px;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(255, 255, 255, 0.8);
	z-index: 9999;
	color: black;
`;
const upgradePlan = css`
	margin-top: 200px;
	font-size: 16px;
	font-weight: 500;
	text-align: center;
`;
class CreateCredentials extends React.Component {
	constructor(props) {
		super(props);
		this.form = FormBuilder.group({
			description: [Types.read.description, Validators.required],
			operationType: [Types.read, Validators.required],
			acl: [{ value: defaultAclOptions, disabled: !props.isPaidUser }, Validators.required],
			referers: [{ value: ['dwed*'], disabled: !props.isPaidUser }],
			sources: [{ value: [], disabled: !props.isPaidUser }],
			include_fields: [{ value: [], disabled: !props.isPaidUser }],
			exclude_fields: [{ value: [], disabled: !props.isPaidUser }],
			ip_limit: [{ value: 0, disabled: !props.isPaidUser }, Validators.required],
			ttl: [{ value: 0, disabled: !props.isPaidUser }, Validators.required],
		});
	}
	handleSubmit = () => {
		this.props.onSubmit(this.form);
	};
	render() {
		const {
 show, handleCancel, isPaidUser, mappings,
} = this.props;
		const traverseMappings = traverseMapping(mappings);
		console.log('THIS IS THE THING', traverseMappings);
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
								disabled={invalid}
								key="submit"
								type="primary"
								onClick={this.handleSubmit}
							>
								Submit
							</Button>,
						]}
						visible={show || true}
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
										component={<Input autoFocus {...handler()} />}
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
								<div css={overlay}>
									<div css={upgradePlan}>
										<div>
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
													options={aclOptions.map(o => aclOptionsLabel[o])}
													{...inputHandler}
													onChange={(value) => {
														inputHandler.onChange(value.map(item =>
																find(
																	aclOptionsLabel,
																	o => o === item,
																)));
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
							<Grid
								label="Fields Filtering"
								component="List of fields to retrieve (or not retrieve) when making a search query using
								this Api Key"
							/>
							<Grid
								label={<span css={styles.subHeader}>Include</span>}
								component={<ListInput placeholder="Select field value" />}
							/>
							<Grid
								label={<span css={styles.subHeader}>Exclude</span>}
								component={<ListInput placeholder="Select field value" />}
							/>
							<FieldControl
								name="ip_limit"
								render={({ handler }) => (
									<Grid
										label="Max API calls/IP/hour"
										component={
											<div>
												<Input
													type="number"
													css="border: solid 1px #9195A2!important;width: 70px"
													{...handler()}
												/>
												<div>
													The maximum number of hits this API key can
													retrieve in one call. 0 means unlimited.
												</div>
											</div>
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
											<Input
												type="number"
												css="border: solid 1px #9195A2!important;width: 70px"
												{...handler()}
											/>
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
};
CreateCredentials.propTypes = {
	isPaidUser: PropTypes.bool,
	show: PropTypes.bool,
	cancel: PropTypes.func,
	onSubmit: PropTypes.func,
};

export default CreateCredentials;
