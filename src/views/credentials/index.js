import React, { Component } from 'react';
import { appbaseService } from '../../service/AppbaseService';
import PermissionCard from './PermissionCard';
import NewPermission from './NewPermission';
import AppPage from '../../shared/AppPage';
import DeleteApp from './DeleteApp';

export default class Credentials extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			info: null,
			isSubmitting: false,
			showCredForm: false,
		};
		this.getInfo = this.getInfo.bind(this);
		this.newPermission = this.newPermission.bind(this);
	}

	componentWillMount() {
		this.stopUpdate = false;
		this.initialize(this.props);
	}

	componentWillUnmount() {
		this.stopUpdate = true;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.appId != this.appName) {
			this.initialize(nextProps);
		}
	}

	initialize(props) {
		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.getInfo();
	}

	getInfo() {
		this.info = {};
		appbaseService.getPermission(this.appId).then((data) => {
			this.info.permission = data;
			if (!this.stopUpdate) {
				this.setState({ info: this.info });
			}
		});
		appbaseService.getAppInfo(this.appId).then((data) => {
			this.info.appInfo = data.body;
			if (!this.stopUpdate) {
				this.setState({ info: this.info });
			}
		});
	}
	handleCancel = () => {
		this.setState({
			showCredForm: false,
		});
	};
	newPermission(request) {
		this.setState(
			{
				isSubmitting: true,
			},
			() => {
				appbaseService.newPermission(this.appId, request).then(
					() => {
						this.getInfo();
						this.setState({
							isSubmitting: false,
							showCredForm: false,
						});
					},
					(e) => {
						toastr.error('Error', 'Unable to save credentials');
						this.setState({
							isSubmitting: false,
						});
					},
				);
			},
		);
	}

	renderElement(method) {
		let element = null;
		switch (method) {
			case 'permissions':
				if (this.state.info && this.state.info.permission) {
					element = this.state.info.permission.body
						.sort((a, b) => {
							const first = a.description;
							const second = b.description;
							if (first < second) {
								return -1;
							} else if (first > second) {
								return 1;
							}
							return 0;
						})
						.map((permissionInfo, index) => (
							<PermissionCard
								appId={this.appId}
								key={index}
								permissionInfo={permissionInfo}
								getInfo={this.getInfo}
							/>
						));
				}
				break;
			case 'deleteApp':
				if (this.isOwner()) {
					element = (
						<footer className="ad-detail-page-body other-page-body col-xs-12 delete-app-body">
							<div className="page-body col-xs-12">
								<section className="col-xs-12 p-0">
									<div className="col-xs-12 p-0">
										<DeleteApp appName={this.appName} appId={this.appId} />
									</div>
								</section>
							</div>
						</footer>
					);
				}
				break;
		}
		return element;
	}

	isOwner() {
		return (
			this.state.info &&
			this.state.info.appInfo &&
			this.state.info.appInfo.owner === appbaseService.userInfo.body.email
		);
	}
	showForm = () => {
		this.setState({
			showCredForm: true,
		});
	};
	render() {
		return (
			<AppPage
				pageInfo={{
					currentView: 'credentials',
					appName: this.appName,
					appId: this.appId,
				}}
			>
				<div id="permission-page" className="ad-detail-page ad-dashboard row">
					<div className="ad-detail-page-body col-xs-12">
						<div className="page-body col-xs-12">
							<section className="ad-detail-page-body-card col-xs-12 p-0">
								<div className="ad-detail-page-body-card-body col-xs-12 p-0">
									{this.renderElement('permissions')}
									{this.isOwner() ? (
										<NewPermission
											appId={this.props.params.appId}
											handleCancel={this.handleCancel}
											appName={this.appName}
											isSubmitting={this.state.isSubmitting}
											newPermission={this.newPermission}
											showForm={this.showForm}
											showCredForm={this.state.showCredForm}
										/>
									) : null}
								</div>
							</section>
						</div>
					</div>
					{this.renderElement('deleteApp')}
				</div>
			</AppPage>
		);
	}
}
