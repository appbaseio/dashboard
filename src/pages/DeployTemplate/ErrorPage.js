import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Icon, message } from 'antd';
import { deployClusterStyles } from './styles';

const ErrorPage = ({ message }) => {
	return (
		<div css={deployClusterStyles}>
			<Alert
				message={
					<div style={{ color: '#8d0c30' }}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: 10,
							}}
						>
							<Icon type="info-circle" theme="filled" />
							<div style={{ fontWeight: 'bold' }}>
								&nbsp;Not found:&nbsp;
							</div>
							<div style={{ color: '#000' }}>
								{location.search.split('=')[1]}
							</div>
						</div>
						<p>{message}</p>
					</div>
				}
				type="error"
			/>
		</div>
	);
};

ErrorPage.defaultProps = {
	message: 'This repository may not exist or is set to private.',
};

ErrorPage.propTypes = {
	formData: PropTypes.string,
};

export default ErrorPage;
