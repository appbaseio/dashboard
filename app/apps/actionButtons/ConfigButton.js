import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { appbaseService } from '../../service/AppbaseService';
import { DeleteApp } from './DeleteApp';

export class ConfigButton extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="btn-group">
				<button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<i className="fa fa-ellipsis-v"></i>
				</button>
				<ul className="dropdown-menu pull-right">
					<li><DeleteApp {...this.props}></DeleteApp></li>
				</ul>
			</div>
		);
	}
}
