import React, { Component } from 'react';

export default class Description extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
			description: this.props.description
		};
		this.handleInput = this.handleInput.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.description) {
			this.setState({
				description: this.props.description
			});
		}
	}
	handleInput(event) {
		this.setState({
			description: event.target.value
		});
	}
	setEdit(value) {
		this.setState({
			edit: value
		});
	}
	renderElement(method) {
		let element = null;
		switch(method) {
			case 'input':
				let descriptionNonEdit = (
					<p  onClick={() => this.setEdit(true)}>
						{this.props.description || 'No Description'}
					</p>
				);
				let descriptionEdit = (
					<div className="description-edit col-xs-12">
						<input type="text" 
							defaultValue={this.state.description} 
							className="form-control"
							onChange={this.handleInput}  />
						<a className="btn btn-success" onClick={() => {this.setEdit(false); this.props.updatDescription(this.state.description);} }>
							<i className="fa fa-check"></i>
						</a>
						<a className="btn btn-default" onClick={() => this.setEdit(false)}>
							<i className="fa fa-arrow-left"></i>
						</a>
					</div>
				);
				if(this.state.edit) {
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
			<div className="permission-description col-xs-12">
				{this.renderElement('input')}
			</div>
		);
	}
}