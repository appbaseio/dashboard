import React from 'react';
import { css } from 'react-emotion';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Flex from '../../batteries/components/shared/Flex';
import { capitalizeFirstLetter } from '../../utils/helper';

const upgradeButton = css`
	border-top: solid 1px #000c17;
	border-bottom: solid 1px #000c17;
	padding: 10px 24px;
	margin-top: 100px;
	position: fixed;
	bottom: 70px;
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
		<Flex flexDirection="column">
			<span>{capitalizeFirstLetter(plan)}</span>
			<span css={planDetails}>$29 per app/month</span>
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
