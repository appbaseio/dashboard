import React from 'react';
import FullHeader from '../../components/FullHeader';

const MarketPlace = ({ showNavbar = true }) => (
	<React.Fragment>
		{showNavbar ? <FullHeader /> : null}
		<iframe
			src="https://reactiveapps.io/?header=hide"
			title="MarketPlace"
			style={{
				width: '100%',
				height: '100vh',
			}}
			frameBorder="0"
		/>
	</React.Fragment>
);

export default MarketPlace;
