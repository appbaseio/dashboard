import React from 'react';
import {
	ApiOutlined,
	DashboardOutlined,
	ImportOutlined,
	LinkOutlined,
} from '@ant-design/icons';
import { Modal, Button, Collapse, Typography, Divider } from 'antd';
import { withRouter } from 'react-router-dom';
import { css } from 'emotion';
import { getUrlParams } from '../../../utils/helper';
import ClusterExploreRedirect from '../../../components/ClusterExploreRedirect';

const getURL = ({ username = '', password = '', url: fullURL = '' }) => {
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
		<div className="icon">{icon}</div>
	</div>
);

const DirectLink = ({ title, href }) => (
	<a href={href} rel="noopener noreferrer" target="_blank">
		<Paragraph className={linkTitle} strong>
			{title} <LinkOutlined />
		</Paragraph>
	</a>
);

class ConnectCluster extends React.Component {
	state = { visible: false };

	componentDidMount() {
		if (new URLSearchParams(window.location.search).get('connect')) {
			this.showModal();
		}
	}

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
		const arcInstance =
			deployment?.addons?.find(item => item.name === 'arc') || {};
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
					open={visible}
					title="Connect your Cluster"
					onOk={this.handleToggle}
					onCancel={this.handleToggle}
					footer={null}
				>
					<div style={{ display: 'flex' }}>
						<div>
							Try this 2-mins tutorial to get an overview of how
							reactivesearch.io works
						</div>

						<ClusterExploreRedirect
							arc={arcInstance}
							clusterName={cluster.name}
							urlParams={{
								view: '/tutorial',
							}}
							customComponent={
								<Button type="primary">
									Interactive Tutorial
								</Button>
							}
						/>
					</div>
					<Divider />
					<Collapse
						style={{ backgroundColor: '#fff' }}
						accordion
						bordered={false}
					>
						<Collapse.Panel
							header={
								<PanelHeader
									title="Connect via API"
									icon={<ApiOutlined />}
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
								Reactivesearch.io URL (with credentials)
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
								although we don 't recommend this to be used in
								a public environment.
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
								title="Reactivesearch.io API Reference"
							/>
						</Collapse.Panel>
						<Collapse.Panel
							header={
								<PanelHeader
									title="Connect via GUI Dashboard"
									icon={<DashboardOutlined />}
									text="Browse your indices, create a new index, view search analytics and set security permissions."
								/>
							}
							showArrow={false}
							key={2}
						>
							<ClusterExploreRedirect
								arc={arcInstance}
								clusterName={cluster.name}
								urlParams={{
									...getUrlParams(window.location.search),
								}}
								customComponent={
									<Button
										style={{ marginBottom: 15 }}
										type="primary"
									>
										Explore Dashboard
									</Button>
								}
							/>

							<Paragraph>
								Or go to one of the following views directly:
							</Paragraph>
							<ClusterExploreRedirect
								arc={arcInstance}
								clusterName={cluster.name}
								urlParams={{
									view: '/cluster/user-management',
									...getUrlParams(window.location.search),
								}}
								customComponent={
									<Paragraph className={linkTitle} strong>
										User Management <LinkOutlined />
									</Paragraph>
								}
							/>

							<ClusterExploreRedirect
								arc={arcInstance}
								clusterName={cluster.name}
								urlParams={{
									view: '/cluster/credentials',
									...getUrlParams(window.location.search),
								}}
								customComponent={
									<Paragraph className={linkTitle} strong>
										Security Credentials <LinkOutlined />
									</Paragraph>
								}
							/>

							<ClusterExploreRedirect
								arc={arcInstance}
								clusterName={cluster.name}
								urlParams={{
									view: '/cluster/browse',
									...getUrlParams(window.location.search),
								}}
								customComponent={
									<Paragraph className={linkTitle} strong>
										Browse Data <LinkOutlined />
									</Paragraph>
								}
							/>
						</Collapse.Panel>

						<Collapse.Panel
							header={
								<PanelHeader
									title="Import Data"
									icon={<ImportOutlined />}
									text="Bring your data from JSON, CSV, SQL or ElasticSearch sources."
								/>
							}
							showArrow={false}
							key={3}
						>
							<ClusterExploreRedirect
								arc={arcInstance}
								clusterName={cluster.name}
								urlParams={{
									view: '/cluster/import',
									...getUrlParams(window.location.search),
								}}
								customComponent={
									<Button
										style={{ marginBottom: 15 }}
										type="primary"
									>
										Go to Importer
									</Button>
								}
							/>
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
