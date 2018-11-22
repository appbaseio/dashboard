import React from 'react';
import ReactDOM from 'react-dom';
import {
 Button, Dropdown, Menu, Modal, Input, message, notification,
} from 'antd';
import { css } from 'emotion';

import { heading, subHeading } from './styles';

const { TextArea } = Input;

const helpIcon = css`
	i {
		font-size: 22px !important;
		position: relative;
		top: 2px;
	}
`;

class HelpButton extends React.Component {
	constructor() {
		super();
		this.state = {
			modal: false,
			issue: '',
			details: '',
			isLoading: false,
		};
	}

	handleCancel = () => {
		this.setState({
			modal: false,
		});
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
		});
	};

	toggleLoading = () => {
		this.setState(({ isLoading }) => ({
			isLoading: !isLoading,
		}));
	};

	handleSubmitIssue = async () => {
		const { issue, details } = this.state;
		const { user } = this.props;

		const errorMessage = (
			<div>
				<p>
					We couldn{"'"}t send the request but you can send an e-mail instead to{' '}
					<a href={`mailto:support@appbase.io?Subject=${issue}&body=${details}`}>
						support@appbase.io
					</a>{' '}
					which will create a ticket.
				</p>
				<Button
					href={`mailto:support@appbase.io?Subject=${issue}&body=${details}`}
					icon="mail"
					size="large"
					type="primary"
				>
					Send Mail
				</Button>
			</div>
		);
		if (issue) {
			try {
				this.toggleLoading();
				const response = await fetch(
					'https://api.hsforms.com/submissions/v3/integration/submit/4709730/389ccf8c-b434-4060-970c-0e6e8defc9c7',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							fields: [
								{
									name: 'email',
									value: user.email,
								},
								{
									name: 'firstname',
									value: user.name,
								},
								{
									name: 'subject',
									value: issue,
								},
								{
									name: 'content',
									value: details,
								},
							],
						}),
					},
				);

				if (response.status >= 400) {
					notification.error({ message: errorMessage, duration: 10 });
					this.toggleLoading();
				} else {
					this.toggleLoading();
					const data = await response.json();
					const displayMessage = data.inlineMessage
						.replace('<p>', '')
						.replace('</p>', '');
					message.success(displayMessage);
					this.setState({
						issue: '',
						details: '',
						modal: false,
					});
				}
			} catch (e) {
				this.toggleLoading();
				notification.error({ message: errorMessage, duration: 10 });
			}
		} else {
			message.error('Please write the issue');
		}
	};

	handleClick = (e) => {
		const { key } = e;
		switch (key) {
			case 'chat': {
				this.setState({
					modal: true,
				});
				break;
			}
			case 'support':
				window.open('https://appbase.io/pricing/#support', '_blank');
				break;
			case 'twitter':
				window.open('https://twitter.com/appbaseio', '_blank');
				break;
			case 'updates':
				window.open('https://appbase.io/', '_blank');
				break;
			case 'privacy':
				window.open('https://appbase.io/privacy/', '_blank');
				break;
			default:
		}
	};

	render() {
		const {
			modal, issue, details, isLoading,
		} = this.state; // prettier-ignore
		const menu = (
			<Menu onClick={this.handleClick}>
				<Menu.Item key="chat" style={{ padding: '10px 15px' }}>
					<h3 className={heading}>
						Ask us anything!{' '}
						<span role="img" aria-label="Wave">
							👋
						</span>
					</h3>
					<p className={subHeading}>We reply to every issue.</p>
				</Menu.Item>
				<Menu.Item key="support">
					<h3 className={heading}>Get Support!</h3>
				</Menu.Item>
				<Menu.Item key="twitter">
					<p className={subHeading}>@appbaseio - Twitter</p>
				</Menu.Item>
				<Menu.Item key="privacy">
					<p className={subHeading}>Terms & Privacy</p>
				</Menu.Item>
			</Menu>
		);
		return (
			<React.Fragment>
				<Dropdown overlay={menu} trigger={['click']} placement="topLeft">
					<Button
						className={helpIcon}
						type="primary"
						size="large"
						shape="circle"
						icon="question"
					/>
				</Dropdown>
				<Modal
					visible={modal}
					destroyOnClose
					title="Ask us anything!"
					onOk={this.handleSubmitIssue}
					okButtonProps={{ loading: isLoading }}
					okText="Submit"
					onCancel={this.handleCancel}
				>
					<Input
						placeholder="What is the issue you're seeing?"
						name="issue"
						style={{ marginBottom: '10px' }}
						required
						onChange={this.handleChange}
						value={issue}
					/>
					<TextArea
						placeholder="Describe details about the issue you are seeing..."
						name="details"
						onChange={this.handleChange}
						value={details}
						autosize={{ minRows: 4 }}
					/>
				</Modal>
			</React.Fragment>
		);
	}
}

const HelpChat = props => ReactDOM.createPortal(<HelpButton {...props} />, document.getElementById('help'));

export default HelpChat;
