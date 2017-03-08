import React, { Component } from 'react';
const $ = require('jquery');

export default class Description extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
			description: this.props.description
		};
		this.stopUpdate = false;
		this.handleInput = this.handleInput.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.description) {
			this.setState({
				description: this.props.description
			});
		}
	}
	componentDidMount() {
		$(document).mouseup((e) => {
			if(!this.stopUpdate) {
				var container = $(this.inputRef);
				if (!container.is(e.target) && container.has(e.target).length === 0) {
					this.setEdit(false);
				}
			}
		});
	}
	componentWillUnmount() {
		this.stopUpdate = true;
	}
	handleInput(event) {
		this.setState({
			description: event.target.value
		});
	}
	handleKeyPress(event) {
		if (event.key == 'Enter') {
			this.setEdit(false);
			this.props.updatDescription(this.state.description);
		}
	}
	setEdit(value) {
		this.setState({
			edit: value
		}, function() {
			if (value) {
				$(this.inputRef).trigger('focus');
			}
		}.bind(this));
	}
	renderElement(method) {
		let element = null;
		switch (method) {
			case 'input':
				let descriptionNonEdit = (
					<p className="ad-editable-value" onClick={() => this.setEdit(true)}>
						{this.props.description || 'No Description'}
					</p>
				);
				let descriptionEdit = (
					<div className="ad-editable-edit col-xs-12">
						<input 
							ref={(input) => this.inputRef=input}
							type="text"
							placeholder="Type and press enter"
							defaultValue={this.state.description} 
							className="form-control"
							onChange={this.handleInput}
							onKeyPress={this.handleKeyPress} />
					</div>
				);
				if (this.state.edit) {
					element = descriptionEdit;
				} else {
					element = descriptionNonEdit;
				}
				break;
		}
		return element;
	}
	render() {
		return (
			<div className="col-xs-12 ad-editable-container">
				<div className="permission-editable ad-editable">
					{this.renderElement('input')}
				</div>
			</div>
		);
	}
}
