import React from 'react';
import PropTypes from 'prop-types';
import { InfoCircleFilled } from '@ant-design/icons';
import { Alert } from 'antd';
import { deployClusterStyles } from './styles';

const ErrorPage = ({ message, type = 'error' }) => {
	return (
		<div css={deployClusterStyles}>
			<Alert
				message={
					<div style={{ color: '#ec8805' }}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: 10,
							}}
						>
							<InfoCircleFilled />
							<div style={{ fontWeight: 'bold' }}>
								&nbsp;Not found:&nbsp;
							</div>
							<div style={{ color: '#000' }}>
								{window.location.search.split('=')[1]}
							</div>
						</div>
						<p>{message}</p>
					</div>
				}
				type={type}
			/>
		</div>
	);
};

ErrorPage.defaultProps = {
	message: 'This repository may not exist or is set to private.',
	type: 'error',
};

ErrorPage.propTypes = {
	message: PropTypes.string,
	type: PropTypes.string,
};

export default ErrorPage;
