import {
	default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../../service/tutorialService/DataOperation';
import { JsonView } from './JsonView';
import { Tabs, Tab } from 'react-bootstrap';
import LiveExample from './LiveExample';

export default class LiveFiddle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: 1
		};
		this.codepenConfig = this.codepenConfig.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
	}
	codepenConfig() {
		let config = {
			title: "Reactive Maps Example",
			description: "Reactive Maps Interactive Map",
			html: '<div id="root"></app>',
			html_pre_processor: "none",
			css: '',
			css_pre_processor: "none",
			css_starter: "neither",
			css_prefix_free: false,
			js: dataOperation.appSnippet(),
			js_pre_processor: "babel",
			js_modernizr: false,
			js_library: "",
			html_classes: "",
			css_external: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css;https://rawgit.com/appbaseio/reactivemaps/umd-test/dist/css/style.min.css",
			js_external: "https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.min.js;https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react-dom.min.js;https://maps.google.com/maps/api/js?key=AIzaSyC-v0oz7Pay_ltypZbKasABXGiY9NlpCIY&libraries=places;https://rawgit.com/appbaseio/reactivemaps/0.1.4/umd/ReactiveMaps.js;"
		};
		return JSON.stringify(config);
	}
	handleSelect(key) {
		this.setState({key}, function() {
			setTimeout(() => {
				if(this.state.key === 2) {
					this.setState({showJs: true});
				}
				if(this.state.key === 3) {
					this.setState({showHtml: true});
				}
			}, 400);
		});
	}
	renderComponent(method) {
		let element;
		switch(method) {
			case 'js':
				if(this.state.showJs) {
					element = (<JsonView content = {dataOperation.appSnippet()}></JsonView>);
				}
			break;
			case 'html':
				if(this.state.showHtml) {
					element = (<JsonView content = {dataOperation.htmlSnippet('full')} />);
				}
			break;
		}
		return element;
	}
	render() {
		return (
			<section className="single-step" id="codepen-step">
				<Tabs  className="tutorial-tabs" activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
					<Tab eventKey={1} title="Live">
						<LiveExample config={{appbase: dataOperation.appConfig()}} />
					</Tab>
					<Tab eventKey={2} title="JS">
						{this.renderComponent('js')}
					</Tab>
					<Tab eventKey={3} title="HTML">
						{this.renderComponent('html')}
					</Tab>
				</Tabs>
				<div className="extra-btns">
					<form action="http://jsfiddle.net/api/post/library/pure/" method="POST" target="check">
						<input type="hidden" name="html" value={dataOperation.htmlSnippet()} />
						<input type="hidden" name="resources" value={dataOperation.resources()} />
						<input type="hidden" name="js" value={dataOperation.appSnippet()} />
						<input type="hidden" name="panel_js" value={3} />
						<input type="hidden" name="wrap" value='l' />
						<button type="submit" className="subscribe"> <i className="fa fa-external-link"></i> jsfiddle</button>
					</form>
				</div>
			</section>
		);
	}
}

LiveFiddle.propTypes = {};
// Default props value
LiveFiddle.defaultProps = {};