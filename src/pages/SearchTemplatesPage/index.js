import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
 Table, Card, notification, Modal,
} from 'antd';
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
import ValidateTemplate from './ValidateTemplate';

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
		right: 24px;
	}
`;

// Custom JSON validator
export const jsonValidator = (control) => {
	try {
		JSON.parse(control.value);
		return null;
	} catch (e) {
		return {
			invalidJSON: true,
		};
	}
};

class SearchTemplatesPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			createMode: false,
			editMode: false,
			renderMode: false,
			currentTemplate: null,
		};
		this.getTemplates();
		this.form = FormBuilder.group({
			name: ['', Validators.required],
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
				href: 'https://docs.appbase.io/',
			},
			edit: {
				title: 'Edit Template',
				buttonText: 'Read More',
				showGoBack: true,
				goBackText: 'Go back to templates',
				onClickGoBack: () => this.toggleEditMode(),
				href: 'https://docs.appbase.io/',
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

	toggleRenderMode = (status) => {
		this.setState(prevState => ({
			currentTemplate: prevState.renderMode ? null : prevState.currentTemplate,
			renderMode: status === undefined ? !prevState.renderMode : status,
		}));
	};

	handleSaveTemplate = () => {
		if (this.form.valid) {
			const { saveTemplate } = this.props;
			const { name, query } = this.form.getRawValue();
			saveTemplate(name, JSON.parse(query)).then((action) => {
				if (get(action, 'payload.acknowledged')) {
					notification.success({
						message: 'Template saved successfully.',
					});
					this.getTemplates();
					this.toggleEditMode(false);
					this.toggleCreateMode(false);
				}
			});
		} else {
			notification.error({
				message: 'Please fill the form details first.',
			});
		}
	};

	handleValidateTemplate = (templateId) => {
		const { validateTemplate } = this.props;
		const { query } = this.form.value;
		const queryControl = this.form.get('query');
		if (queryControl.valid) {
			validateTemplate(JSON.parse(query), templateId).then((action) => {
				if (get(action, 'payload')) {
					window.scrollTo(0, document.body.scrollHeight);
				}
			});
		} else {
			notification.error({
				message: 'Please enter valid JSON query.',
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
			this.toggleRenderMode,
		);
	};

	render() {
		const {
 createMode, editMode, currentTemplate, renderMode,
} = this.state;
		const {
 isLoading, templates, isDeleting, isValidating,
} = this.props;
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
					{renderMode && (
						<Modal
							title="Render Template"
							visible={renderMode}
							okButtonProps={{
								loading: isValidating,
							}}
							okText="Render"
							onOk={() => this.handleValidateTemplate(currentTemplate)}
							onCancel={() => this.toggleRenderMode()}
							width="100%"
							style={{
								maxWidth: 850,
							}}
						>
							<ValidateTemplate control={this.form} templateId={currentTemplate} />
						</Modal>
					)}
				</Container>
			</React.Fragment>
		);
	}
}

SearchTemplatesPage.defaultProps = {
	templates: [],
};

SearchTemplatesPage.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	isDeleting: PropTypes.bool.isRequired,
	isValidating: PropTypes.bool.isRequired,
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
	isValidating: get(state, '$validateAppTemplate.isFetching', false),
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
)(SearchTemplatesPage);
