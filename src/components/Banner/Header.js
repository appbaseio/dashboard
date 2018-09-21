import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import Header from '../Header';

const BannerHeader = ({ title, description, component }) => (
	<Header compact>
		<Row type="flex" justify="space-between" gutter={16}>
			<Col md={18}>
				{title && <h2>{title}</h2>}
				<Row>
					<Col span={18}>{description && <p>{description}</p>}</Col>
				</Row>
				{component}
			</Col>
		</Row>
	</Header>
);
BannerHeader.defaultProps = {
	title: undefined,
	description: undefined,
	component: null,
};

BannerHeader.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	component: PropTypes.element,
};

export default BannerHeader;
