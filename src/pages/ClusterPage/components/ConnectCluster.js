import React from 'react';
import {
 Modal, Button, List, Avatar,
} from 'antd';
import { Link } from 'react-router-dom';
import { css } from 'emotion';

const listItem = css`
	.ant-list-item-meta-title,
	.ant-list-item-meta-description {
		transition: color 0.2s ease;
	}

	.ant-list-item-meta-title {
		font-weight: 600;
	}

	&:hover {
		.ant-list-item-meta-title {
			color: #1890ff;
		}

		.ant-list-item-meta-description {
			color: #595959;
		}
	}
`;

// const getURL = ({ username, password, url: fullURL }) => {
// 	const [protocol, url] = fullURL.split('://');
// 	return `${protocol}://${username}:${password}@${url}`;
// };

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
		const data = [
			{
				title: 'Dejavu',
				src: 'https://importer.appbase.io/images/logo.svg',
				link: `/clusters/${cluster.id}/explore?traverse=/cluster/browse`,
				icon: 'table',
				description:
					'Dejavu is the missing web UI for Elasticsearch. Existing web UIs leave much to be desired or are built with server-side page rendering techniques that make it less responsive and bulkier to run (I am looking at you, Kibana).',
			},
			{
				title: 'Importer',
				src: 'https://importer.appbase.io/images/logo.svg',
				link: `/clusters/${cluster.id}/explore?traverse=/cluster/import`,
				icon: 'import',
				description:
					'You can import up to 10,000 records for free. Upgrade now to a paid plan to import files of up to 10 GB seamlessly and get priority support.',
			},
		];
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
					centered
					title="Connect your Cluster"
					onOk={this.handleToggle}
					onCancel={this.handleToggle}
					footer={null}
				>
					<List
						itemLayout="horizontal"
						dataSource={data}
						renderItem={item => (
							<List.Item key={item.title} className={listItem}>
								{item.link ? (
									<Link to={item.link}>
										<List.Item.Meta
											avatar={(<Avatar style={{ backgroundColor: '#1890ff' }} icon={item.icon} />)}
											title={item.title}
											description={item.description}
										/>
									</Link>
								) : (
									<a href={item.href} rel="noopener noreferrer" target="_blank">
										<List.Item.Meta
											avatar={(<Avatar style={{ backgroundColor: '#1890ff' }} icon={item.icon} />)}
											title={item.title}
											description={item.description}
										/>
									</a>
								)}
							</List.Item>
						)}
					/>
				</Modal>
			</div>
		);
	}
}

export default ConnectCluster;
