import React from 'react';
import { Card } from 'antd';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { Button as UpgradeButton } from './../../modules/batteries/components/Mappings/styles';
import Flex from './Flex';

const headingMain = css`
	font-size: 30px;
	color: #212121;
	font-weight: 500;
`;
const desc = css`
	font-size: 16px;
	margin-top: 5px;
`;
const UpgradePlan = ({
 title, description, buttonText, href, isHorizontal,
}) => (
	<Card css="margin-bottom: 20px">
		<Flex justifyContent="space-between" flexDirection={isHorizontal ? 'row' : 'column'}>
			<Flex flexDirection="column">
				<div css={headingMain}>{title}</div>
				<div css={desc}>{description}</div>
			</Flex>
			<Flex
				css="flex: 30%;min-width: 300px"
				justifyContent={isHorizontal ? 'flex-end' : undefined}
			>
				<UpgradeButton css="margin-top: 20px;margin: 20px 0px;" href={href} target="_blank">
					{buttonText}
				</UpgradeButton>
			</Flex>
		</Flex>
	</Card>
);
UpgradePlan.defaultProps = {
	description: '',
	href: '/billing',
	buttonText: 'Upgrade Now',
	isHorizontal: false,
};
UpgradePlan.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	buttonText: PropTypes.string,
	href: PropTypes.string,
	isHorizontal: PropTypes.bool,
};

export default UpgradePlan;
