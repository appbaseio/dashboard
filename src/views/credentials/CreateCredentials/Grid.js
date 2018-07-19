import React from 'react';
import styles from './styles';
import Flex from './../../../shared/Flex';

const Grid = ({ label, component }) => (
	<Flex css="margin-top: 30px">
		<Flex css="flex: 20%">
			<div css={styles.labelLayout}>
				<span css={styles.formLabel}>{label}</span>
			</div>
		</Flex>
		<Flex css="flex: 80%; margin-left: 20px">{component}</Flex>
	</Flex>
);

export default Grid;
