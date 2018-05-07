import React from 'react';

export default props => (
	<footer>
		<a className={`button has-icon ${props.disabled ? 'disabled' : ''}`} onClick={!props.disabled && props.nextScreen}>
			{props.label || 'Next'} &nbsp; <img width="13" src="/assets/images/next.svg" alt=">"/>
		</a>
	</footer>
)
