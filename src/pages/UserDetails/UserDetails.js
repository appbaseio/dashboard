import React from 'react';
import { css } from 'react-emotion';

import Account from '../ProfilePage/Account';

const containerStyles = css`
	height: 100vh;
	justify-content: center;
	align-items: center;
	display: flex;
`;

const UserDetails = () => (
	<div className={containerStyles}>
		<Account
			title="How are you planning to use appbase.io?"
			handleCallback={() => window.location.reload()}
		/>
	</div>
);

export default UserDetails;
