import React from 'react';
import { Modal, Button, Collapse, Icon, Typography, Divider } from 'antd';
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

const DirectLink = ({ title, href }) => (
	<a href={href} rel="noopener noreferrer" target="_blank">
		<Paragraph className={linkTitle} strong>
			{title} <Icon type="link" />
		</Paragraph>
	</a>
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
					<Collapse defaultActiveKey="1" accordion bordered={false}>
						<Collapse.Panel
							header={
								<PanelHeader
									title="Connect via API"
									icon="api"
									text="Use REST API to connect to your cluster."
								/>
							}
							showArrow={false}
							key={1}
						>
							<Paragraph
								strong
								copyable={{ text: getURL(arcInstance) }}
							>
								Appbase.io URL (with credentials)
							</Paragraph>
							<Paragraph>
								It is the recommended way to use the cluster
								publicly. Any requests made via this
								automatically creates logs, provides search
								analytics and the credentials can be configured
								with additional security.
							</Paragraph>
							<Paragraph
								copyable={{
									text:
										cluster.elasticsearch_url ||
										getURL(deployment.elasticsearch),
								}}
								strong
							>
								ElasticSearch URL (with credentials)
							</Paragraph>
							<Paragraph>
								You can also use the ElasticSearch URL directly,
								although we don
								{"'"}t recommend this to be used in a public
								environment.
							</Paragraph>
							<Divider />
							<Paragraph strong>API Usage Example</Paragraph>
							<Paragraph
								style={{
									display: 'flex',
									alignItems: 'baseline',
									margin: 0,
								}}
								copyable={{
									text: `curl ${getURL(arcInstance)}`,
								}}
							>
								<pre
									style={{
										padding: '8px 10px',
										background: '#f5f5f5',
										'white-space': 'pre-wrap',
									}}
								>
									{`curl ${getURL(arcInstance)}`}
								</pre>
							</Paragraph>
							<DirectLink
								href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html"
								title="Elasticsearch API Reference"
							/>
							<DirectLink
								href="https://arc-api.appbase.io"
								title="Appbase.io API Reference"
							/>
						</Collapse.Panel>
						<Collapse.Panel
							header={
								<PanelHeader
									title="Connect via GUI Dashboard"
									icon="dashboard"
									text="Browse your indices, create a new index, view search analytics and set security permissions."
								/>
							}
							showArrow={false}
							key={2}
						>
							<Link to={`/clusters/${cluster.id}/explore`}>
								<Button
									style={{ marginBottom: 15 }}
									type="primary"
								>
									Explore Dashboard
								</Button>
							</Link>
							<Paragraph>
								Or go to one of the following views directly:
							</Paragraph>
							<RedirectTitle
								title="User Management"
								id={cluster.id}
								link="/cluster/user-management"
							/>
							<RedirectTitle
								title="Security Credentials"
								id={cluster.id}
								link="/cluster/credentials"
							/>
							<RedirectTitle
								title="Browse Data"
								id={cluster.id}
								link="/cluster/browse"
							/>
						</Collapse.Panel>

						<Collapse.Panel
							header={
								<PanelHeader
									title="Import Data"
									icon="import"
									text="Bring your data from JSON, CSV, SQL or ElasticSearch sources."
								/>
							}
							showArrow={false}
							key={3}
						>
							<Link
								to={`/clusters/${cluster.id}/explore?view=/cluster/import`}
							>
								<Button
									style={{ marginBottom: 15 }}
									type="primary"
								>
									Go to Importer
								</Button>
							</Link>
							<Paragraph>
								You can also import via CLI, REST API and using
								Zapier. Read more{' '}
								<a
									href="https://docs.appbase.io/docs/data/Import/"
									target="_blank"
									rel="noopener noreferrer"
								>
									here
								</a>
								.
							</Paragraph>
						</Collapse.Panel>
					</Collapse>
				</Modal>
			</div>
		);
	}
}

export default withRouter(ConnectCluster);
