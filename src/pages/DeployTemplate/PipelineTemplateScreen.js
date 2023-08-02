/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import PropTypes, { array, func, object } from 'prop-types';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	InfoCircleOutlined,
	LoadingOutlined,
} from '@ant-design/icons';
import { Input, Button, Tooltip, Alert, Popover } from 'antd';
import JsonView from '../../components/JsonView';
import ErrorPage from './ErrorPage';
import { deployClusterStyles, popoverContent } from './styles';

const overflow = {
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	color: '#1890ff',
};

const iconMap = {
	'close-circle': <CloseCircleOutlined style={{ color: 'green' }} />,
	'check-circle': <CheckCircleOutlined style={{ color: 'green' }} />,
	loading: <LoadingOutlined />,
};

const ValidatedEnv = props => {
	const [iconType, setIconType] = useState('');
	const {
		data,
		handleInputChange,
		setTabsValidated,
		pipelineVariables,
		setPipelineVariables,
		tabsValidated,
	} = props;
	useEffect(() => {
		if (tabsValidated.tab1) {
			setIconType('check-circle');
		}
	}, []);

	const handleError = (pipelineObj, errorMsg, response = '') => {
		const newPipelineVariables = pipelineVariables.map(obj => {
			if (obj.key === pipelineObj.key) {
				obj.error = true;
				obj.errorMessage = errorMsg;
				if (response) obj.response = response;
			}
			return obj;
		});
		setPipelineVariables(newPipelineVariables);
	};

	const validateInput = pipelineObj => {
		setIconType('loading');
		const validateObj = Array.isArray(pipelineObj.validate)
			? pipelineObj.validate[0]
			: pipelineObj.validate;

		const obj = {
			method: validateObj.method,
			headers: {
				...validateObj.headers,
			},
		};

		if (validateObj.method !== 'GET') {
			obj.body = validateObj.body || '{}';
		}

		if (
			validateObj.headers &&
			validateObj.headers.Authorization &&
			validateObj.headers.Authorization.includes('Basic') &&
			validateObj.headers.Authorization.includes('btoa')
		) {
			const varRegex = /(?<=\${btoa\()(.*?)(?=\)})/;
			const keyVariable = varRegex.exec(
				validateObj.headers.Authorization,
			)[1];
			const creds = btoa(keyVariable);
			obj.headers.Authorization = `Basic ${creds}`;
		}

		// Extracting credentials from validateObj.url
		const credsRegex = /(?<=\/\/)(.*?)(?=@)/;
		const extractedCreds = credsRegex.exec(validateObj.url);
		if (extractedCreds && extractedCreds[1]) {
			const [username, password] = extractedCreds[1].split(':');
			const creds = btoa(`${username}:${password}`);
			obj.headers.Authorization = `Basic ${creds}`;

			// Remove credentials from validateObj.url
			validateObj.url = validateObj.url.replace(
				`${username}:${password}@`,
				'',
			);
		}

		fetch(validateObj.url.replace(/`/g, ''), obj)
			.then(async res => {
				if (res.ok && res.status === 200) {
					// Success: Status code is 200
					setIconType('check-circle');
					setTabsValidated(true);
					const newPipelineVariables = pipelineVariables.map(obj1 => {
						if (obj1.key === pipelineObj.key) {
							obj1.error = false;
						}
						return obj1;
					});
					setPipelineVariables(newPipelineVariables);
				} else {
					// Handle non-200 status codes
					setIconType('');
					if (
						res.status &&
						res.status !== validateObj.expected_status
					) {
						handleError(
							pipelineObj,
							`Expected status is ${validateObj.expected_status}, but received ${res.status}`,
							res,
						);
					} else {
						handleError(
							pipelineObj,
							'Cannot make the API request. Is your input valid?',
							res,
						);
					}
				}
			})
			.catch(err => {
				// Handle other errors
				setIconType('');
				handleError(pipelineObj, 'Error in Validate API', err);
			});
	};

	return (
		<div key={data.key} style={{ padding: 20 }}>
			<div className="title-container">
				{data.label}
				{data.description ? (
					<Tooltip
						title={() => (
							<div
								// eslint-disable-next-line
								dangerouslySetInnerHTML={{
									__html: data.description,
								}}
							/>
						)}
					>
						<span style={{ marginLeft: 5 }}>
							<InfoCircleOutlined />
						</span>
					</Tooltip>
				) : null}
			</div>
			<div>
				<Input
					value={data.value}
					className="input-container"
					onChange={e => {
						handleInputChange(data.key, e.target.value);
					}}
				/>
				{data.validate ? (
					<Button
						type="primary"
						onClick={() => validateInput(data)}
						className="validate-button"
					>
						validate
						{iconType ? iconMap[iconType] : null}
					</Button>
				) : null}
			</div>
			{data.errorMessage ? (
				<Alert
					style={{ marginTop: 15, width: '70%' }}
					message={
						<div className="error-alert-container">
							<div>{data.errorMessage}</div>
							{data.response ? (
								<Popover
									content={
										<div css={popoverContent}>
											<JsonView json={data.response} />
										</div>
									}
									trigger="click"
								>
									<div
										css={{
											cursor: 'pointer',
											margin: '0 7px',
											maxWidth: '95%',
											...overflow,
										}}
									>
										View the whole response
									</div>
								</Popover>
							) : null}
						</div>
					}
					type="error"
				/>
			) : null}
		</div>
	);
};
ValidatedEnv.propTypes = {
	data: object,
	handleInputChange: func,
	setTabsValidated: func,
	pipelineVariables: array,
	setPipelineVariables: func,
	tabsValidated: object,
};

const PipelineTemplateScreen = ({
	formData,
	setActiveKey,
	handleFormChange,
	setTabsValidated,
	tabsValidated,
}) => {
	const [pipelineVariables, setPipelineVariables] = useState([]);
	const validateFormData = () => {
		const newPipelineVariables = formData.map(obj => {
			const newObj = {
				...obj,
				error: !!obj.validate,
				errorMessage: '',
			};
			return newObj;
		});
		setPipelineVariables(newPipelineVariables);
	};

	useEffect(() => {
		validateFormData();
	}, [formData]);

	const handleInputChange = (key, val) => {
		handleFormChange(key, val);
	};

	const errorArray = pipelineVariables.filter(i => i.error === true);
	console.log(
		'🚀 ~ file: PipelineTemplateScreen.js:182 ~ pipelineVariables:',
		pipelineVariables,
	);

	return (
		<div css={deployClusterStyles}>
			{pipelineVariables.length ? (
				pipelineVariables.map(data => (
					<ValidatedEnv
						key={data.key}
						data={data}
						handleInputChange={handleInputChange}
						setTabsValidated={setTabsValidated}
						pipelineVariables={pipelineVariables}
						setPipelineVariables={setPipelineVariables}
						tabsValidated={tabsValidated}
					/>
				))
			) : (
				<ErrorPage
					message="This URL may not contain the global_envs property."
					type="warning"
				/>
			)}
			<Button
				block
				size="small"
				type="primary"
				className="deploy-button"
				data-cy="deploy-button"
				disabled={errorArray.length && !tabsValidated.tab1}
				onClick={() => {
					setActiveKey('2');
				}}
			>
				Next
			</Button>
		</div>
	);
};

PipelineTemplateScreen.defaultProps = {
	formData: [],
};

PipelineTemplateScreen.propTypes = {
	formData: PropTypes.array,
};

export default PipelineTemplateScreen;
