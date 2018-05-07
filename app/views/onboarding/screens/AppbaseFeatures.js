import React, { Component } from 'react';

import Footer from '../components/Footer';

const jsonBlock = `
<div style="background: #272822; overflow:auto;width:auto;padding:1rem;"><pre style="margin: 0; line-height: 180%; border: 0; background: transparent; border-radius: 0;"><span style="color: #f8f8f2">{</span>
    <span style="color: #e6db74">&quot;genres&quot;</span><span style="color: #f92672">:</span> <span style="color: #e6db74">&quot;Action&quot;</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;homepage&quot;</span><span style="color: #f92672">:</span> <span style="color: #e6db74">&quot;https://www.imdb.com/title/tt2527336/&quot;</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;imdb_id&quot;</span><span style="color: #f92672">:</span> <span style="color: #e6db74">&quot;tt2527336&quot;</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;total_revenue&quot;</span><span style="color: #f92672">:</span> <span style="color: #e6db74">&quot;1.1B&quot;</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;original_language&quot;</span><span style="color: #f92672">:</span> <span style="color: #e6db74">&quot;English&quot;</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;original_title&quot;</span><span style="color: #f92672">:</span> <span style="color: #e6db74">&quot;Star Wars: The Last Jedi&quot;</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;overview&quot;</span><span style="color: #f92672">:</span> <span style="color: #e6db74">&quot;Rey develops her newly discovered abilities with the guidance of Luke Skywalker, who is unsettled by the strength of her powers. Meanwhile, the Resistance prepares to do battle with the First Order.&quot;</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;popularity&quot;</span><span style="color: #f92672">:</span> <span style="color: #ae81ff">600.345</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;poster_path&quot;</span><span style="color: #f92672">:</span> <span style="color: #e6db74">&quot;/kOVEVeg59E0wsnXmF9nrh6OmWII.jpg&quot;</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;revenue_string&quot;</span><span style="color: #f92672">:</span> <span style="color: #e6db74">&quot;1.3B&quot;</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;release_year&quot;</span><span style="color: #f92672">:</span> <span style="color: #ae81ff">2017</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;revenue&quot;</span><span style="color: #f92672">:</span> <span style="color: #ae81ff">1325937250</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;score&quot;</span><span style="color: #f92672">:</span> <span style="color: #ae81ff">600.48</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;tagline&quot;</span><span style="color: #f92672">:</span> <span style="color: #e6db74">&quot;Episode VIII - The Last Jedi&quot;</span><span style="color: #f8f8f2">,</span>
    <span style="color: #e6db74">&quot;vote_average&quot;</span><span style="color: #f92672">:</span> <span style="color: #ae81ff">7.4</span>
<span style="color: #f8f8f2">}</span>
</pre></div>
`;

export default class AppbaseFeatures extends Component {
	renderJSONBlock = () => (<div className="code-block" dangerouslySetInnerHTML={{ __html: jsonBlock }} />);

	render() {
		return (
			<div>
				<div className="wrapper">
					<span className="header-icon"></span>
					<div className="content">
						<header>
							<h2>Stream Realtime Updates</h2>
						</header>
						<p>
							appbase.io has built-in support for streaming realtime updates on documents and queries.
						</p>
						{this.renderJSONBlock()}
					</div>
				</div>
				<Footer nextScreen={this.props.nextScreen} label="Finish" />
			</div>
		);
	}
}
