import React from 'react';

export default function Card(props) {
	return <div className="col-xs-12 col-sm-6 col-md-4 appcard">{props.children}</div>;
}
