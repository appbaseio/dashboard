import React from 'react';
import find from 'lodash/find';
import get from 'lodash/get';
import { Card, Tabs, Table } from 'antd';
import { getRequestLogs, requestLogs } from '../../utils';
import { appbaseService } from '../../../../service/AppbaseService';
import RequestDetails from './RequestDetails';
import Loader from './../Loader';

const { TabPane } = Tabs;
const normalizeData = data =>
	data.map(i => ({
		/*eslint-disable */
		id: i._id,
		operation: {
			classifier: i._source.classifier,
			uri: i._source.request.uri,
		},
		timeTaken: i._source.timestamp,
		status: i._source.response.status,
		/* eslint-enable */
	}));
class RequestLogs extends React.Component {
	constructor(props) {
		super(props);
		this.tabKeys = ['all', 'success', 'error'];
		this.state = {
			activeTabKey: this.tabKeys.includes(props.tab) ? props.tab : this.tabKeys[0],
			logs: undefined,
			isFetching: true,
			hits: [],
			successHits: [],
			errorHits: [],
			showDetails: false,
			logId: undefined,
		};
	}
	componentDidMount() {
		const appId = appbaseService.userInfo.body.apps[this.props.appName];
		getRequestLogs(appId)
			.then((res) => {
				this.setState({
					logs: res.hits,
					isFetching: false,
					hits: normalizeData(res.hits),
					successHits: [],
					errorHits: [],
				});
			})
			.catch(() => {
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
		this.currentRequest = this.state.logs && find(this.state.logs, o => o._id === record.id);
		console.log('this is the hing', record.id, this.currentRequest);
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
 activeTabKey, hits, isFetching, showDetails,
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
					<TabPane tab="SUCCESS" key={this.tabKeys[1]}>
						search
					</TabPane>
					<TabPane tab="ERROR" key={this.tabKeys[2]}>
						errors
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
							ip=""
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
