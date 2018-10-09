import React from 'react';
import { Card, Button } from 'antd';
import PropTypes from 'prop-types';
import Flex from '../../batteries/components/shared/Flex';

const { Meta } = Card;

const DemoCard = ({
 title, description, image, href,
}) => (
	// eslint-disable-next-line
	<Card cover={<img {...image} />}>
		<Meta
			css="text-align: center"
			title={<span css="white-space: initial;">{title}</span>}
			description={description}
		/>
		<Flex css="margin-top: 40px" alignItems="center" justifyContent="center">
			<Button href={href} target="_blank">Read more</Button>
		</Flex>
	</Card>
);
DemoCard.defaultProps = {
	title: undefined,
	description: undefined,
	image: undefined,
	href: undefined,
};
DemoCard.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	image: PropTypes.shape({
		alt: PropTypes.string,
		src: PropTypes.string,
	}),
	href: PropTypes.string,
};
export default DemoCard;
