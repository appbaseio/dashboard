import React from 'react';
import { css } from 'react-emotion';

import Account from '../ProfilePage/Account';

const containerStyles = css`
	height: 100vh;
	justify-content: center;
	align-items: center;
	display: flex;
	min-width: 420px;
`;

class UserDetails extends React.Component {
	componentDidMount() {
		const { history } = this.props;
		history.push('/new/profile');
	}

	render() {
		return (
			<div className={containerStyles}>
				<Account
					title="How do you plan to use Appbase.io?"
					handleCallback={() => window.location.reload()}
				/>
			</div>
		);
	}
}

export default UserDetails;
