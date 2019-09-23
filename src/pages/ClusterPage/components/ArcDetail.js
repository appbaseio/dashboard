import React, { Fragment } from 'react';
import {
 Button, notification, Tag, Icon,
} from 'antd';
import { get } from 'lodash';
import { updateArcDetails, verifyCluster } from '../utils';
import { card, clusterEndpoint } from '../styles';
import CredentialsBox from './CredentialsBox';

const inputRef = React.createRef();

class ArcDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			username: props.arc.username,
			password: props.arc.password,
			esURL: (props.cluster && props.cluster.elasticsearch_url) || '',
		};
	}

	handleVerify = async () => {
		const { esURL } = this.state;
		if (esURL) {
			this.setState({
				verifyingURL: true,
			});
			verifyCluster(esURL)
				.then((data) => {
					const version = get(data, 'version.number', '');
					if (version.split('.')[0] >= 5) {
						this.setState({
							verifyingURL: false,
							clusterVersion: version || 'N/A',
							isInvalidURL: false,
							verifiedCluster: true,
						});
					} else {
						this.setState({
							verifyingURL: false,
							isInvalidURL: true,
							urlErrorMessage:
								'ElasticSearch version 5 and above are only supported.',
						});
					}
				})
				.catch(() => {
					this.setState({
						verifyingURL: false,
						isInvalidURL: true,
						verifiedCluster: false,
						urlErrorMessage:
							'Connection Failed. Make sure the details you entered are correct.',
					});
				});
		} else {
			this.setState({
				isInvalidURL: true,
				urlErrorMessage: 'Please enter a valid URL to verify',
			});
		}
	};

	handleInput = (e) => {
		const {
			target: { name, value },
		} = e;
		let state = {
			[name]: value,
		};
		if (name === 'esURL') {
			state = {
				...state,
				verifiedCluster: false,
			};
		}
		this.setState({
			...state,
		});
	};

	handleUpdate = () => {
		const { esURL } = this.state;
		const { arc } = this.props;

		const [username, password] = (inputRef
			&& inputRef.current
			&& inputRef.current.textContent.split(':')) || [arc.username, arc.password];
		const {
			cluster: { id },
		} = this.props;

		this.setState({
			loading: true,
		});

		updateArcDetails(id, {
			username,
			password,
			elasticsearch_url: esURL,
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
			.catch((e) => {
				notification.error({
					title: 'Error while updating Details',
					description: e.message,
				});
				this.setState({
					loading: false,
				});
			});
	};

	isButtonDisable = () => {
		const { cluster } = this.props;
		const { esURL, verifiedCluster } = this.state;
	};

	render() {
		const {
			username,
			password,
			esURL,
			loading,
			isInvalidURL,
			verifyingURL,
			verifiedCluster,
			urlErrorMessage,
			clusterVersion,
		} = this.state;
		const { arc, cluster } = this.props;
		let isButtonDisable = false;
		let protocol = '';
		let url = '';
		if (arc) {
			[protocol, url] = (arc.url || arc.dashboard_url).split('://');
		}

		const currentURL = cluster && cluster.elasticsearch_url;

		if (esURL !== currentURL && !verifiedCluster) {
			isButtonDisable = true;
		}
		return (
			<Fragment>
				<li className={card}>
					<div className="col light">
						<h3>Arc</h3>
					</div>

					<div className="col">
						<div className={clusterEndpoint}>
							<h4>
								<a
									href={`${protocol}://${username}:${password}@${url}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icon type="link" theme="outlined" />
									Arc URL
								</a>
							</h4>
							<CredentialsBox
								isEditable
								inputRef={inputRef}
								name="arc"
								text={`${username}:${password}`}
							/>
						</div>
					</div>
				</li>
				<li className={card}>
					<div className="col light">
						<h3>ElasticSearch URL</h3>
					</div>

					<div className="col full">
						<input
							id="elastic-url"
							type="name"
							css={{
								width: '100%',
								maxWidth: 'none !important',
								marginBottom: 10,
								outline: 'none',
								border:
									isInvalidURL && esURL !== ''
										? '1px solid red'
										: '1px solid #e8e8e8',
							}}
							placeholder="Enter your Elastic URL"
							value={esURL}
							name="esURL"
							onChange={this.handleInput}
						/>
						<Button
							onClick={this.handleVerify}
							disabled={!esURL}
							type={isButtonDisable ? 'primary' : 'default'}
							loading={verifyingURL}
						>
							Verify Connection
						</Button>

						{verifiedCluster ? (
							<Tag style={{ margin: '10px' }} color="green">
								Verified Connection. Version Detected: {clusterVersion}
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
				</li>
				<Button
					disabled={isButtonDisable}
					size="large"
					loading={loading}
					icon="save"
					type="primary"
					onClick={this.handleUpdate}
				>
					Update Cluster Settings
				</Button>
			</Fragment>
		);
	}
}

export default ArcDetail;
