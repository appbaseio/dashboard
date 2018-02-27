import React, { Component } from 'react';
import { getConfig } from '../../config';
import { browserHistory } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';

const $ = require('jquery');

export default class Tutorial extends Component {

	constructor(props) {
		super(props);
		this.config = getConfig();
		this.state = {
			url: this.config.tutorial.url,
			loadActive: true
		};
		this.goToDashbord = this.goToDashbord.bind(this);
	}

	componentDidMount() {
		this.setPageHeight();
	}

	componentDidUpdate() {
		if(this.state.url && this.iframeRef) {
			setTimeout(this.listenEvent.bind(this), 300);
		}
	}

	componentWillUnmount() {
		$(window).unbind("resize");
	}

	listenEvent() {
		this.iframeRef.contentDocument.addEventListener('click', function (e) {
			if($(e.target).hasClass('go-to-dashboard')) {
				appbaseService.pushUrl('/apps');
				window.location.reload();
			}
			if($(e.target).hasClass('go-to-document')) {
				window.open('http://docs.appbase.io');
			}
		});
	}

	setPageHeight() {
		const setPage = () => {
			const bodyHeight = $('.ad-tutorial').height() - $('.ad-detail-page-header').outerHeight();
			$(this.pageRef).css('height', bodyHeight);
		}
		setTimeout(setPage, 1000);
		$(window).resize(() => {
			setTimeout(setPage, 1000);
		});
	}

	onIfreamLoad() {
		this.setState({
			loadActive: false
		});
	}

	goToDashbord() {
		appbaseService.pushUrl('/apps');
		window.location.reload();
	}

	render() {
		return (
			<section className="ad-tutorial">
				<div className="ad-detail-page ad-dashboard row">
						<header className="ad-detail-page-header header-inline-summary col-xs-12">
							<h2 className="ad-detail-page-title">
								{this.config.tutorial.title}
							</h2>
							<p>
								{this.config.tutorial.description}
							</p>
							<button className="pull-right btn ad-theme-btn primary" onClick={this.goToDashbord}>
								Skip Tutorial
							</button>
						</header>
						<main className='ad-detail-page-body col-xs-12' ref={(page) => this.pageRef = page}>
							{this.state.loadActive ? (<div className="loadingBar"></div>) : null}
							{
								this.state.url ? (
									<iframe ref={(iframe) => this.iframeRef = iframe} onLoad={() => this.onIfreamLoad()} src={this.state.url} height="100%" width="100%" frameBorder="0"></iframe>
								) : null
							}
						</main>
				</div>
			</section>
		);
	}

}
