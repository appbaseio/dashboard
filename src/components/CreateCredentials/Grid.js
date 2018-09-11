import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';
import styles from './styles';
import Flex from '../../batteries/components/shared/Flex';

const Grid = ({ label, component, toolTipMessage }) => (
	<Flex css="margin-top: 30px">
		<Flex css="flex: 25%">
			<div>
				<span css={styles.formLabel}>
					{label}
					{toolTipMessage && (
						<Tooltip
							css="margin-left: 5px;color:#898989"
							overlay={toolTipMessage}
							mouseLeaveDelay={0}
							placement="rightTop"
						>
							<Icon type="info-circle" theme="outlined" />
						</Tooltip>
					)}
				</span>
			</div>
		</Flex>
		<Flex css="flex: 75%; margin-left: 20px">{component}</Flex>
	</Flex>
);

Grid.defaultProps = {
	label: '',
	component: null,
	toolTipMessage: undefined,
};
Grid.propTypes = {
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	component: PropTypes.node,
	toolTipMessage: PropTypes.any,
};

export default Grid;
