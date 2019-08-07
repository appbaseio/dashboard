import React from 'react';
import get from 'lodash/get';
import { css } from 'emotion';
import { Card, Input, Button } from 'antd';
import { FieldGroup, FieldControl } from 'react-reactive-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import Grid from '../../components/CreateCredentials/Grid';
import Ace from '../../batteries/components/SearchSandbox/containers/AceEditor';
import TemplateResponse from './TemplateResponse';
import { getAppTemplate } from '../../batteries/modules/actions';
import Flex from '../../batteries/components/shared/Flex';
import { getValue, getString, extractParams } from './utils';

const main = css`
	.error {
		color: tomato;
		margin-left: 15px;
	}
`;

const queryMessage = () => (
	<div style={{ width: 500 }}>
		Query is a templatized ElasticSearch query that should be passed in the following format.
		<br />
		<br />
		<pre>
			{JSON.stringify(
				{
					source: {
						query: {
							term: {
								message: '{{query_string}}',
							},
						},
					},
					params: {
						query_string: 'search for these words',
					},
				},
				0,
				2,
			)}
		</pre>
		<a
			target="_blank"
			rel="noopener noreferrer"
			href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html"
		>
			Read more about the format.
		</a>
	</div>
);

class CreateTemplate extends React.Component {
	constructor(props) {
		super(props);
		const editMode = !!props.templateId;
		const nameControl = props.control.get('name');
		if (editMode) {
			props.fetchTemplate(props.templateId).then((action) => {
				if (get(action, 'payload')) {
					const source = get(action, 'payload.script.source');
					const sourceStr = getString(source);
					props.control.patchValue({
						name: props.templateId,
						query: JSON.stringify(
							{
								source: getValue(source),
								params: extractParams(sourceStr).reduce(
									(params = {}, i) => ({
										[i]: '',
										...params,
									}),
									{},
								),
							},
							0,
							2,
						),
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
						<Card
							className={main}
							bodyStyle={{
								padding: '24px 50px',
							}}
						>
							<div className="actionBtn">
								<Button
									style={{
										margin: '0 10px',
									}}
									disabled={getControl('query').invalid}
									onClick={handleValidateTemplate}
									loading={isValidating}
								>
									Validate and Render
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
								toolTipMessage="This is the identifier of your template which can be used when making a search query."
								toolTipProps={{
									overlayClassName: css`
										.ant-tooltip-inner {
											background-color: #000;
										}
									`,
								}}
								gridRatio={0.15}
								label="Template Name"
								component={(
<FieldControl
										name="name"
										render={({
											handler,
											touched,
											hasError,
											invalid: invalidName,
										}) => {
											const isError = touched && invalidName;
											return (
												<Flex alignItems="center">
													<Input
														style={{
															width: 250,
															...(isError && {
																borderColor: 'tomato',
															}),
														}}
														{...handler()}
													/>
													{isError && (
														<span className="error">
															{(hasError('required')
																&& 'Please enter template name.')
																|| (hasError('pattern')
																	&& 'Template name can not have spaces or special characters.')}
														</span>
													)}
												</Flex>
											);
										}}
/>
)}
							/>
							<Grid
								toolTipMessage={queryMessage}
								toolTipProps={{
									overlayClassName: css`
										width: 500px;
										max-width: 500px;
										.ant-tooltip-inner {
											background-color: #000;
										}
									`,
								}}
								gridRatio={0.15}
								label="Query"
								component={(
<FieldControl
										name="query"
										render={({ handler }) => {
											const inputHandler = handler();
											return (
												<Ace
													defaultValue={JSON.stringify(
														{
															source: {},
															params: {},
														},
														0,
														2,
													)}
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
