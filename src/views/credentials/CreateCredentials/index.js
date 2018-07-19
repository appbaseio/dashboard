import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Input, Checkbox, Radio, Tooltip, Button } from 'antd';
import { css } from 'emotion';
import { FormBuilder, Validators, FieldGroup, FieldControl } from 'react-reactive-form';
import styles from './styles';
import { Button as UpgradeButton } from './../../../../modules/batteries/components/Mappings/styles';
import Grid from './Grid';
import WhiteList from './WhiteList';
import ListInput from './ListInput';

const hoverMessage = () => (
	<div style={{ maxWidth: 220 }}>
		Editing security permissions isn{"'"}t a native feature in Elasticsearch. All appbase.io
		paid plans offer editable security permissions by performing a lossless re-indexing of your
		data whenever you edit them from this UI.
	</div>
);
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

const aclOptions = ['index', 'get', 'Settings', 'Search', 'Stream'];
const defaultAclOptions = ['index', 'get'];
const CheckboxGroup = Checkbox.Group;
const preAddedDomain = [
	{
		id: '1',
		name: 'appbase.io',
		description: 'Matches exactly appbase.io',
	},
];
const preAddedIP = [
	{
		id: '1',
		name: '0.0.0.0/0',
		description: 'Matches exactly appbase.io',
	},
];
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
			acl: [{ value: defaultAclOptions, disabled: props.isPaidUser }, Validators.required],
			referers: [{ value: undefined, disabled: props.isPaidUser }],
			sources: [{ value: undefined, disabled: props.isPaidUser }],
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
		const { show, handleCancel, isPaidUser } = this.props;
		return (
			<FieldGroup
				strict={false}
				control={this.form}
				render={({ invalid }) => (
					<Modal
						footer={[
							<Button key="back" onClick={this.handleCancel}>
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
							<div css={!isPaidUser ? overlay : undefined}>
								{!isPaidUser && (
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
								)}
							</div>
							<FieldControl
								name="acl"
								render={({ handler }) => (
									<Grid
										label="ACLs"
										component={
											<CheckboxGroup
												css="label { font-weight: 100 }"
												options={aclOptions}
												{...handler()}
											/>
										}
									/>
								)}
							/>
							<Grid label="Security" />
							<WhiteList label="HTTP Referers" preAdded={preAddedDomain} />
							<WhiteList label="IP Sources" preAdded={preAddedIP} />
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
										label="MAX API calls / IP / HOUR"
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
