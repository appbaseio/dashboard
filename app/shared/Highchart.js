import React,{Component} from 'react';

import ReactHighcharts from 'react-highcharts';
const $ = require('jquery');
const moment = require('moment');

export default class Highchart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			config: {
				chartConfig: {}
			}
		};
		this.columns = {
			"indexCalls": [],
			"miscAggregation": [],
			"searchCalls": [],
			"settingsCalls": [],
			"streamCalls": []
		};
		this.columnLabels = {
			indexCalls: "index",
			"miscAggregation": "aggregation",
			"searchCalls": "search",
			"settingsCalls": "settings",
			"streamCalls": "stream"
		};
		this.columnColors = ["red", "#9F9F9F", "#13C4A5", "#50BAEF", "yellow"];
		this.chartConfig = {};
		this.chartConfig.overview = {
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
		this.chartConfig.breakdown = {
			colors: this.columnColors,
			chart: {
				type: 'column',
				spacingBottom: 50
			},
			tooltip: {
				style: {
					padding: 10,
					fontWeight: 'lighter'
				},
				headerFormat: '<b>{point.x}</b><br/>',
				pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
			},
			symbols: ["circle"],
			series: [],
			xAxis: {
				categories: []
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: false
					}
				}
			},
			yAxis: {
				title: '',
				floor: 0,
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: 'bold'
					}
				}
			},
			legend: {
				align: 'right',
				verticalAlign: 'bottom',
				y: 40,
				floating: true,
				backgroundColor: 'white',
				borderColor: '#CCC',
				borderWidth: 1,
				shadow: false
			},
			loading: true,
			title: {
				text: ''
			},
			credits: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.info && nextProps.info.metrics && nextProps.graphMethod && nextProps.infoType) {
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
		obj.chartConfig = this.chartConfig[this.props.infoType];
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
				timeFrame = new Date(`${moment(utc).format("YYYY-MM")}-01`);
				timeFrame = timeFrame.getTime();
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
			if(this.props.infoType === "overview") {
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
				config.chartConfig.series = data;
			}
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
		var xAxis = [];
		var month = 0;
		const finalMetrics = [];
		var metrics = this.props.infoType === "overview" ? {apiCalls: []} : Object.assign(this.getColumns(), {});

		for (var bucket in callBuckets) {
			if (callBuckets[bucket].hasOwnProperty('apiCalls')) {
				var date = parseInt(callBuckets[bucket].key);
				if (date >= timeFrame) {
					if (xAxis[xAxis.length - 1] != date) {
						xAxis.push(date);
					}
					if(this.props.infoType === "overview") {
						var value = callBuckets[bucket].apiCalls.value;
						metrics['apiCalls'].push(value);
					} else {
						Object.keys(this.columns).forEach(column => {
							var value = callBuckets[bucket][column].value;
							metrics[column].push(value);
						});
					}
					var value = callBuckets[bucket].apiCalls.value;
					month += value;
				}
			}
		}

		var xAxisLabels = [];
		xAxis.forEach(function(date) {
			date = new Date(date);
			var formated = (date.getUTCMonth() + 1) + '/' + date.getUTCDate();
			xAxisLabels.push(formated);
		});

		if(this.props.infoType === "breakdown") {
			Object.keys(metrics).forEach((item, index) => {
				const obj = {
					id: index,
					name: this.columnLabels[item],
					data: metrics[item]
				};
				finalMetrics.push(obj);
			});
		}

		const finaldata = {
			data: this.props.infoType === "breakdown" ? finalMetrics : metrics,
			xAxis: xAxisLabels,
			month: month
		};
		return finaldata;
	}

	getColumns() {
		const columns = {};
		Object.keys(this.columns).forEach(item => {
			columns[item] = [];
		});
		return columns;
	}

	render() {
		return (
			<div>
				<ReactHighcharts config={this.state.config.chartConfig} />
			</div>
		);
	}

}
