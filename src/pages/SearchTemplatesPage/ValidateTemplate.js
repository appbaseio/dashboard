import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { Card } from 'antd';
import { FieldControl } from 'react-reactive-form';
import { getAppTemplate } from '../../batteries/modules/actions';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import TemplateResponse from './TemplateResponse';
import Ace from '../../batteries/components/SearchSandbox/containers/AceEditor';

const main = css`
	margin-bottom: 15px;
	.ant-card-body {
		background-color: transparent;
	}
`;

class ValidateTemplate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			source: null,
		};
		props.fetchTemplate(props.templateId).then((action) => {
			if (get(action, 'payload')) {
				const value = get(action, 'payload');
				delete value.found;
				delete value._id;
				this.setState({
					source: value,
				});
			}
		});
	}

	componentWillUnmount() {
		const { control } = this.props;
		control.reset();
	}

	render() {
		const { source } = this.state;
		const { isLoading, control } = this.props;
		const nameControl = control.get('query');
		if (isLoading) {
			return <Loader />;
		}
		return (
			<React.Fragment>
				<Card css={main} title="Source">
					<pre>{JSON.stringify(get(source, 'script.source'), 0, 2)}</pre>
				</Card>
				<FieldControl
					control={nameControl}
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

				<TemplateResponse />
			</React.Fragment>
		);
	}
}

ValidateTemplate.propTypes = {
	templateId: PropTypes.string.isRequired,
	isLoading: PropTypes.bool.isRequired,
	fetchTemplate: PropTypes.func.isRequired,
	control: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	isLoading: get(state, '$getAppTemplate.isFetching', false),
	isValidating: get(state, '$validateAppTemplate.isFetching', false),
});

const mapDispatchToProps = dispatch => ({
	fetchTemplate: id => dispatch(getAppTemplate(id)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ValidateTemplate);
