import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Button, Tooltip } from 'antd';
import { deployClusterStyles } from './styles';

const PipelineTemplateScreen = ({ formData }) => {
	const validateInput = validateObj => {
		// fetch call
		// response set to state
	};

	return (
		<div css={deployClusterStyles}>
			{formData?.global_vars?.map(data => (
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
								onClick={validateInput(data.validate)}
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
				className="deploy-button"
				size="small"
				block
				data-cy="signin-button"
			>
				Deploy Cluster
			</Button>
		</div>
	);
};

PipelineTemplateScreen.defaultProps = {
	formData: {},
};

PipelineTemplateScreen.propTypes = {
	formData: PropTypes.object,
};

export default PipelineTemplateScreen;
