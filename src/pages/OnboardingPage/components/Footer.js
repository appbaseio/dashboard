import React from 'react';
import { Icon } from 'antd';

const Footer = ({
 previousScreen, disabled, app, label,
}) => (
	<footer>
		<div className="left-column">
			{previousScreen ? (
				<a
					className="button has-icon"
					style={{ padding: '0 24px 0 16px' }}
					onClick={previousScreen}
				>
					<Icon type="left" theme="outlined" />{' '}
					&nbsp; Previous
				</a>
			) : null}
		</div>
		<div className="right-column">
			{label === 'Finish' ? (
				<a
					className={`button has-icon ${disabled ? 'disabled' : ''}`}
					href={`/tutorial/finish?app=${app}`}
				>
					Finish &nbsp; <Icon type="right" theme="outlined" />
				</a>
			) : (
				<a
					className={`button has-icon ${disabled ? 'disabled' : ''}`}
					onClick={() => {
						!disabled && props.nextScreen();
					}}
				>
					{label || 'Next'} &nbsp;{' '}
					<Icon type="right" theme="outlined" />
				</a>
			)}
		</div>
	</footer>
);

export default Footer;
