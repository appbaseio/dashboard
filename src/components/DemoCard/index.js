import React from 'react';
import { css } from 'react-emotion';
import PropTypes from 'prop-types';
import DemoCard from './card';
import Flex from '../../batteries/components/shared/Flex';

const demoCard = css`
	margin-top: 20px;
	min-width: 265px;
	max-width: 265px;
	flex: 20%;
	:last-child {
		margin-right: 0px;
	}
`;

const DemoCards = ({ cardConfig }) => (
	<Flex css="flex-wrap: wrap;" justifyContent="space-between">
		{cardConfig.map((config, index) => (
			// eslint-disable-next-line
			<div key={index} css={demoCard}>
				<DemoCard
					title={config.title}
					description={config.description}
					image={config.image}
					href={config.href}
				/>
			</div>
		))}
	</Flex>
);
DemoCards.propTypes = {
	cardConfig: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string,
			description: PropTypes.string,
			image: PropTypes.shape({
				alt: PropTypes.string,
				src: PropTypes.string,
			}),
			href: PropTypes.string,
		}),
	).isRequired,
};
export default DemoCards;
