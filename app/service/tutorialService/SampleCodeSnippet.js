export const sampleCodeSnippet = `const {
	ReactiveBase,
	SingleList,
	MultiList,
	ReactiveMap } = ReactiveMaps;
	
const Testing = React.createClass({
	getDefaultProps: function() {
		return {
			mapStyle: "Standard",
			mapping: {
				city: 'city',
				location: 'location'
			},
			config: {
				"appbase": {
					"appname": "ReactTestApp3",
					"username": "CR1KCtfUY",
					"password": "a5aaebbe-c734-43e5-89dc-76d0f37689eb",
					"type": "test"
				}
			}
		};
	},
	popoverContent: function(marker) {
		return (
		<div className="popoverComponent row">
			{marker._source.place_info}
		</div>
		);
	},
	defaultQuery: function(val) {
	alert(val);
},
	render: function () {
		return (
			<div className="container-fluid h-100 liveExample">
				<ReactiveBase
					app={this.props.config.appbase.appname}
					username={this.props.config.appbase.username}
					password={this.props.config.appbase.password}
					>
					<div className="row">
						<div className="col-xs-4 col-sm-4 appbaseListCol">
							<SingleList
								componentId="CitySensor"
								appbaseField={this.props.mapping.city}
								defaultSelected="London"
								showCount={true}
								size={100}
								includeGeo={false}
								showSearch={true}
								title="Cities"
								searchPlaceholder="Search City"
							/>
						</div>
						<div className="col-xs-8 col-sm-8 h-100" style={{height: '1000px'}}>
							<ReactiveMap
							appbaseField={this.props.mapping.location}
							defaultZoom={13}
							defaultCenter={{ lat: 37.74, lng: -122.45 }}
							historicalData={true}
							setMarkerCluster={false}
							defaultMapStyle={this.props.mapStyle}
							autoCenter={true}
							size={100}
							showSearchAsMove={true}
							showMapStyles={true}
							title="Meetupblast"
							actuate={{
								CitySensor: {"operation": "must"}
							}}
							/>
						</div>
					</div>
				</ReactiveBase>
			</div>
		)
	}
})

ReactDOM.render(
	<Testing></Testing>,
	document.getElementById('root')
);`;
