import React from 'react';
import {
 Card, List, Switch, message, Modal,
} from 'antd';

import { ACC_API } from '../../constants/config';

const { Item } = List;

const data = [
	{
		id: 'newsletters',
		label: 'Newsletter',
		description: 'Get a monthly digest on the latest appbase.io updates and blog posts.',
	},
	{
		id: 'product_updates',
		label: 'Product & Feature Updates',
		description: 'Keep up-to-date with upcoming features and product updates.',
	},
	{
		id: 'security_updates',
		label: 'Security Updates',
		description: 'Security updates affecting your app, cluster and account.',
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
				Modal.error({ title: 'Error', content: parsedResponse.message });
			}

			if (parsedResponse.body.email_preferences) {
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
			Modal.error({ title: 'Error', content: 'Something went Wrong. Please try again.' });
		}
	};

	saveEmailPreferences = async (userData) => {
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
				Modal.error({ title: 'Error', content: parsedResponse.message });
			}
			message.success('Preferences Updated');
		} catch (e) {
			Modal.error({ title: 'Error', content: 'Something went Wrong. Please try again.' });
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
										email_preferences && email_preferences.includes(item.id)
									}
									onChange={value => this.handleSwitch(item.id, value)}
								/>,
							]}
						>
							<Item.Meta title={item.label} description={item.description} />
						</Item>
					)}
				/>
			</Card>
		);
	}
}

export default Emails;
