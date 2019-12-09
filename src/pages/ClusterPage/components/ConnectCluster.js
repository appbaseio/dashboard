import React from 'react';
import {
 Modal, Button, Collapse, Icon, Typography,
} from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { css } from 'emotion';

const getURL = ({ username, password, url: fullURL }) => {
	const [protocol, url] = fullURL.split('://');
	return `${protocol}://${username}:${password}@${url}`.replace(/\/$/, '');
};

const { Text, Paragraph } = Typography;

const headerStyle = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	i {
		padding: 10px;
		border-radius: 50%;
		background: #fafafa;
		color: #595959;
		border: 1px solid #d9d9d9;
	}

	.content {
		margin-right: 10px;
	}
`;

const linkTitle = css`
	cursor: pointer;

	&:hover {
		color: #1890ff;
	}
`;

const PanelHeader = ({ icon, text, title }) => (
	<div className={headerStyle}>
		<div className="content">
			<Text style={{ fontSize: 16, marginBottom: 10 }} strong>
				{title}
			</Text>
			<br />
			{text && <Text type="secondary">{text}</Text>}
		</div>
		<div className="icon">
			<Icon type={icon} />
		</div>
	</div>
);

const RedirectTitle = ({ id, title, link }) => (
	<Link to={`/clusters/${id}/explore?view=${link}`}>
		<Paragraph className={linkTitle} strong>
			{title} <Icon type="link" />
		</Paragraph>
	</Link>
);

class ConnectCluster extends React.Component {
	state = { visible: false };

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleToggle = () => {
		this.setState(prevState => ({
			visible: !prevState.visible,
		}));
	};

	render() {
		const { visible } = this.state;
		const { cluster, deployment } = this.props;
		const arcInstance = deployment.addons.find(item => item.name === 'arc');
		return (
			<div>
				<Button
					ghost
					size="large"
					style={{ marginRight: 10 }}
					type="primary"
					onClick={this.showModal}
				>
					Connect
				</Button>
				<Modal
					visible={visible}
					title="Connect your Cluster"
					onOk={this.handleToggle}
					onCancel={this.handleToggle}
					footer={null}
				>
					<Collapse accordion bordered={false}>
						<Collapse.Panel
							header={(
<PanelHeader
									title="Connect via API"
									icon="api"
									text="Use REST API to connect to your cluster."
/>
)}
							showArrow={false}
							key={1}
						>
							<Paragraph strong copyable={{ text: getURL(arcInstance) }}>
								Appbase.io URL
							</Paragraph>
							<Paragraph>
								It is the recommended way to use the cluster publicly. Any requests
								made via this automatically creates logs, provides search analytics
								and the credentials can be configured with additional security.
							</Paragraph>
							<Paragraph copyable={{ text: getURL(deployment.elasticsearch) }} strong>
								ElasticSearch URL
							</Paragraph>
							<Paragraph>
								You can also use the ElasticSearch URL directly, although we don
								{"'"}t recommend this to be used in a public environment.
							</Paragraph>
						</Collapse.Panel>
						<Collapse.Panel
							header={(
<PanelHeader
									title="Connect via GUI Dashboard"
									icon="dashboard"
									text="Browse your indices, create a new index, view search analytics and set security permissions."
/>
)}
							showArrow={false}
							key={2}
						>
							<Link to={`/clusters/${cluster.id}/explore`}>
								<Button style={{ marginBottom: 15 }} type="primary">
									Explore Dashboard
								</Button>
							</Link>
							<RedirectTitle
								title="User Management"
								id={cluster.id}
								link="/cluster/user-management"
							/>
							<Paragraph>User management allows you to provide additional login access to other users.</Paragraph>
							<RedirectTitle
								title="Security Credentials"
								id={cluster.id}
								link="/cluster/credentials"
							/>
							<Paragraph>
								API credentials allow secure access to the appbase.io apps and
								clusters. They offer a variety of rules to granularly control access
								to the APIs.
							</Paragraph>
							<RedirectTitle
								title="Browse Data"
								id={cluster.id}
								link="/cluster/browse"
							/>
							<Paragraph>
								Data Browser is a WYSIWYG GUI for adding, modifying and viewing your
								appbase.io app's data.
							</Paragraph>
						</Collapse.Panel>

						<Collapse.Panel
							header={(
<PanelHeader
									title="Import Data"
									icon="import"
									text="Bring your data from JSON, CSV, SQL or ElasticSearch sources."
/>
)}
							showArrow={false}
							key={3}
						>
							<Link to={`/clusters/${cluster.id}/explore?view=/cluster/import`}>
								<Button style={{ marginBottom: 15 }} type="primary">
									Go to Importer
								</Button>
							</Link>
							<Paragraph>
								You can also import via CLI, REST API and using Zapier. If you're
								just starting out, you can also load a sample dataset.
							</Paragraph>
						</Collapse.Panel>
					</Collapse>
				</Modal>
			</div>
		);
	}
}

export default withRouter(ConnectCluster);
