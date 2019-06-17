import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { Card } from 'antd';
import { clearAppTemplate } from '../../batteries/modules/actions/templates';

const main = css`
	margin-top: 15px;
	.ant-card-body {
		background-color: transparent;
	}
`;

class TemplateResponse extends React.Component {
	componentWillUnmount() {
		const { clearValidate } = this.props;
		clearValidate();
	}

	render() {
		const { validateResult } = this.props;
		return (
			<div>
				{validateResult ? (
					<Card css={main} title="Response">
						<pre>{JSON.stringify(validateResult, 0, 2)}</pre>
					</Card>
				) : null}
			</div>
		);
	}
}

TemplateResponse.defaultProps = {
	validateResult: undefined,
};

TemplateResponse.propTypes = {
	validateResult: PropTypes.object,
	clearValidate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	validateResult: get(state, '$validateAppTemplate.results'),
});
const mapDispatchToProps = dispatch => ({
	clearValidate: () => dispatch(clearAppTemplate()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TemplateResponse);
