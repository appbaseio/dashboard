import React from 'react';
import { css } from 'react-emotion';

import Account from '../ProfilePage/Account';
import { getUrlParams } from '../../utils/helper';

const containerStyles = css`
	height: 100vh;
	justify-content: center;
	align-items: center;
	display: flex;
	min-width: 420px;
`;

class UserDetails extends React.Component {
	componentDidMount() {
		const {
			history,
			location: { search },
		} = this.props;
		history.push(`/new/profile${search}`);
	}

	render() {
		const params = getUrlParams(window.location.search);
		let isShopify = false;
		if (params.context === 'shopify' || params.returnURL) {
			isShopify = true;
		}
		const { history } = this.props;
		return (
			<div className={containerStyles}>
				<Account
					isShopify={isShopify}
					title="How do you plan to use Appbase.io?"
					handleCallback={() => {
						if (isShopify) {
							window.location.href = params.returnURL;
						} else {
							history.replace('/');
							window.location.reload();
						}
					}}
				/>
			</div>
		);
	}
}

export default UserDetails;
