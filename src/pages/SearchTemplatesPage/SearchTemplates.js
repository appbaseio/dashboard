import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Card, notification } from 'antd';
import get from 'lodash/get';
import { FormBuilder, Validators } from 'react-reactive-form';
import { css } from 'emotion';
import { displayErrors } from '../../utils/helper';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import Container from '../../components/Container';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';
import {
	getAppTemplates,
	saveAppTemplate,
	deleteAppTemplate,
	validateAppTemplate,
} from '../../batteries/modules/actions';
import { getAppTemplatesByName } from '../../batteries/modules/selectors';
import Actions from './Actions';
import CreateTemplate from './CreateTemplate';
import GetAPIEndpoint from './GetAPIEndpoint';
import { jsonValidator } from './utils';

const columns = [
	{
		title: 'Name',
		dataIndex: 'template_id',
		key: 'name',
	},
	{
		title: 'Actions',
		key: 'actions',
		width: 400,
		render: item => (
			<Actions
				handleRender={() => item.handleRender(item.template_id)}
				handleEdit={() => item.handleEdit(item.template_id)}
				handleDelete={() => item.handleDelete(item.template_id)}
			/>
		),
	},
];

const main = css`
	.actionBtn {
		position: absolute;
		right: 50px;
	}
`;

class SearchTemplates extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			createMode: false,
			editMode: false,
			copyEndpoint: false,
			currentTemplate: null,
		};
		this.getTemplates();
		this.form = FormBuilder.group({
			name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-_]+$/)]],
			query: [null, [Validators.required, jsonValidator]],
		});
		this.templateRef = React.createRef();
		this.bannerProps = {
			default: {
				title: 'Search Templates',
				description: 'GUI to manage your search templates.',
				buttonText: 'Create Template',
				icon: 'plus',
				onClick: () => this.toggleCreateMode(),
			},
			create: {
				title: 'Create Template',
				buttonText: 'Read More',
				showGoBack: true,
				goBackText: 'Go back to templates',
				onClickGoBack: () => this.toggleCreateMode(),
				href: 'https://docs.appbase.io/docs/security/Template/',
			},
			edit: {
				title: 'Edit Template',
				buttonText: 'Read More',
				showGoBack: true,
				goBackText: 'Go back to templates',
				onClickGoBack: () => this.toggleEditMode(),
				href: 'https://docs.appbase.io/docs/security/Template/',
			},
		};
	}

	componentDidUpdate(prevProps) {
		const { errors } = this.props;
		displayErrors(errors, prevProps.errors, true);
	}

	get bannerDetails() {
		const { createMode, editMode } = this.state;
		if (editMode) {
			return this.bannerProps.edit;
		}
		if (createMode) {
			return this.bannerProps.create;
		}
		return this.bannerProps.default;
	}

	getTemplates = () => {
		const { fetchTemplates } = this.props;
		fetchTemplates();
	};

	toggleCreateMode = (status) => {
		this.form.reset();
		this.setState(prevState => ({
			createMode: status === undefined ? !prevState.createMode : status,
			currentTemplate: null,
		}));
	};

	toggleEditMode = (status) => {
		this.setState(prevState => ({
			currentTemplate: prevState.editMode ? null : prevState.currentTemplate,
			editMode: status === undefined ? !prevState.editMode : status,
		}));
	};

	togglecopyEndpoint = (status) => {
		this.setState(prevState => ({
			currentTemplate: prevState.copyEndpoint ? null : prevState.currentTemplate,
			copyEndpoint: status === undefined ? !prevState.copyEndpoint : status,
		}));
	};

	handleSaveTemplate = () => {
		try {
			const { saveTemplate } = this.props;
			const { name, query } = this.form.getRawValue();
			const requestBody = JSON.parse(query);
			if (!this.form.valid) {
				throw new Error('Please fill the form details first.');
			}
			if (!requestBody.source) {
				throw new Error('Invalid query, `source` key is missing.');
			}
			saveTemplate(name, requestBody).then((action) => {
				if (get(action, 'payload.acknowledged')) {
					notification.success({
						message: 'Template saved successfully.',
					});
					this.getTemplates();
					this.toggleEditMode(false);
					this.toggleCreateMode(false);
				}
			});
		} catch (e) {
			notification.error({
				message: e.message,
			});
		}
	};

	handleValidateTemplate = (templateId) => {
		const { validateTemplate } = this.props;
		const { query } = this.form.value;
		const queryControl = this.form.get('query');
		const requestBody = JSON.parse(query);
		try {
			if (!requestBody.source) {
				throw new Error('Invalid query, `source` key is missing.');
			}
			if (!requestBody.params) {
				throw new Error('Invalid query, `params` key is missing.');
			}
			if (!queryControl.valid) {
				throw new Error('Please enter valid JSON query.');
			}
			validateTemplate(requestBody, templateId).then((action) => {
				if (get(action, 'payload')) {
					window.scrollTo(0, document.body.scrollHeight);
				}
			});
		} catch (e) {
			notification.error({
				message: e.message,
			});
		}
	};

	handleDelete = (id) => {
		const { deleteTemplate } = this.props;
		deleteTemplate(id).then((action) => {
			if (get(action, 'payload.acknowledged')) {
				notification.success({
					message: 'Template deleted successfully.',
				});
				this.getTemplates();
			}
		});
	};

	handleEdit = (id) => {
		this.setState(
			{
				currentTemplate: id,
			},
			this.toggleEditMode,
		);
	};

	handleRender = (id) => {
		this.setState(
			{
				currentTemplate: id,
			},
			this.togglecopyEndpoint,
		);
	};

	render() {
		const {
 createMode, editMode, currentTemplate, copyEndpoint,
} = this.state;
		const { isLoading, templates, isDeleting } = this.props;
		const isDefault = !(createMode || editMode);
		if (isLoading && !(templates && templates.length)) {
			return <Loader />;
		}
		return (
			<React.Fragment>
				<Banner {...this.bannerDetails} />
				<Container css={main}>
					{isDefault && (
						<Card
							style={
								isDeleting
									? {
											pointerEvents: 'none',
											opacity: 0.6,
									  }
									: null
							}
						>
							<Table
								rowKey={item => item.template_id}
								dataSource={templates.map(item => ({
									handleDelete: this.handleDelete,
									handleEdit: this.handleEdit,
									handleRender: this.handleRender,
									...item,
								}))}
								columns={columns}
							/>
						</Card>
					)}
					{(createMode || editMode) && (
						<CreateTemplate
							handleValidateTemplate={() => this.handleValidateTemplate()}
							handleSaveTemplate={this.handleSaveTemplate}
							control={this.form}
							templateId={currentTemplate}
						/>
					)}
					{copyEndpoint && (
						<GetAPIEndpoint
							templateId={currentTemplate}
							visible={copyEndpoint}
							handleCancel={this.togglecopyEndpoint}
						/>
					)}
				</Container>
			</React.Fragment>
		);
	}
}

SearchTemplates.defaultProps = {
	templates: [],
};

SearchTemplates.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	isDeleting: PropTypes.bool.isRequired,
	appName: PropTypes.string.isRequired,
	fetchTemplates: PropTypes.func.isRequired,
	saveTemplate: PropTypes.func.isRequired,
	deleteTemplate: PropTypes.func.isRequired,
	validateTemplate: PropTypes.func.isRequired,
	templates: PropTypes.array,
	errors: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
	templates: getAppTemplatesByName(state),
	appName: get(state, '$getCurrentApp.name'),
	isLoading: get(state, '$getAppTemplates.isFetching', false),
	isDeleting: get(state, '$deleteAppTemplate.isFetching', false),
	errors: [
		get(state, '$getAppTemplates.error'),
		get(state, '$saveAppTemplate.error'),
		get(state, '$deleteAppTemplate.error'),
		get(state, '$validateAppTemplate.error'),
	],
});

const mapDispatchToProps = dispatch => ({
	fetchTemplates: () => dispatch(getAppTemplates()),
	saveTemplate: (name, payload) => dispatch(saveAppTemplate(name, payload)),
	deleteTemplate: name => dispatch(deleteAppTemplate(name)),
	validateTemplate: (payload, name) => dispatch(validateAppTemplate(payload, name)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SearchTemplates);
