import React from 'react';
import { css } from 'emotion';
import { Icon, Modal, Input } from 'antd';
import Flex from './../../shared/Flex';

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
const formLabel = css`
	font-weight: 500;
	color: black;
	font-size: 16px;
`;
const labelLayout = css`
	width: 150px;
	color: #222c45;
`;
const subHeader = css`
	margin-left: 10px;
	font-weight: 100;
`;
const addedWhiteList = css`
	background-color: #fbfcfe;
	border: solid 1px #83a2ee;
	border-radius: 2px;
	padding: 5px 10px;
	color: #343e54;
	width: 100%;
`;
const description = css`
	font-size: 12px;
	font-weight: 100;
`;
const serachResultsCls = css`
	border: solid 1px #d9d9d9;
	border-top: none;
	border-radius: 3px;
	position: absolute;
	width: 100%;
	background-color: #fff;
	z-index: 1;
`;
const PermissionButton = props => (
	<label css="margin-left: 10px !important;" htmlFor={props.type}>
		<input
			type="radio"
			name={props.type}
			checked={props.selectedType === props.type}
			onChange={props.onSelect && (() => props.onSelect(props.type))}
		/>{' '}
		<span css="font-weight: 100">{props.description}</span>
	</label>
);
const ListInput = props => (
	<Input
		{...props}
		suffix={<Icon type="caret-down" css="transform: scale(.8, 1);color: #9195A2" />}
	/>
);
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
const WhiteList = ({ label, preAdded, serachResults }) => (
	<Grid
		label={<span css={subHeader}>{label}</span>}
		component={
			<Flex css="width: 100%;position: relative" flexDirection="column">
				{preAdded.map(item => (
					<div key={item.id} css={addedWhiteList}>
						<div>{item.name}</div>
						<div css={description}>{item.description}</div>
					</div>
				))}
				<div css="margin-top: 10px">
					<ListInput placeholder="example" />
					{serachResults && (
						<div css={serachResultsCls}>
							{Object.keys(Suggestions).map((k) => {
								const suggestion = Suggestions[k];
								return (
									<Flex
										justifyContent="space-between"
										key={k}
										css="padding: 5px 10px;color: #4F586C"
									>
										<span>
											{suggestion.prefix}example{suggestion.suffix}
										</span>
										<span css={description}>{suggestion.description}</span>
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
const Grid = ({ label, component }) => (
	<Flex css="margin-top: 30px">
		<Flex css="flex: 20%">
			<div css={labelLayout}>
				<span css={formLabel}>{label}</span>
			</div>
		</Flex>
		<Flex css="flex: 80%; margin-left: 20px">{component}</Flex>
	</Flex>
);
const CreateCredentials = ({ show, handleCancel }) => (
	<div>
		<Modal visible={show} onCancel={handleCancel}>
			<span css="font-size: 12px">Creating a new credential</span>
			<Flex
				css="border-bottom: dashed 1px;padding-bottom: 5px;padding-top: 10px"
				justifyContent="space-between"
			>
				<span css={formLabel}>Admin API Key</span>
				<div>
					<Icon type="edit" style={{ fontSize: 20 }} />
				</div>
			</Flex>
			<Grid
				label="Operation Type"
				component={
					<div>
						{Object.keys(Types).map(type => (
							<PermissionButton
								key={type}
								type={type}
								selectedType="read"
								description={Types[type].description}
								onSelect={() => null}
							/>
						))}
					</div>
				}
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
				label={<span css={subHeader}>Include</span>}
				component={<ListInput placeholder="Select field value" />}
			/>
			<Grid
				label={<span css={subHeader}>Exclude</span>}
				component={<ListInput placeholder="Select field value" />}
			/>
			<Grid
				label="MAX API calls / IP / HOUR"
				component={
					<Input
						type="number"
						css="border: solid 1px #9195A2!important;width: 100px"
						value={0}
					/>
				}
			/>
		</Modal>
	</div>
);

export default CreateCredentials;
