import React from 'react';
import { Card, List, Switch, message } from 'antd';
import get from 'lodash/get';

import { ACC_API } from '../../constants/config';

const { Item } = List;

const data = [
	{
		id: 'newsletters',
		label: 'Newsletter',
		description:
			'Get a monthly digest on the latest reactivesearch.io updates and blog posts.',
	},
	{
		id: 'product_updates',
		label: 'Product & Feature Updates',
		description:
			'Keep up-to-date with upcoming features and product updates.',
	},
	{
		id: 'security_updates',
		label: 'Security Updates',
		description:
			'Security updates affecting your app, cluster and account.',
	},
];

class Emails extends React.Component {
	state = {
		data: {},
	};

	componentDidMount() {
		this.getInitialValues();
	}

	getInitialValues = async () => {
		try {
			const response = await fetch(`${ACC_API}/user`, {
				credentials: 'include',
			});
			const parsedResponse = await response.json();

			if (response.status >= 400) {
				message.error(parsedResponse.message);
			}

			if (get(parsedResponse, 'body.email_preferences')) {
				this.setState({
					...parsedResponse.body,
				});
			} else {
				const preferences = [];
				this.saveEmailPreferences({
					...parsedResponse.body,
					email_preferences: preferences,
				});
			}
		} catch (e) {
			message.error('Something went Wrong.');
		}
	};

	saveEmailPreferences = async userData => {
		this.setState({
			...userData,
		});

		try {
			const response = await fetch(`${ACC_API}/user/profile`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify(userData),
			});
			const parsedResponse = await response.json();

			if (response.status >= 400) {
				message.error(parsedResponse.message);
			}
		} catch (e) {
			message.error('Something went Wrong.');
		}
	};

	handleSwitch = (key, value) => {
		const { email_preferences } = this.state;
		let preferences = email_preferences;
		if (value) {
			preferences.push(key);
		} else {
			preferences = preferences.filter(preference => preference !== key);
		}

		this.saveEmailPreferences({
			...this.state,
			email_preferences: preferences,
		});
	};

	render() {
		const { email_preferences } = this.state;
		return (
			<Card title="Email Subscriptions">
				<List
					dataSource={data}
					bordered
					renderItem={item => (
						<Item
							actions={[
								<Switch
									checked={
										email_preferences &&
										email_preferences.includes(item.id)
									}
									onChange={value =>
										this.handleSwitch(item.id, value)
									}
								/>,
							]}
						>
							<Item.Meta
								title={item.label}
								description={item.description}
							/>
						</Item>
					)}
				/>
			</Card>
		);
	}
}

export default Emails;
