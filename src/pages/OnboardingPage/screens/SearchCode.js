import React, { Component } from 'react';
import { Radio } from 'antd';

import Footer from '../components/Footer';

const sandboxLinks = {
	react: 'https://codesandbox.io/embed/6jlkqnzlvr',
	raw_json: 'https://codesandbox.io/embed/zrpr98095x',
};

export default class SearchCode extends Component {
	state = {
		error: '',
		selectedOption: this.props.ui ? { label: this.props.ui, value: this.props.ui } : '',
	};

	options = [
		{
			label: 'Raw JSON',
			value: 'raw_json',
		},
		{
			label: 'React',
			value: 'react',
		},
	];

	setError = (e) => {
		if (this.interval) clearInterval(this.interval);
		this.setState(
			{
				error: e,
			},
			() => {
				this.interval = setTimeout(() => {
					this.setState({ error: '' });
				}, 5000);
			},
		);
	};

	handleChange = (e) => {
		const {
			target: { value },
		} = e;
		this.props.setUIField(value);
	};

	renderCodeSandboxUI = () => (
		<div>
			{this.renderSearchInput(true)}
			<iframe
				src={sandboxLinks[this.props.ui]}
				key={this.props.ui}
				title={this.props.ui}
				style={{
					width: '100%',
					height: '500px',
					border: 0,
					borderRadius: '4px',
					overflow: 'hidden',
				}}
				sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
			/>
		</div>
	);

	renderSearchInput = horizontal => (
		<div
			style={{ marginTop: 0 }}
			className={`search-field-container ${horizontal ? 'full-row' : ''}`}
		>
			<div>
				<h3>Choose the template</h3>
				<p>You can check the differences in results in below search app.</p>
			</div>
			<div className="input-wrapper" style={{ textAlign: 'center' }}>
				<Radio.Group
					size="large"
					value={this.props.ui}
					onChange={this.handleChange}
					buttonStyle="solid"
				>
					{this.options.map(option => (
						<Radio.Button value={option.value}>{option.label}</Radio.Button>
					))}
				</Radio.Group>
			</div>
			{this.state.error && (
				<p style={{ marginTop: 15, color: 'tomato' }}>{this.state.error}</p>
			)}
		</div>
	);

	render() {
		return (
			<div>
				<div className="wrapper">
					<div>
						<img src="/static/images/onboarding/Searchable.svg" alt="search" />
					</div>
					<div className="content">
						<header>
							<h2>Build your UI</h2>
							<p>
								Everytime you request Appbase{"'"}s Search API, it answers with a
								JSON object that contains the best matching results in an object :
								<strong>hits.</strong>
							</p>
						</header>
						<h3>We will start by letting you choose the template</h3>
					</div>
				</div>

				{this.renderCodeSandboxUI()}

				<Footer
					nextScreen={this.props.nextScreen}
					previousScreen={this.props.previousScreen}
					disabled={!this.props.ui}
					label="Finish"
					app={this.props.app}
				/>
			</div>
		);
	}
}
