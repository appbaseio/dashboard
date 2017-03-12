import React,{Component} from 'react';

import ReactHighcharts from 'react-highcharts';
const $ = require('jquery');

export default class Highchart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			config: {
				chartConfig: {}
			}
		};
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.info && nextProps.info.metrics && nextProps.graphMethod) {
			setTimeout(() => {
				this.prepareGraph();
			}, 100);
		}
	}

	defaultValues(metrics, obj, infoStatus) {
		obj.strike = {};
		let callsData = metrics.body.month.buckets;
		obj.noData = callsData.length === 0;
		let height = infoStatus == 'closeIng' ? 500 : 200;
		let width = $('.graph-part').width() - 30;
		obj.cap = 100000;

		obj.chart = {};
		obj.chart.month = 0;

		obj.chartConfig = {
			chart: {
				type: 'spline'
			},
			tooltip: {
				style: {
					padding: 10,
					fontWeight: 'bold'
				}
			},
			symbols: ["circle"],
			series: [],
			xAxis: {
				categories: []
			},
			yAxis: {
				title: '',
				floor: 0
			},
			loading: true,
			title: {
				text: ''
			},
			credits: false
		};
		return obj;
	}

	prepareGraph() {
		var now = new Date();
		var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
		let timeFrame = this.props.graphMethod;
		let config = this.state.config;
		config.graphActive = this.props.graphMethod;
		config = this.defaultValues(this.props.info.metrics, config);
		let presets = {
			week: function() {
				timeFrame = utc.setDate(utc.getDate() - 7);
			},
			month: function() {
				timeFrame = utc.setDate(1);
			},
			all: function() {
				timeFrame = 0;
			}
		}
		if (!timeFrame) timeFrame = 'month';
		if (presets[timeFrame]) {
			var timeLabel = timeFrame;
			presets[timeFrame]();
		}
		let retVal = this.getGraphData(timeFrame, this.props.info.metrics);
		var data = retVal.data;

		if (!$.isEmptyObject(data)) {
			config.chart.month = config.chart.month || retVal.month;
			config.chartConfig.xAxis.categories = retVal.xAxis;
			config.chartConfig.series = [];
			if (config.graphActive === 'month') {
				config.chartConfig.colors = ["#50BAEF"];
			} else if (config.graphActive === 'all') {
				config.chartConfig.colors = ["#9F9F9F"];
			} else {
				config.chartConfig.colors = ["#13C4A5"];
			}
			config.chartConfig.series.push({
				data: data['apiCalls'],
				name: "API Calls"
			});
		} else {
			if (timeLabel && timeLabel !== 'all') {
				config.strike[timeLabel] = true;
				// graph(scope, timeLabel === 'week' ? 'month' : 'all');
			}
		}
		config.chartConfig.loading = false;
		this.setState({
			config: config
		});
	}

	getGraphData(timeFrame, metrics) {
		var callBuckets = metrics.body.month.buckets;
		var month = 0;
		var metrics = {};
		var xAxis = [];
		metrics.apiCalls = [];

		for (var bucket in callBuckets) {
			if (callBuckets[bucket].hasOwnProperty('apiCalls')) {
				var date = parseInt(callBuckets[bucket].key);
				if (date > timeFrame) {
					if (xAxis[xAxis.length - 1] != date) {
						xAxis.push(date);
					}
					var value = callBuckets[bucket].apiCalls.value;
					month += value;
					metrics['apiCalls'].push(value);
				}
			}
		}

		var xAxisLabels = [];
		xAxis.forEach(function(date) {
			date = new Date(date);
			var formated = (date.getUTCMonth() + 1) + '/' + date.getUTCDate();
			xAxisLabels.push(formated);
		});

		return {
			data: metrics,
			xAxis: xAxisLabels,
			month: month
		};
	}

	render() {
		return (
			<div>
				<ReactHighcharts config={this.state.config.chartConfig} />
			</div>
		);
	}

}
