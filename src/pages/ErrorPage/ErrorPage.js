import React from 'react';
import { Button, Icon } from 'antd';

class ErrorPage extends React.Component {
	state = {
		error: false,
	};

	componentDidCatch() {
		this.setState({
			error: true,
		});
	}

	render() {
		const { error } = this.state;
		const { children } = this.props; // eslint-disable-line
		return error ? (
			<section
				css={{
					top: '50%',
					left: '50%',
					position: 'absolute',
					transform: 'translate(-50%,-50%)',
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Icon type="frown" theme="outlined" style={{ fontSize: 55, marginBottom: 10 }} />
				<h2>Something went Wrong!</h2>
				<p>We have seen your error. We may get back at you shortly!</p>
				<section
					css={{
						display: 'flex',
					}}
				>
					<Button href="/" size="large" type="primary">
						<Icon type="home" />
						Back to Home
					</Button>
					<Button
						href="mailto:info@appbase.io"
						target="_blank"
						size="large"
						type="danger"
						css={{ marginLeft: '8' }}
					>
						<Icon type="info-circle" />
						Report Bug
					</Button>
				</section>
			</section>
		) : (
			children
		);
	}
}

export default ErrorPage;
