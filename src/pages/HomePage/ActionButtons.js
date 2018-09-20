import React from 'react';
import { Row, Col, Icon } from 'antd';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { columnSeparator, actionIcon, deleteButton } from './styles';
import DeleteAppModal from './DeleteAppModal';
import { SCALR_URL, IMPORTER_LINK } from '../../constants/config';
import { getUserAppsPermissions } from '../../batteries/utils';

class ActionButtons extends React.Component {
	state = {
		deleteModal: false,
	};

	componentDidMount() {
		const { fetchPermissions } = this.props;
		fetchPermissions();
	}

	handleChangeDeleteModal = () => {
		const { deleteModal: currentValue } = this.state;
		this.setState({
			deleteModal: !currentValue,
		});
	};

	handleDeleteModal = (e) => {
		e.preventDefault();
		this.handleChangeDeleteModal();
	};

	handleClone = (e) => {
		// const { appName, appId } = this.props;
		// const parameters = {
		//   platform: 'appbase',
		//   importFrom: {
		//     appname: appName,
		//     hosturl: `https://${username}:${password}@${SCALR_URL}`,
		//   },
		// };
		// window.open(`${IMPORTER_LINK}${JSON.stringify(parameters)}`, '_blank');
		// e.stopPropagation();
	};

	render() {
		const { appName, appId, shared } = this.props;
		const { deleteModal } = this.state;
		return (
			<div className="card-actions" key={appName}>
				<Row type="flex" justify="space-between">
					<Col
						span={shared ? 12 : 6}
						className={columnSeparator}
						onClick={this.handleClone}
					>
						<Icon className={actionIcon} type="fork" />
						Clone
					</Col>
					{!shared ? (
						<Col span={6} className={columnSeparator}>
							<Icon className={actionIcon} type="edit" />
							Write Key
						</Col>
					) : null}
					<Col span={shared ? 12 : 6} className={columnSeparator}>
						<Icon className={actionIcon} type="file-text" />
						Read Key
					</Col>
					{!shared ? (
						<Col span={6} onClick={this.handleDeleteModal} className={deleteButton}>
							<Icon className={actionIcon} type="delete" />
							Delete App
						</Col>
					) : null}
				</Row>
				<DeleteAppModal
					appName={appName}
					appId={appId}
					deleteModal={deleteModal}
					handleDeleteModal={this.handleChangeDeleteModal}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	permissions: get(state, '$getAppPermissions'),
});

const mapDispatchToProps = dispatch => ({
	fetchPermissions: () => dispatch(getUserAppsPermissions),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ActionButtons);
