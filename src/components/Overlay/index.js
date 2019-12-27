import React from 'react';
import { css } from 'react-emotion';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import { media } from '../../utils/media';

const overlay = css`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	margin: 20px;
	background-color: rgba(255, 255, 255, 0.3);
	z-index: 99;
	color: black;
`;
const upgradePlan = css`
	margin-top: 30%;
	font-size: 16px;
	font-weight: 500;
	text-align: center;
`;
const imgCls = css`
	width: 100%;
	height: auto;
`;
const imgContainer = css`
	max-width: 550px;
	margin: 0 auto;
	padding: 20px;
	position: relative;
`;
const icon = css`
	font-size: 40px;
	${media.small(css`
		font-size: 20px;
	`)};
`;
const Overlay = ({
	src,
	alt,
	lockSectionStyle,
	lockSectionClassName,
	imageStyle,
	iconStyle,
	...props
}) => (
	<div css={imgContainer} {...props}>
		<div css={overlay}>
			<div
				css={upgradePlan}
				style={lockSectionStyle}
				className={lockSectionClassName}
			>
				<div>
					<Icon type="lock" css={icon} style={iconStyle} />
				</div>
				<Button
					type="primary"
					css="margin-top: 10px"
					href="billing"
					target="_blank"
				>
					Upgrade Now
				</Button>
			</div>
		</div>
		<img alt={alt} css={imgCls} style={imageStyle} src={src} />
	</div>
);
Overlay.defaultProps = {
	alt: '',
	lockSectionStyle: {},
	imageStyle: {},
	iconStyle: {},
	lockSectionClassName: undefined,
};
Overlay.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
	lockSectionClassName: PropTypes.string,
	lockSectionStyle: PropTypes.object,
	iconStyle: PropTypes.object,
	imageStyle: PropTypes.object,
};

export default Overlay;
