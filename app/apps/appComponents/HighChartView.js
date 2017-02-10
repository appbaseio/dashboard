import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { Highchart } from '../../others/Highchart';

export class HighChartView extends Component {

	constructor(props) {
		super(props);
	}

	graph(method) {
		this.setState({
			graphMethod: method
		});
	}

	render() {
		return (
			<div className="col-xs-12 col-sm-8 graphView">
				<div className="graph-title">
					Usage <span className="summary">{this.props.apiCalls} API Calls</span>
				</div>
				<ul className="nav-tab">
					<li>
						<a className={this.props.graphMethod === 'week' ? 'active' : ''} onClick={() => this.graph('week')}>Week</a>
					</li>
					<li>
						<a className={this.props.graphMethod === 'month' ? 'active' : ''} onClick={() => this.graph('month')}>Month</a>
					</li>
					<li>
						<a className={this.props.graphMethod === 'all' ? 'active' : ''} onClick={() => this.graph('all')}>All</a>
					</li>
				</ul>
				<div className="graph">
					<Highchart 
						id="chart1" 
						graphMethod={this.props.graphMethod}
						info={this.props.info}>
					</Highchart>
				</div>
			</div>
		);
	}

}
