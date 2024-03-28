import React from 'react';
import PropTypes from 'prop-types';

function SubscriptionDetails({
	startDate,
	firstInvoiceDate,
	trialDays,
	trialEndDate,
}) {
	const containerStyle = {
		display: 'flex',
		flexDirection: 'column',
		gap: '20px',
		borderLeft: '2px dotted gray',
		paddingLeft: '10px',
		fontFamily: 'Arial, sans-serif',
		fontSize: '14px',
		lineHeight: '1.6',
		color: '#333',
		marginLeft: 'auto',
		marginRight: 'auto',
		width: '100%',
	};

	const itemStyle = {
		display: 'flex',
		alignItems: 'center',
		gap: '10px',
	};

	const iconStyle = {
		width: '20px', // Adjust the size of the icon as needed
	};

	const titleStyle = {
		fontWeight: 'bold',
		marginBottom: '5px',
	};

	// Replace the emojis with actual icons or SVGs as needed
	const subscriptionIcon = '📅'; // Placeholder icon
	const invoiceIcon = '🧾'; // Placeholder icon
	const trialIcon = '⏳'; // Placeholder icon

	return (
		<>
			<div className="container" style={containerStyle}>
				<div style={itemStyle}>
					<span style={iconStyle}>{subscriptionIcon}</span>
					<div>
						<div style={titleStyle}>Subscription starts</div>
						<div>{startDate}</div>
					</div>
				</div>
				<div style={itemStyle}>
					<span style={iconStyle}>{invoiceIcon}</span>
					<div>
						<div style={titleStyle}>First invoice</div>
						<div>Total depends on usage</div>
						<div>Bills on {firstInvoiceDate}</div>
					</div>
				</div>
				<div style={itemStyle}>
					<span style={iconStyle}>{trialIcon}</span>
					<div>
						<div style={titleStyle}>Free trial</div>
						<div>{trialDays} day trial</div>
						<div>Ends on {trialEndDate}</div>
					</div>
				</div>
			</div>
		</>
	);
}

SubscriptionDetails.propTypes = {
	startDate: PropTypes.string.isRequired,
	firstInvoiceDate: PropTypes.string.isRequired,
	trialEndDate: PropTypes.string.isRequired,
};

export default SubscriptionDetails;
