import React from 'react';
import { css } from 'react-emotion';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Flex from '../../batteries/components/shared/Flex';
import { capitalizeFirstLetter, planBasePrice } from '../../utils/helper';

const upgradeButton = css`
	border-top: solid 1px #000c17;
	border-bottom: solid 1px #000c17;
	padding: 10px 24px;
	position: fixed;
	background-color: inherit;
	width: 260px;
	z-index: 1;
	bottom: 48px;
	transition: all 0.2s;
`;

const button = css`
	background-color: #001f3d;
	color: inherit;
	border: none;
	margin-left: 15px;
	:hover {
		background-color: #001f3d;
	}
`;

const planDetails = css`
	font-size: 12px;
	margin-top: 20px;
`;

const UpgradeBtnSidebar = ({ plan, link }) => (
	<Flex css={upgradeButton} justifyContent="space-between" alignItems="center">
		<Flex flexDirection="column" justifyContent="space-between">
			<span>{capitalizeFirstLetter(plan)}</span>
			{planBasePrice[plan] && (
				<span css={planDetails}>{`$${planBasePrice[plan]} per app/month`}</span>
			)}
		</Flex>
		<Link css="color: inherit;" replace to={link}>
			<Button css={button}>Upgrade</Button>
		</Link>
	</Flex>
);

UpgradeBtnSidebar.propTypes = {
	plan: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
};
const mapStateToProps = state => ({
	plan: get(state, '$getAppPlan.plan', 'free'),
});
export default connect(mapStateToProps)(UpgradeBtnSidebar);
