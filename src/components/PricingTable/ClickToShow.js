import React, { Component } from 'react';
import styled, { css } from 'react-emotion';
import { node, string } from 'prop-types';
import { ChevronDown, ChevronUp } from 'react-feather';
import { media } from '../../utils/media';

const BlankLink = styled('a')`
	display: flex;
	align-items: center;
	color: inherit;
	font-size: 0.9rem;
	font-weight: 600;
	line-height: 19px;
	text-align: center;
	margin: 0 31px;
	text-decoration: none;
	cursor: pointer;
	${media.ipadPro(css('margin: 25px 3px;'))};
`;

export default class ClickToShow extends Component {
	state = {
		visible: false,
	};

	render() {
		const {
			children,
			label = 'All Features',
			hideLabel = 'Hide Features',
		} = this.props;
		const { visible } = this.state;

		if (visible) {
			return (
				<React.Fragment>
					{' '}
					{children}{' '}
					<BlankLink
						onClick={() => {
							this.setState({ visible: false });
						}}
					>
						{hideLabel} <ChevronUp width="18" height="18" />
					</BlankLink>{' '}
				</React.Fragment>
			);
		}
		return (
			<BlankLink
				onClick={() => {
					this.setState({ visible: true });
				}}
			>
				{label} <ChevronDown width="18" height="18" />
			</BlankLink>
		);
	}
}

ClickToShow.propTypes = {
	children: node,
	label: string,
	hideLabel: string,
};
