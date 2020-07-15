import React from 'react';
import { Button, Icon } from 'antd';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import get from 'lodash/get';

Sentry.init({
	dsn: 'https://8e07fb23ba8f46d8a730e65496bb7f00@sentry.io/58038',
});

class ErrorPage extends React.Component {
	state = {
		error: false,
	};

	componentDidUpdate(prevProps) {
		const {
			location: { pathname }, // eslint-disable-line
		} = this.props;
		if (get(prevProps, 'location.pathname') !== pathname) {
			// eslint-disable-next-line
			this.setState({
				error: false,
			});
		}
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: true,
		});
		Sentry.withScope(scope => {
			Object.keys(errorInfo).forEach(key => {
				scope.setExtra(key, errorInfo[key]);
			});
			Sentry.captureException(error);
		});
	}

	render() {
		const { error } = this.state;
		const { children, user } = this.props; // eslint-disable-line
		return error ? (
			<section
				css={{
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					height: '80vh',
				}}
			>
				<Icon
					type="frown"
					theme="outlined"
					style={{ fontSize: 55, marginBottom: 10 }}
				/>
				<h2>Something went wrong!</h2>
				<p>Our team has been notified about this.</p>
				<section
					css={{
						display: 'flex',
					}}
				>
					<Button
						href={user ? '/' : '/login'}
						size="large"
						type="primary"
					>
						<Icon type={user ? 'home' : 'left'} />
						Back to {user ? 'Home' : 'Login'}
					</Button>
					<Button
						href="mailto:support@appbase.io"
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

const mapStateToProps = ({ user }) => ({
	user,
});

export default connect(mapStateToProps, null)(ErrorPage);
