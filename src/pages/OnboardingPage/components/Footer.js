import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Footer = ({ previousScreen, disabled, app, label, nextScreen }) => (
	<footer>
		<div className="left-column">
			{previousScreen ? (
				<a
					className="button has-icon"
					style={{ padding: '0 24px 0 16px' }}
					onClick={previousScreen}
				>
					<LeftOutlined /> &nbsp; Previous
				</a>
			) : null}
		</div>
		<div className="right-column">
			{label === 'Finish' ? (
				<a
					className={`button has-icon ${disabled ? 'disabled' : ''}`}
					href={`/tutorial/finish?app=${app}`}
				>
					Finish &nbsp; <RightOutlined />
				</a>
			) : (
				<a
					className={`button has-icon ${disabled ? 'disabled' : ''}`}
					onClick={() => {
						!disabled && nextScreen();
					}}
				>
					{label || 'Next'} &nbsp; <RightOutlined />
				</a>
			)}
		</div>
	</footer>
);

export default Footer;
