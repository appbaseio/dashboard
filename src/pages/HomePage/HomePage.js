import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import {
 Row, Col, Icon, Button, Card, Modal, Input, Radio, Menu, Dropdown, message,
} from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';
import Container from '../../components/Container';
import {
 label, input, radiobtn,
} from './styles';

import { createApp } from '../../actions';

const RadioGroup = Radio.Group;

const link = css`
	font-size: 16px;
	margin-right: 30px;

	i {
		margin-right: 4px;
	}
`;

class HomePage extends Component {
	state = {
		showModal: false, // modal for create new app
		appName: '',
		plan: 'free',
		hasJSON: false,
		category: 'generic',
		elasticVersion: '5',
	};

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
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	handleMenuClick = (e) => {
		const category = e.key;
		this.setState({
			category,
		});
	};

  componentWillReceiveProps = (nextProps) => {
    const { createdApp } = nextProps;
    if (createdApp.data && createdApp.data.id) {
      if (this.state.hasJSON) {
        window.location.href = `app/${this.state.appName}/import`;
      } else {
        window.location.href = `app/${this.state.appName}`;
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
		const { apps } = this.props;
		const {
     showModal, appName, hasJSON, plan, elasticVersion,
    } = this.state;
    const { isLoading } = this.props.createdApp;

		return (
			<Fragment>
				<FullHeader />
				<Header>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col md={18}>
							<h2>Howdy, bud. Welcome to your dashboard!</h2>

							<Row>
								<Col span={18}>
									<p>
										Our analytics feature can do much more! Discover what you
										could do by enabling our metrics on Clicks and Conversions,
										Filters, Results.
									</p>
								</Col>
							</Row>

							<Link to="/" className={link}>
								<Icon type="book" /> Interactive Tutorial
							</Link>
							<Link to="/" className={link}>
								<Icon type="rocket" /> JS Quickstart
							</Link>
							<Link to="/" className={link}>
								<Icon type="code-o" /> REST Quickstart
							</Link>
						</Col>
						<Col
							md={6}
							css={{
								display: 'flex',
								flexDirection: 'column-reverse',
								paddingBottom: 20,
							}}
						>
							<Button
								size="large"
								type="primary"
								block
								onClick={() => this.setState({ showModal: true })}
							>
								<Icon type="plus" /> Create a new app
							</Button>
						</Col>
					</Row>
				</Header>

				<Container>
					<Row gutter={20}>
						{Object.keys(apps).map(name => (
							<Col key={name} span={8}>
								<Link
									to={`/app/${name}/overview`}
									css={{ marginBottom: 20, display: 'block' }}
								>
									<Card title={name}>Card content</Card>
								</Link>
							</Col>
						))}
					</Row>
				</Container>
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
			</Fragment>
		);
	}
}

HomePage.propTypes = {
	apps: PropTypes.object.isRequired,
};

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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
