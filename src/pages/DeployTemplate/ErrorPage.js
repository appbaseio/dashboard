import React from 'react';
import { Alert, Icon } from 'antd';
import { deployClusterStyles } from './styles';

const ErrorPage = () => {
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
						<p>
							This repository may not exist or is set to private.
						</p>
					</div>
				}
				type="error"
			/>
		</div>
	);
};

export default ErrorPage;
