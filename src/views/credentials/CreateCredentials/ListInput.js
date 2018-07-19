import React from 'react';
import { Input, Icon } from 'antd';

const ListInput = props => (
	<Input
		{...props}
		suffix={<Icon type="caret-down" css="transform: scale(.8, 1);color: #9195A2" />}
	/>
);

export default ListInput;
