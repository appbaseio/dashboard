import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import Flex from './../../../shared/Flex';

const Grid = ({ label, component }) => (
	<Flex css="margin-top: 30px">
		<Flex css="flex: 25%">
			<div>
				<span css={styles.formLabel}>{label}</span>
			</div>
		</Flex>
		<Flex css="flex: 75%; margin-left: 20px">{component}</Flex>
	</Flex>
);

Grid.propTypes = {
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	component: PropTypes.node,
};

export default Grid;
