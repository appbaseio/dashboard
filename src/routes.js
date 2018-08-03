import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Redirect, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import Main from './index';
import Authenticator from './Authenticator';
import { appbaseService } from './service/AppbaseService';

import AsyncComponent from './AsyncComponent';

import * as helper from './shared/helper';
import UserInfo from './shared/UserInfo';
import config from './config';

const AppList = AsyncComponent(() => import('./views/list').then(module => module.default), {
	name: 'AppList',
});
const Dashboard = AsyncComponent(() => import('./views/dashboard').then(module => module.default), {
	name: 'Dashboard',
});
const Credentials = AsyncComponent(
	() => import('./views/credentials').then(module => module.default),
	{ name: 'Credentials' },
);
const Team = AsyncComponent(() => import('./views/team').then(module => module.default), {
	name: 'Team',
});
const Onboarding = AsyncComponent(
	() => import('./views/onboarding').then(module => module.default),
	{ name: 'Onboarding' },
);
const OnboardingEndScreen = AsyncComponent(
	() => import('./views/onboarding/EndScreen').then(module => module.default),
	{ name: 'OnboardingEndScreen' },
);
const Login = AsyncComponent(() => import('./views/login').then(module => module.default), {
	name: 'Login',
});
const Signup = AsyncComponent(() => import('./views/signup').then(module => module.default), {
	name: 'Signup',
});
const Browser = AsyncComponent(() => import('./views/browser').then(module => module.default), {
	name: 'Browser',
});
const MappingsWrapper = AsyncComponent(() => import('./views/mappings').then(module => module.default), {
	name: 'MappingsWrapper',
});
const Mappings = AsyncComponent(() => import('../modules/batteries/components/Mappings').then(module => module.default), {
	name: 'Mappings',
});
const SearchSandbox = AsyncComponent(() => import('./views/search-sandbox-wrapper').then(module => module.default), {
	name: 'SearchSandbox',
});
const Mirage = AsyncComponent(() => import('./views/mirage').then(module => module.default), {
	name: 'Mirage',
});
const Billing = AsyncComponent(() => import('./views/billing').then(module => module.default), {
	name: 'Billing',
});
const Importer = AsyncComponent(() => import('./views/importer').then(module => module.default), {
	name: 'Importer',
});

// SearchSandbox routes
const SearchEditor = AsyncComponent(() => import('../modules/batteries/components/SearchSandbox/containers/Editor').then(module => module.default), {
	name: 'SearchEditor',
});

const NotFound = () => {
	helper.appDashboard.onNotFound();
	return <div />;
};

const appChangesEvent = {
	onLeave: helper.appDashboard.onLeave,
};

const contextDomSetup = () => {
	$('#root, body').addClass(`context-${config.name}`);
	$('link[data-icon="favicon"]').attr({ href: config.favicon });
};

const getContext = () => {
	const pathname = window.location.pathname.split('/');
	const context = Object.keys(config).indexOf(pathname[1]) > -1 ? `/${pathname[1]}` : '/';
	appbaseService.context = context;
	contextDomSetup();
	return context;
};

class MainApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
		};
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.getNexturl = this.getNexturl.bind(this);
		this.login = this.login.bind(this);
	}

	componentDidMount() {
		// to detect if user has logged out in some other tab
		window.onfocus = () => {
			if (localStorage.getItem('reload') === 'true') {
				localStorage.setItem('reload', false);
				window.location.reload();
			}
		};
	}

	close() {
		this.setState({ showModal: false });
	}

	open() {
		this.setState({ showModal: true });
	}

	getNexturl() {
		return localStorage.getItem('ad-login')
			? localStorage.getItem('ad-login')
			: window.location.href;
	}

	login(provider) {
		localStorage.setItem('reload', false);
		const redirectTo = `${appbaseService.address}/login/${provider}?next=${this.getNexturl()}`;
		window.location.href = redirectTo;
	}

	/* React router throws a warning, should update to v4 */
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="tutorial" component={Authenticator}>
					<IndexRoute component={Onboarding} />
					<Route path="finish" component={OnboardingEndScreen} />
				</Route>
				<Redirect from="scalr/tutorial" to="tutorial" />
				<Route path={getContext()} component={Main} open={this.open}>
					<IndexRoute
						component={() => (
							<Login
								showModal={this.state.showModal}
								close={this.close}
								open={this.open}
								login={this.login}
							/>
						)}
					/>
					<Route
						path="signup"
						component={() => (
							<Signup
								showModal={this.state.showModal}
								close={this.close}
								open={this.open}
								login={this.login}
							/>
						)}
					/>
					<Route path="profile" component={UserInfo} />
					<Route path="apps" component={AppList} />
					<Route
						path="login"
						component={() => (
							<Login
								showModal={this.state.showModal}
								close={this.close}
								open={this.open}
								login={this.login}
							/>
						)}
					/>
					<Route path="billing" component={Authenticator}>
						<IndexRoute component={Billing} />
					</Route>
					<Route path="importer" component={Importer} />
					<Route
						path="dashboard/:appId"
						component={Dashboard}
						{...appChangesEvent}
						onEnter={params =>
							helper.appDashboard.onEnter(params.params.appId, 'dashboard')
						}
					/>
					<Route
						path="mappings/:appId"
						component={MappingsWrapper}
						{...appChangesEvent}
						onEnter={params =>
							helper.appDashboard.onEnter(params.params.appId, 'mappings')
						}
					>
						<IndexRoute component={Mappings} />
					</Route>
					<Route
						path="search-sandbox/:appId"
						component={SearchSandbox}
						{...appChangesEvent}
						onEnter={params =>
							helper.appDashboard.onEnter(params.params.appId, 'search-sandbox')
						}
					>
						<IndexRedirect to="editor" />
						<Route path="editor" component={SearchEditor} />
					</Route>
					<Route
						path="browser/:appId"
						component={Browser}
						{...appChangesEvent}
						onEnter={params =>
							helper.appDashboard.onEnter(params.params.appId, 'browser')
						}
					/>
					<Route
						path="builder/:appId"
						component={Mirage}
						{...appChangesEvent}
						onEnter={params =>
							helper.appDashboard.onEnter(params.params.appId, 'builder')
						}
					/>
					<Route
						path="credentials/:appId"
						component={Credentials}
						{...appChangesEvent}
						onEnter={params =>
							helper.appDashboard.onEnter(params.params.appId, 'credentials')
						}
					/>
					<Route
						path="team/:appId"
						component={Team}
						{...appChangesEvent}
						onEnter={params => helper.appDashboard.onEnter(params.params.appId, 'team')}
					/>
				</Route>
				<Route path="*" component={NotFound} />
			</Router>
		);
	}
}

render(<MainApp />, document.getElementById('root'));
