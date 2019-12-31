import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';
import styles from './styles';
import Flex from '../../batteries/components/shared/Flex';

const Grid = ({
	label,
	component,
	toolTipMessage,
	gridRatio,
	toolTipProps,
	...rest
}) => (
	<Flex css="margin-top: 30px" {...rest}>
		<Flex
			css={`
				flex: ${gridRatio * 100}%;
			`}
		>
			<div>
				<span css={styles.formLabel}>
					{label}
					{toolTipMessage && (
						<Tooltip
							css="margin-left: 5px;color:#898989"
							overlay={toolTipMessage}
							placement="rightTop"
							{...toolTipProps}
						>
							<Icon type="info-circle" theme="outlined" />
						</Tooltip>
					)}
				</span>
			</div>
		</Flex>
		<Flex
			css={`
				flex: ${(1 - gridRatio) * 100}%;
				margin-left: 20px;
			`}
		>
			{component}
		</Flex>
	</Flex>
);

Grid.defaultProps = {
	label: '',
	component: null,
	toolTipMessage: undefined,
	toolTipProps: undefined,
	gridRatio: 0.25,
};
Grid.propTypes = {
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	component: PropTypes.node,
	toolTipMessage: PropTypes.any,
	gridRatio: PropTypes.number,
	toolTipProps: PropTypes.object,
};

export default Grid;
