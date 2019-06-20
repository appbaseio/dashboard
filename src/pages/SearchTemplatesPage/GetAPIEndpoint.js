import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';
import {
 Card, Modal, Button, notification,
} from 'antd';
import {
 FieldControl, FormBuilder, Validators, FieldGroup,
} from 'react-reactive-form';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getAppTemplate, getPermission } from '../../batteries/modules/actions';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import Ace from '../../batteries/components/SearchSandbox/containers/AceEditor';
import { jsonValidator, getString, extractParams } from './utils';
import Grid from '../../components/CreateCredentials/Grid';
import { SCALR_API } from '../../constants/config';
import { getAppPermissionsByName } from '../../batteries/modules/selectors';

const main = css`
	margin-bottom: 15px;
	.ant-card-body {
		background-color: transparent;
	}
`;

class GetAPIEndpoint extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sourceStr: '',
		};
		this.form = FormBuilder.group({
			query: [null, [Validators.required, jsonValidator]],
		});
		if (!props.credentials) {
			const { fetchPermissions } = props;
			fetchPermissions();
		}
		props.fetchTemplate(props.templateId).then((action) => {
			if (get(action, 'payload')) {
				const value = get(action, 'payload');
				const source = get(value, 'script.source');
				const sourceStr = getString(source);
				this.form.patchValue({
					query: getString({
						id: props.templateId,
						params: extractParams(sourceStr).reduce(
							(params = {}, i) => ({
								[i]: '',
								...params,
							}),
							{},
						),
					}),
				});
				this.setState({
					sourceStr,
				});
			}
		});
	}

	componentWillUnmount() {
		this.form.reset();
	}

	get url() {
		const { appName, templateId } = this.props;
		return `${SCALR_API}/${appName}/_search/${templateId}`;
	}

	get request() {
		const {
			value: { query },
		} = this.form;
		const { credentials } = this.props;
		const { username, password } = credentials || {};
		return `curl -X GET ${
			this.url
		} -H 'Content-Type: application/json' -H 'Authorization: ${`Basic ${btoa(
			`${username}:${password}`,
		)}`}' -d'
${getString(query)}
'`;
	}

	handleCopyCred = () => {
		notification.success({
			message: 'Request has been copied successfully!',
		});
	};

	render() {
		const { sourceStr } = this.state;
		const { visible, handleCancel } = this.props;
		const { isLoading } = this.props;
		return (
			<FieldGroup
				strict={false}
				control={this.form}
				render={({ invalid }) => (
					<Modal
						title="API Endpoint"
						visible={visible}
						okText="COPY AS CURL"
						okButtonProps={{
							disabled: invalid,
						}}
						onCancel={() => handleCancel()}
						footer={[
							<Button key="back" onClick={() => handleCancel()}>
								Cancel
							</Button>,
							<CopyToClipboard key="ok" text={this.request} onCopy={this.handleCopyCred}>
								<Button type="primary" disabled={invalid}>
									COPY AS CURL
								</Button>
							</CopyToClipboard>,
						]}
						width="100%"
						style={{
							maxWidth: 850,
						}}
					>
						{isLoading ? (
							<Loader />
						) : (
							<React.Fragment>
								<Card css={main} title="Source">
									<pre>{sourceStr}</pre>
								</Card>
								<Grid
									gridRatio={0.1}
									label="URL"
									component={<div>{this.url}</div>}
								/>
								<Grid
									gridRatio={0.1}
									label="Body"
									component={(
<FieldControl
											name="query"
											render={({ handler }) => (
												<Ace
													mode="json"
													{...handler()}
													theme="monokai"
													name="editor-JSON"
													fontSize={16}
													showPrintMargin
													style={{
														width: '100%',
														maxWidth: 800,
														maxHeight: 250,
													}}
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
											)}
/>
)}
								/>
							</React.Fragment>
						)}
					</Modal>
				)}
			/>
		);
	}
}

GetAPIEndpoint.defaultProps = {
	credentials: undefined,
};

GetAPIEndpoint.propTypes = {
	visible: PropTypes.bool.isRequired,
	handleCancel: PropTypes.func.isRequired,
	templateId: PropTypes.string.isRequired,
	credentials: PropTypes.object,
	appName: PropTypes.string.isRequired,
	isLoading: PropTypes.bool.isRequired,
	fetchTemplate: PropTypes.func.isRequired,
	fetchPermissions: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	isLoading:
		get(state, '$getAppTemplate.isFetching', false)
		|| get(state, '$getAppPermissions.isFetching', false),
	credentials: get(getAppPermissionsByName(state), 'credentials'),
	appName: get(state, '$getCurrentApp.name'),
});

const mapDispatchToProps = dispatch => ({
	fetchTemplate: id => dispatch(getAppTemplate(id)),
	fetchPermissions: appName => dispatch(getPermission(appName)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(GetAPIEndpoint);
