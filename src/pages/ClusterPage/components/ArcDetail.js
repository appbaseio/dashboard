/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from 'react';
import {
	DeleteOutlined,
	InfoCircleOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { Button, message, notification, Tag, Tooltip } from 'antd';
import { get } from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import {
	BACKENDS,
	capitalizeWord,
	updateArcDetails,
	updateBackend,
	verifyCluster,
} from '../utils';
import {
	card,
	clusterEndpoint,
	clusterButtons,
	settingsItem,
	fadeOutStyles,
} from '../styles';
import EditableCredentials from './EditableCredentials';
import KeyValueAdder from '../../../components/KeyValueAdder';

class ArcDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			username: get(props, 'arc.username', ''),
			password: get(props, 'arc.password', ''),
			clusterURL: get(props, 'cluster.elasticsearch_url', ''),
			showCred: false,
			// eslint-disable-next-line react/no-unused-state
			updatedArcCred: props.arc
				? `${get(props, 'arc.username', '')}:${get(
						props,
						'arc.password',
						'',
				  )}`
				: '',
			backend: BACKENDS.ELASTICSEARCH.name,
			verifyClusterHeaders: {},
		};
	}

	handleVerify = async () => {
		const { clusterURL, backend, verifyClusterHeaders } = this.state;
		if (clusterURL) {
			this.setState({
				verifyingURL: true,
				verifiedCluster: false,
				clusterVersion: '',
			});
			verifyCluster(clusterURL, backend, verifyClusterHeaders)
				.then(data => {
					const version = get(data, 'version.number', '');
					this.setState({
						verifyingURL: false,
						clusterVersion: version || 'N/A',
						isInvalidURL: false,
						verifiedCluster: true,
					});
				})
				.catch(e => {
					this.setState({
						verifyingURL: false,
						isInvalidURL: true,
						verifiedCluster: false,
						urlErrorMessage: e.toString(),
					});
				});
		} else {
			this.setState({
				isInvalidURL: true,
				urlErrorMessage: 'Please enter a valid URL to verify',
			});
		}
	};

	handleInput = e => {
		const {
			target: { name, value },
		} = e;
		let state = {
			[name]: value,
		};
		if (name === 'clusterURL') {
			state = {
				...state,
				verifiedCluster: false,
			};
		}
		this.setState({
			...state,
		});
	};

	isValidSlsCluster = cluster => {
		if (
			cluster &&
			cluster.tenancy_type === 'multi' &&
			cluster.recipe === 'mtrs'
		)
			return true;

		return false;
	};

	handleUpdate = () => {
		const { clusterURL, updatedArcCred } = this.state;
		const [username, password] = updatedArcCred.split(':');
		const {
			cluster: { id },
		} = this.props;

		this.setState({
			loading: true,
		});

		if (this.isValidSlsCluster(this.props.cluster)) {
			if (!this.state.backend) {
				message.error('Choose a backend');
				return;
			}
			let updateBackendPayload = { backend: this.state.backend };
			if (this.state.backend !== BACKENDS.System.name) {
				const {
					protocol,
					username: backendUrlUsername,
					password: backendUrlPassword,
					host,
				} = new URL(this.state.clusterURL);

				if (!this.state.verifiedCluster) {
					message.error('Cluster URL not verified');
					return;
				}

				updateBackendPayload = {
					...updateBackendPayload,
					host,
					protocol: protocol.substr(0, protocol.length - 1),
					basic_auth: `${backendUrlUsername}:${backendUrlPassword}`,
				};
			}
			updateBackend(id, updateBackendPayload)
				.then(() => {
					notification.success({
						title: 'Updated Details Successfully.',
					});

					this.setState({
						loading: false,
					});
					window.location.reload();
				})
				.catch(e => {
					notification.error({
						title: 'Error while updating Details',
						description: e.message,
					});
					this.setState({
						loading: false,
					});
				});
		} else {
			updateArcDetails(id, {
				username,
				password,
				elasticsearch_url: clusterURL,
			})
				.then(() => {
					notification.success({
						title: 'Updated Details Successfully.',
					});

					this.setState({
						loading: false,
					});
					window.location.reload();
				})
				.catch(e => {
					notification.error({
						title: 'Error while updating Details',
						description: e.message,
					});
					this.setState({
						loading: false,
					});
				});
		}
	};

	isButtonDisable = () => {};

	toggleCred = () => {
		this.setState(state => ({
			showCred: !state.showCred,
		}));
	};

	updateArcCred = value => {
		this.setState({
			// eslint-disable-next-line react/no-unused-state
			updatedArcCred: value,
		});
	};

	render() {
		const {
			username,
			password,
			clusterURL,
			loading,
			isInvalidURL,
			verifyingURL,
			verifiedCluster,
			urlErrorMessage,
			clusterVersion,
			showCred,
		} = this.state;
		const { arc, cluster, handleDeleteModal } = this.props;
		let isButtonDisable = false;
		let protocol = '';
		let url = '';
		if (arc) {
			[protocol, url] = (arc.url || arc.dashboard_url).split('://');
		}

		const currentURL = get(cluster, 'elasticsearch_url');

		if (clusterURL !== currentURL && !verifiedCluster) {
			isButtonDisable = true;
		}
		return (
			<Fragment>
				<li className={card}>
					<div className="col light">
						<h3>Reactivesearch.io Server</h3>{' '}
						<a
							href="https://docs.reactivesearch.io/docs/hosting/byoc/#using-appbaseio"
							rel="noopener noreferrer"
							target="_blank"
						>
							Learn More
						</a>
					</div>

					<div className="col">
						<div className={clusterEndpoint}>
							<h4>
								Reactivesearch.io
								<CopyToClipboard
									text={`${protocol}://${username}:${password}@${url}`}
									onCopy={() =>
										notification.success({
											message:
												'Reactivesearch.io URL copied successfully',
										})
									}
								>
									<a
										data-clipboard-text={`${protocol}://${username}:${password}@${url}`}
										style={{
											color: 'dodgerblue',
											cursor: 'pointer',
										}}
									>
										Copy URL
									</a>
								</CopyToClipboard>
							</h4>
							<div>
								<EditableCredentials
									visible={showCred}
									name="Arc credentials"
									onChange={this.updateArcCred}
									text={`${username}:${password}`}
									disabled={false}
								/>
								<Tooltip
									title={
										<span>
											Your credentials determine how an
											external app should access the
											ElasticSearch APIs.{' '}
											<strong>Note:</strong> Editing
											credentials will impact live apps.
										</span>
									}
								>
									<Button
										style={{
											marginTop: 10,
											display: 'block',
										}}
										onClick={this.toggleCred}
									>
										{showCred
											? 'Hide Credentials'
											: 'Edit Credentials'}
									</Button>
								</Tooltip>
							</div>
						</div>
						<div className={clusterEndpoint}>
							<Tooltip
								title={
									<span>
										You can add access whitelist for this IP
										address to your ElasticSearch cluster.{' '}
										<a href="https://docs.reactivesearch.io/docs/hosting/BYOC/ConnectToYourElasticSearch">
											IP Address
										</a>
									</span>
								}
							>
								<h4 style={{ cursor: 'pointer' }}>
									<span>
										IP Address <InfoCircleOutlined />
									</span>
								</h4>
							</Tooltip>
							<div>
								<EditableCredentials
									visible
									name="IP"
									disabled
									text={`${cluster.cluster_ip}`}
								/>
							</div>
						</div>
					</div>
				</li>
				{this.isValidSlsCluster(this.props.cluster) && (
					<li className={card}>
						<div className="col light">
							<h3> Choose search engine </h3>
						</div>
						<div>
							<div
								className={settingsItem}
								css={{
									padding: 30,
									flexWrap: 'wrap',
									gap: '2rem',
								}}
							>
								{Object.values(BACKENDS)
									.filter(item =>
										this.isValidSlsCluster(cluster)
											? true
											: item.name !==
											  BACKENDS.System.name,
									)
									.map(({ name: backend, logo, text }) => {
										return (
											<Button
												key={backend}
												type={
													backend ===
													this.state.backend
														? 'primary'
														: 'default'
												}
												size="large"
												css={{
													height: '160px !important',
													marginRight: 20,
													backgroundColor:
														backend ===
														this.state.backend
															? '#eaf5ff'
															: '#fff',
													minWidth: '152px',
												}}
												className={
													backend ===
													this.state.backend
														? fadeOutStyles
														: ''
												}
												onClick={() => {
													this.setState({
														backend,
													});
												}}
											>
												{logo ? (
													<img
														width="120"
														src={logo}
														alt={`${backend} logo`}
													/>
												) : (
													<span
														css={`
															font-size: 1.4rem;
															font-weight: 400;
															color: black;
														`}
													>
														{text}
													</span>
												)}
											</Button>
										);
									})}
							</div>
							{this.state.backend !== BACKENDS.System.name && (
								<div
									className="col grow vcenter"
									css={{
										flexDirection: 'column',
										alignItems: 'flex-start !important',
										justifyContent: 'center',
									}}
								>
									<input
										id="elastic-url"
										type="name"
										css={{
											width: '100%',
											maxWidth: 'none !important',
											marginBottom: 33,
											outline: 'none',
											border:
												isInvalidURL &&
												clusterURL !== ''
													? '1px solid red'
													: '1px solid #e8e8e8',
										}}
										placeholder={`Enter your ${capitalizeWord(
											this.state.backend,
										)} URL`}
										value={clusterURL}
										name="clusterURL"
										onChange={this.handleInput}
									/>
									<KeyValueAdder
										title="Headers (optional)"
										onUpdateItems={headers => {
											this.setState({
												verifyClusterHeaders: headers,
											});
										}}
									/>
									<Button
										onClick={this.handleVerify}
										disabled={!clusterURL}
										type={
											isButtonDisable
												? 'primary'
												: 'default'
										}
										loading={verifyingURL}
									>
										Verify Connection
									</Button>

									{verifiedCluster ? (
										<Tag
											style={{ margin: '10px' }}
											color="green"
										>
											Verified Connection. Version
											Detected: {clusterVersion}
										</Tag>
									) : null}

									{isInvalidURL ? (
										<p
											style={{
												color: 'red',
											}}
										>
											{urlErrorMessage}
										</p>
									) : null}
								</div>
							)}
						</div>
					</li>
				)}
				<div className={clusterButtons}>
					<Button
						onClick={handleDeleteModal}
						danger
						size="large"
						icon={<DeleteOutlined />}
						className="delete"
					>
						Delete Cluster
					</Button>
					<Button
						disabled={isButtonDisable}
						size="large"
						loading={loading}
						icon={<SaveOutlined />}
						type="primary"
						onClick={this.handleUpdate}
					>
						Update Cluster Settings
					</Button>
				</div>
			</Fragment>
		);
	}
}

ArcDetail.propTypes = {
	arc: PropTypes.object,
	cluster: PropTypes.object,
	handleDeleteModal: PropTypes.func,
};

export default ArcDetail;
