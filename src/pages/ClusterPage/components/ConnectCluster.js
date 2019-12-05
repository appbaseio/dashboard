import React from 'react';
import {
 Modal, Button, Collapse, Icon, Typography,
} from 'antd';

import { css } from 'emotion';

// const getURL = ({ username, password, url: fullURL }) => {
// 	const [protocol, url] = fullURL.split('://');
// 	return `${protocol}://${username}:${password}@${url}`;
// };

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

const RedirectTitle = ({ title, link }) => (
	<Paragraph className={linkTitle} strong>
		{title} <Icon type="link" />
	</Paragraph>
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
		const { cluster, deployments } = this.props;
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
							<Paragraph strong copyable={{ text: 'Awesome' }}>
								Appbase.io URL
							</Paragraph>
							<Paragraph>
								It is the recommended way to use the cluster publicly. Any requests
								made via this automatically creates logs, provides search analytics
								and the credentials can be configured with additional security.
							</Paragraph>
							<Paragraph copyable={{ text: 'Awesome' }} strong>
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
							<Button style={{ marginBottom: 15 }} type="primary">
								Explore Dashboard
							</Button>
							<RedirectTitle title="User Management" link="" />
							<Paragraph>User management Description.</Paragraph>
							<RedirectTitle title="Security Credentials" link="" />
							<Paragraph>Security Crdeentials Description</Paragraph>
							<RedirectTitle title="Browse Data" link="" />
							<Paragraph>Browse Data Description.</Paragraph>
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
							<Button style={{ marginBottom: 15 }} type="primary">
								Go to Importer
							</Button>
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

export default ConnectCluster;
