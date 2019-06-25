import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm } from 'antd';
import { css } from 'emotion';

const btnCss = css`
	margin-left: 10px;
`;

const Actions = ({ handleEdit, handleRender, handleDelete }) => (
	<div>
		<Button onClick={handleRender}>Copy asf cURL</Button>
		<Button css={btnCss} onClick={handleEdit}>
			Edit
		</Button>
		<Popconfirm
			title="Are you sure delete this template?"
			onConfirm={handleDelete}
			okText="Yes"
			cancelText="No"
		>
			<Button type="danger" css={btnCss}>
				Delete
			</Button>
		</Popconfirm>
	</div>
);

Actions.propTypes = {
	handleRender: PropTypes.func.isRequired,
	handleEdit: PropTypes.func.isRequired,
	handleDelete: PropTypes.func.isRequired,
};

export default Actions;
