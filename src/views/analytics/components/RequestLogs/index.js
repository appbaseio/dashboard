import React from 'react';
import find from 'lodash/find';
import get from 'lodash/get';
import { Card, Tabs, Table } from 'antd';
import { getRequestLogs, requestLogs, getTimeDuration } from '../../utils';
import RequestDetails from './RequestDetails';
import Loader from './../Loader';

const { TabPane } = Tabs;

const normalizeData = data =>
	data.map((i) => {
		const timeDuration = getTimeDuration(get(i, '_source.timestamp'));
		return {
			id: get(i, '_id'),
			operation: {
				method: get(i, '_source.request.method'),
				uri: get(i, '_source.request.uri'),
			},
			classifier: get(i, '_source.classifier', '').toUpperCase(),
			timeTaken: `${timeDuration.time} ${timeDuration.formattedUnit} ago`,
			status: get(i, '_source.response.status'),
		};
	});
const filterHits = (hits = []) => {
	const successHits = [];
	const errorHits = [];
	const searchHits = [];
	hits.forEach((h) => {
		const status = get(h, '_source.response.status');
		if (get(h, '_source.classifier') === 'search') {
			searchHits.push(h);
		}
		if (status >= 200 && status <= 300) {
			successHits.push(h);
		} else {
			errorHits.push(h);
		}
	});
	return {
		successHits,
		errorHits,
		searchHits,
	};
};
class RequestLogs extends React.Component {
	constructor(props) {
		super(props);
		this.tabKeys = ['all', 'search', 'success', 'error'];
		this.state = {
			activeTabKey: this.tabKeys.includes(props.tab) ? props.tab : this.tabKeys[0],
			logs: undefined,
			isFetching: true,
			hits: [],
			successHits: [],
			errorHits: [],
			searchHits: [],
			showDetails: false,
		};
	}
	componentDidMount() {
		getRequestLogs(this.props.appName)
			.then((res) => {
				const filteredHits = filterHits(res.hits);
				this.setState({
					logs: res.hits,
					isFetching: false,
					hits: normalizeData(res.hits),
					successHits: normalizeData(filteredHits.successHits),
					errorHits: normalizeData(filteredHits.errorHits),
					searchHits: normalizeData(filteredHits.searchHits),
				});
			})
			.catch((e) => {
				toastr.error('Error', get(e, 'responseJSON.message', 'Unable to fetch logs.'));
				this.setState({
					isFetching: false,
				});
			});
	}
	changeActiveTabKey = (tab) => {
		this.setState(
			{
				activeTabKey: tab,
			},
			() => this.redirectTo(tab),
		);
	};
	redirectTo = (tab) => {
		window.history.pushState(
			null,
			null,
			`${window.location.origin}/analytics/${this.props.appName}/requestLogs/${tab}`,
		);
	};
	handleLogClick = (record) => {
		this.currentRequest =
			this.state.logs && find(this.state.logs, o => get(o, '_id') === record.id);
		this.setState({
			showDetails: true,
		});
	};
	handleCancel = () => {
		this.setState({
			showDetails: false,
		});
	};
	render() {
		const {
			activeTabKey,
			hits,
			isFetching,
			showDetails,
			successHits,
			errorHits,
			searchHits,
		} = this.state;
		if (isFetching) {
			return <Loader />;
		}
		return (
			<Card title="Latest Operations">
				<Tabs
					animated={false}
					onTabClick={this.changeActiveTabKey}
					activeKey={activeTabKey}
				>
					<TabPane tab="ALL" key={this.tabKeys[0]}>
						<Table
							css=".ant-table-row { cursor: pointer }"
							rowKey={record => record.id}
							dataSource={hits}
							columns={requestLogs}
							pagination={false}
							onRow={record => ({
								onClick: () => this.handleLogClick(record),
							})}
						/>
					</TabPane>
					<TabPane tab="SEARCH" key={this.tabKeys[1]}>
						<Table
							css=".ant-table-row { cursor: pointer }"
							rowKey={record => record.id}
							dataSource={searchHits}
							columns={requestLogs}
							pagination={false}
							onRow={record => ({
								onClick: () => this.handleLogClick(record),
							})}
						/>
					</TabPane>
					<TabPane tab="SUCCESS" key={this.tabKeys[2]}>
						<Table
							css=".ant-table-row { cursor: pointer }"
							rowKey={record => record.id}
							dataSource={successHits}
							columns={requestLogs}
							pagination={false}
							onRow={record => ({
								onClick: () => this.handleLogClick(record),
							})}
						/>
					</TabPane>
					<TabPane tab="ERROR" key={this.tabKeys[3]}>
						<Table
							css=".ant-table-row { cursor: pointer }"
							rowKey={record => record.id}
							dataSource={errorHits}
							columns={requestLogs}
							pagination={false}
							onRow={record => ({
								onClick: () => this.handleLogClick(record),
							})}
						/>
					</TabPane>
				</Tabs>
				{showDetails &&
					this.currentRequest && (
						<RequestDetails
							show={showDetails}
							handleCancel={this.handleCancel}
							headers={get(this.currentRequest, '_source.request.headers', {})}
							request={get(this.currentRequest, '_source.request.body', {})}
							response={get(this.currentRequest, '_source.response.body', {})}
							time={get(this.currentRequest, '_source.timestamp', '')}
							method={get(this.currentRequest, '_source.request.method', '')}
							url={get(this.currentRequest, '_source.request.uri', '')}
							ip={get(
								this.currentRequest,
								'_source.request.headers.X-Forwarded-For[0]',
							)}
							status={get(this.currentRequest, '_source.response.status', '')}
							processingTime={get(
								this.currentRequest,
								'_source.response.timetaken',
								'',
							)}
						/>
					)}
			</Card>
		);
	}
}

export default RequestLogs;
