import React from 'react';
import get from 'lodash/get';
import { Card, Input, Button } from 'antd';
import { FieldGroup, FieldControl } from 'react-reactive-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import Grid from '../../components/CreateCredentials/Grid';
import Ace from '../../batteries/components/SearchSandbox/containers/AceEditor';
import TemplateResponse from './TemplateResponse';
import { getAppTemplate } from '../../batteries/modules/actions';

class CreateTemplate extends React.Component {
	constructor(props) {
		super(props);
		const editMode = !!props.templateId;
		const nameControl = props.control.get('name');
		if (editMode) {
			props.fetchTemplate(props.templateId).then((action) => {
				if (get(action, 'payload')) {
					const value = get(action, 'payload');

					delete value.found;
					delete value._id;
					props.control.patchValue({
						name: props.templateId,
						query: JSON.stringify(value, 0, 2),
					});
					nameControl.disable();
				}
			});
		} else {
			nameControl.enable();
		}
	}

	componentWillUnmount() {
		const { control } = this.props;
		control.reset();
	}

	render() {
		const {
			isSaving,
			isValidating,
			control,
			handleValidateTemplate,
			handleSaveTemplate,
			isLoading,
		} = this.props;
		if (isLoading) {
			return <Loader />;
		}
		return (
			<FieldGroup
				control={control}
				strict={false}
				render={({ invalid, pristine, get: getControl }) => (
					<React.Fragment>
						<Card>
							<div className="actionBtn">
								<Button
									style={{
										margin: '0 10px',
									}}
									disabled={getControl('query').invalid}
									onClick={handleValidateTemplate}
									loading={isValidating}
								>
									Validate
								</Button>
								<Button
									onClick={handleSaveTemplate}
									loading={isSaving}
									disabled={invalid || pristine}
									type="primary"
								>
									Save
								</Button>
							</div>

							<Grid
								gridRatio={0.15}
								label="Template name"
								component={(
<FieldControl
										name="name"
										render={({ handler }) => (
											<Input
												style={{
													width: 250,
												}}
												{...handler()}
											/>
										)}
/>
)}
							/>
							<Grid
								gridRatio={0.15}
								label="Query"
								component={(
<FieldControl
										name="query"
										render={({ handler }) => {
											const inputHandler = handler();
											return (
												<Ace
													mode="json"
													value={inputHandler.value}
													onChange={inputHandler.onChange}
													theme="monokai"
													name="editor-JSON"
													fontSize={16}
													showPrintMargin
													style={{
														width: '100%',
														maxWidth: 800,
														maxHeight: 250,
													}}
													readOnly={inputHandler.disabled}
													showGutter
													highlightActiveLine
													setOptions={{
														showLineNumbers: true,
														tabSize: 2,
													}}
													editorProps={{
														$blockScrolling: true,
													}}
												/>
											);
										}}
/>
)}
							/>
						</Card>
						<TemplateResponse />
					</React.Fragment>
				)}
			/>
		);
	}
}
CreateTemplate.defaultProps = {
	templateId: undefined,
};
CreateTemplate.propTypes = {
	fetchTemplate: PropTypes.func.isRequired,
	isSaving: PropTypes.bool.isRequired,
	isValidating: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	// component props
	templateId: PropTypes.string,
	control: PropTypes.object.isRequired,
	handleValidateTemplate: PropTypes.func.isRequired,
	handleSaveTemplate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	isLoading: get(state, '$getAppTemplate.isFetching', false),
	isSaving: get(state, '$saveAppTemplate.isFetching', false),
	isValidating: get(state, '$validateAppTemplate.isFetching', false),
});

const mapDispatchToProps = dispatch => ({
	fetchTemplate: id => dispatch(getAppTemplate(id)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateTemplate);
