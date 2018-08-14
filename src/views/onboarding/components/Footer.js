import React from 'react';

export default props => (
	<footer>
		<div className="left-column">
			{props.previousScreen ? (
				<a
					className="button has-icon"
					style={{ padding: '0 24px 0 16px' }}
					onClick={props.previousScreen}
				>
					<img
						width="13"
						style={{ transform: 'rotate(180deg)' }}
						src="/assets/images/next.svg"
						alt="<"
					/>{' '}
					&nbsp; Previous
				</a>
			) : null}
		</div>
		<div className="right-column">
			{props.label === 'Finish' ? (
				<a
					className={`button has-icon ${props.disabled ? 'disabled' : ''}`}
					href={`/tutorial/finish?app=${props.app}`}
				>
					Finish &nbsp; <img width="13" src="/assets/images/next.svg" alt=">" />
				</a>
			) : (
				<a
					className={`button has-icon ${props.disabled ? 'disabled' : ''}`}
					onClick={() => {
						!props.disabled && props.nextScreen();
					}}
				>
					{props.label || 'Next'} &nbsp;{' '}
					<img width="13" src="/assets/images/next.svg" alt=">" />
				</a>
			)}
		</div>
	</footer>
);
