import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Button, Tooltip } from 'antd';
import { deployClusterStyles } from './styles';

const PipelineTemplateScreen = ({ formData, setActiveKey }) => {
	const [pipelineVariables, setPipelineVariables] = useState([]);

	useEffect(() => {
		validateFormData();
	}, [formData]);

	const validateFormData = () => {
		const newPipelineVariables = formData.map(obj => {
			const newObj = {
				...obj,
				error: obj.validate ? true : false,
				errorMessage: '',
			};
			return newObj;
		});
		setPipelineVariables(newPipelineVariables);
	};

	const validateInput = pipelineObj => {
		const validateObj = Array.isArray(pipelineObj.validate)
			? pipelineObj.validate[0]
			: pipelineObj.validate;

		fetch(validateObj.url, {
			method: validateObj.method,
			headers: validateObj.headers,
		})
			.then(res => {
				if (res.ok) return res.json();
				return Promise.reject(res);
			})
			.then(res => {
				const newPipelineVariables = pipelineVariables.map(obj => {
					if (obj.key === pipelineObj.key) {
						obj.error = false;
					}
					return obj;
				});
				setPipelineVariables(newPipelineVariables);
			})
			.catch(err => {
				if (err.status && err.status !== validateObj.expected_status) {
					handleError(
						pipelineObj,
						`Expected status is ${validateObj.expected_status}, but received ${err.status}`,
					);
				} else {
					handleError(
						pipelineObj,
						'Cannot make the API request. Is your input valid?',
					);
				}
				console.error('Error in Validate api', err);
			});
	};

	const handleError = (pipelineObj, errorMsg) => {
		const newPipelineVariables = pipelineVariables.map(obj => {
			if (obj.key === pipelineObj.key) {
				obj.error = true;
				obj.errorMessage = errorMsg;
			}
			return obj;
		});
		setPipelineVariables(newPipelineVariables);
	};

	const errorArray = pipelineVariables.filter(i => i.error === true);

	return (
		<div css={deployClusterStyles}>
			{formData.map(data => (
				<div key={data.key} style={{ padding: 20 }}>
					<div className="title-container">
						{data.label}
						{data.description ? (
							<Tooltip title={data.description}>
								<span style={{ marginLeft: 5 }}>
									<Icon type="info-circle" />
								</span>
							</Tooltip>
						) : null}
					</div>
					<div>
						<Input value={data.value} className="input-container" />
						{data.validate ? (
							<Button
								type="primary"
								onClick={() => validateInput(data)}
								className="validate-button"
							>
								validate
							</Button>
						) : null}
						{/* error ? <div>Expected status is {data.validate.expected_status}, but received {response.status}</div> */}
					</div>
				</div>
			))}
			<Button
				block
				size="small"
				type="primary"
				className="deploy-button"
				data-cy="signin-button"
				disabled={errorArray.length}
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
