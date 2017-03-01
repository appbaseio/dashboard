import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { Link, browserHistory } from 'react-router';
import { appbaseService } from '../service/AppbaseService';

export class Login extends Component {

	constructor(props) {
		super(props);
		if(appbaseService.userInfo) {
			browserHistory.push('/apps');
		}
	}

	login(provider) {
		var baseURL = window.location.protocol + "//" + window.location.host+'/Dashboard/';
		var redirectTo = 'https://accapi.appbase.io/login/' + provider + '?next=' + baseURL;
		window.location.href = redirectTo;
	}

	openLoginModal() {
		$('#login_modal').modal('show');
	}

	render() {
		return (
			<section id="login" className="text-center">
				<h1>
					Login to Appbase or create an account to access your Dashboard.
				</h1>
				<div>
					<button className="theme-btn bg-btn active" onClick={() => this.openLoginModal()}>Login</button>
				</div>
				<div id="login_modal" className="modal fade modal-appbase modal-white">
					<div className="modal-dialog modal-sm" id="login-modal">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="myModalLabel">
									Login with your Github or Google ID.
								</h4>
								<div className="bootstrap-dialog-close-button">
									<button className="close" data-dismiss="modal">×</button>
								</div>
							</div>
							<div className="modal-body text-center">
								<button className="btn Login-button modal-btn" onClick={() => this.login('github')} >Github</button>
								<button className="btn Login-button modal-btn" onClick={() => this.login('google')} >Google</button>
								<i className="fa hidden fa-refresh fa-spin fa-2x" id="login-loading"></i>
								<div className="mt25">
									<p className="no-margin">
										Having issues logging in? Write to us&nbsp;
										<a className="contact-link" href="mailto:info@appbase.io?subject=Login+issues" target="_blank">here</a>.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}

}
