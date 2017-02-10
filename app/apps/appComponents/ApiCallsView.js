import {
	default as React,
	Component
} from 'react';
import { Circle } from 'rc-progress';
import { render } from 'react-dom';

export class ApiCallsView extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="col-xs-12 app-card-container">
				<div className="app-card col-xs-12">
					<span className="col-sm-12 col-md-6 app-card-progress progress-api-calls">
						<div className="app-card-progress-container">
							<Circle percent={this.props.appCount.action.percentage} strokeWidth="4" trailWidth="6" trailColor={this.trailColor} strokeColor={this.themeColor} />
							<span className="appCount">
								{this.props.appCount.action.count}
							</span>
						</div>
						<p className="caption">
							Api calls
						</p>
					</span>
					<span className="col-sm-12 col-md-6 app-card-progress progress-storage-calls">
						<div className="app-card-progress-container">
							<Circle  percent={this.props.appCount.records.percentage} strokeWidth="4" trailWidth="6" trailColor={this.trailColor} strokeColor={this.themeColor} />
							<span className="appCount">
								{this.props.appCount.records.count}
							</span>
						</div>
						<p className="caption">
							Storage
						</p>
					</span>
				</div>
			</div>
		);
	}

}
