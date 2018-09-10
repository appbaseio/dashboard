import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
 Row, Col, Icon, Button, Modal, Input, Radio, Menu, Dropdown,
} from 'antd';

import {
 label, input, radiobtn,
} from './styles';

import { createApp } from '../../actions';

const RadioGroup = Radio.Group;

class CreateAppModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      plan: 'free',
      hasJSON: false,
      category: 'generic',
      elasticVersion: '5',
    };
  }

	handleOk = async () => {
		const { appName, category, elasticVersion } = this.state;
		const { handleCreateApp } = this.props;
		const options = {
			appName,
			category,
			es_version: elasticVersion,
		};

		handleCreateApp(options);
	};

	handleChange = (e) => {
		const { target: { name, value } } = e;
		this.setState({
			[name]: value,
		});
	};

	handleCancel = () => {
		this.props.handleModal();
	};

	handleMenuClick = (e) => {
		const category = e.key;
		this.setState({
			category,
		});
	};

  componentWillReceiveProps = (nextProps) => {
    const { createdApp } = nextProps;
    const { hasJSON, appName } = this.state;
    if (createdApp.data && createdApp.data.id) {
      if (hasJSON) {
        window.location.href = `app/${appName}/import`;
      } else {
        window.location.href = `app/${appName}`;
      }
    }
  }

	renderCategoryDropdown = () => {
		const { category } = this.state;
		const categoryOptions = [
			{ label: 'General', key: 'generic' },
			{ label: 'ReactiveSearch', key: 'reactive-apps' },
			{ label: 'Reactivemaps', key: 'reactive-maps' },
		];

		const selectedCategory = categoryOptions.find(option => option.key === category);

		const menu = (
			<Menu onClick={this.handleMenuClick} name="category">
				{categoryOptions.map(option => (
					<Menu.Item key={option.key}>{option.label}</Menu.Item>
				))}
			</Menu>
		);

		return (
			<Dropdown overlay={menu}>
				<Button>
					{selectedCategory.label}
					<Icon type="down" />
				</Button>
			</Dropdown>
		);
	};

	render() {
		const {
     appName, hasJSON, plan, elasticVersion,
    } = this.state;
    const { createdApp: { isLoading }, showModal } = this.props;

		return (
				<Modal
					visible={showModal}
					onOk={this.handleOk}
          okButtonProps={{ loading: isLoading }}
					title="Create App"
					onCancel={this.handleCancel}
				>
					<p className={label}>Name</p>
					<Row gutter={8}>
						<Col span={10}>
							<Input
								placeholder="Enter App Name"
								name="appName"
								className={input}
								onChange={this.handleChange}
								value={appName}
							/>
						</Col>
						<Col span={14} style={{ fontSize: '12px' }}>
							App names are unique across appbase.io and should not contain spaces.
						</Col>
						{this.props.createdApp && this.props.createdApp.error ? (
							<span>{this.props.createdApp.error.message}</span>
						) : null}
					</Row>

					<p className={label}>Choose Plan</p>
					<RadioGroup value={plan} name="plan" onChange={this.handleChange}>
						<Radio value="free">
							<span>Free</span>
							<span>$0 per app/Month</span>
							<span>10k records</span>
							<span>100k API</span>
						</Radio>
						<Radio value="bootstrap">
							<span>Bootstrap</span>
							<span>$19 per app/Month</span>
							<span>100k records</span>
							<span>1MM API</span>
						</Radio>
						<Radio value="growth">
							<span>Growth</span>
							<span>$99 per app/Month</span>
							<span>1MM records</span>
							<span>10MM API</span>
						</Radio>
					</RadioGroup>

					<p className={label}>
						Do you have a JSON or CSV dataset that you would like to import into the
						app?
					</p>
					<RadioGroup value={hasJSON} name="hasJSON" onChange={this.handleChange}>
						<Radio className={radiobtn} value>
							Yes
						</Radio>
						<Radio className={radiobtn} value={false}>
							No
						</Radio>
					</RadioGroup>

					<Row>
						<Col span={14}>
							<p className={label}>Elasticsearch version</p>
							<RadioGroup
								value={elasticVersion}
								name="elasticVersion"
								onChange={this.handleChange}
							>
								<Radio className={radiobtn} value="2">
									2
								</Radio>
								<Radio className={radiobtn} value="5">
									5
								</Radio>
							</RadioGroup>
						</Col>
						<Col span={10}>
							<p className={label}>Category</p>
							{this.renderCategoryDropdown()}
						</Col>
					</Row>
				</Modal>
		);
	}
}

const mapStateToProps = ({ apps, appsMetrics, createdApp }) => ({
	apps,
	appsMetrics,
	createdApp,
});

const mapDispatchToProps = dispatch => ({
	handleCreateApp(options) {
		dispatch(createApp(options));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAppModal);
