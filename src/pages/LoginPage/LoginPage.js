import React, { Component } from 'react';
import { Card, Button, Icon } from 'antd';
import { Redirect } from 'react-router-dom';

import Logo from '../../components/Logo';
import {
 container, card, githubBtn, googleBtn,
} from './styles';

export default class LoginPage extends Component {
	state = {
		isLoggedIn: false,
	};

	render() {
		if (this.state.isLoggedIn) {
			return <Redirect to="/" />;
		}
		return (
			<section className={container}>
				<Logo width={200} />
				<Card className={card} bordered={false}>
					<h2>Sign in to get started</h2>

					<Button icon="github" className={githubBtn} size="large" block>
						Sign in via GitHub
					</Button>
					<Button icon="google" className={googleBtn} size="large" block>
						Sign in via Google
					</Button>
				</Card>

				<Button
					size="large"
					ghost
					css={{
						border: 0,
						color: '#424242',
						margin: '20px 0',
						fontSize: 18,
						letterSpacing: '0.02rem',
					}}
				>
					New to appbase? &nbsp; Signup here
					<Icon type="arrow-right" />
				</Button>
			</section>
		);
	}
}
