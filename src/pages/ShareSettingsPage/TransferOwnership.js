import React, { Component } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Popconfirm, Button, Input } from 'antd';
import { css } from 'react-emotion';
import {
	FieldGroup,
	FieldControl,
	FormBuilder,
	Validators,
} from 'react-reactive-form';
import Flex from '../../batteries/components/shared/Flex';
import { transferAppOwnership } from '../../batteries/modules/actions';
import { media } from '../../utils/media';

class TransferOwnership extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allowInput: false,
		};
		this.form = FormBuilder.group({
			owner: [undefined, [Validators.required, Validators.email]],
		});
	}

	handleSubmit = () => {
		if (this.form.valid) {
			const { transferOwnership } = this.props;
			transferOwnership(this.form.value);
		}
	};

	toggleOwnership = () => {
		const { allowInput } = this.state;
		this.setState({
			allowInput: !allowInput,
		});
	};

	render() {
		const { allowInput } = this.state;
		const { isLoading } = this.props;
		const ownershipButton = (
			<Button danger onClick={this.toggleOwnership}>
				Transfer App Ownership
			</Button>
		);
		const ownershipForm = (
			<FieldGroup
				control={this.form}
				render={({ invalid, pristine }) => (
					<FieldControl
						name="owner"
						render={({ handler, touched, errors }) => (
							<Flex
								css={`
									${media.small(css`
										flex-direction: column;
									`)};
								`}
							>
								<Input
									css={
										touched && errors
											? 'border: solid 1px tomato !important'
											: undefined
									}
									style={{
										marginBottom: '10px',
									}}
									type="email"
									{...handler()}
									placeholder="Type valid email"
								/>
								<Popconfirm
									title="Are you sure you want to transfer this app?"
									onConfirm={this.handleSubmit}
									okText="Yes"
									cancelText="No"
									placement="topLeft"
								>
									<Button
										disabled={invalid || pristine}
										style={{
											margin: '0px 10px 10px 10px',
											float: 'right',
										}}
										danger
										loading={isLoading}
									>
										Transfer App
									</Button>
								</Popconfirm>
								<Button
									type="primary"
									style={{
										margin: '0px 10px 10px 10px',
										float: 'right',
									}}
									onClick={this.toggleOwnership}
								>
									Go Back
								</Button>
							</Flex>
						)}
					/>
				)}
			/>
		);
		return allowInput ? ownershipForm : ownershipButton;
	}
}
const mapStateToProps = state => ({
	isLoading: get(state, '$transferAppOwnership.isFetching'),
});
const mapDispatchToProps = dispatch => ({
	transferOwnership: info => dispatch(transferAppOwnership(null, info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferOwnership);
