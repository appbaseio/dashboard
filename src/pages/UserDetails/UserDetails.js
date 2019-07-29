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

function getUrlParams(url) {
	if (!url) {
		return {};
	}
	const searchParams = new URLSearchParams(url);
	return Array.from(searchParams.entries()).reduce(
		(allParams, [key, value]) => ({
			...allParams,
			[key]: value,
		}),
		{},
	);
}

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
		if (params.context === 'shopify') {
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
							window.close();
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
