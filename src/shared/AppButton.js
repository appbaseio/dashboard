import React from 'react';
import { css, cx } from 'react-emotion';
import { Button } from '@appbaseio/designkit';
import { shade } from '@appbaseio/designkit/lib/shared/utils';
import { node, string } from 'prop-types';

// shade gives a darker bg ranging from 0 to 1
const styles = (color, backgroundColor) =>
	css(
		backgroundColor && {
			backgroundColor,
			'&:hover, &:focus': {
				backgroundColor: shade(backgroundColor, -0.1),
			},
		},
		color && {
			color,
		},
		{
			whiteSpace: 'nowrap',
		},
	);

// wrapper over designkit button with colors
const AppButton = ({
 className, color, backgroundColor, children, ...props
}) => (
	<Button {...props} css={cx(styles(color, backgroundColor), className)}>
		{children}
	</Button>
);

AppButton.propTypes = {
	children: node.isRequired,
	color: string,
	backgroundColor: string,
	className: string,
};

export default AppButton;
