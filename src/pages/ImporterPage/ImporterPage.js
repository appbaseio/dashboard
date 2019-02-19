import React, { Fragment } from 'react';
import {
 Row, Col, Button, Icon,
} from 'antd';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPermission } from '../../batteries/modules/actions';
import { getAppPermissionsByName } from '../../batteries/modules/selectors';
import { displayErrors } from '../../utils/helper';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import Header from '../../components/Header';
import { IMPORTER_LINK } from '../../constants/config';

function getLink(appname, credentials) {
	const parameters = {
		platform: 'appbase',
	};
	if (appname && credentials) {
		parameters.appname = appname;
		parameters.credentials = `${credentials.username}:${credentials.password}`;
	}
	return `${IMPORTER_LINK}${JSON.stringify(parameters)}&header=false`;
}

function getUrlParams(url) {
	if (!url) {
		return {};
	}
	const searchParams = new URLSearchParams(url);
	return Array.from(searchParams.entries()).reduce(
		(allParams, [key, value]) => ({
			...allParams,
			[key]: value,
		}),
		{},
	);
}
class ImporterPage extends React.Component {
	componentDidMount() {
		const { fetchPermissions, appName } = this.props;
		fetchPermissions(appName);
	}

	componentDidUpdate(prevProps) {
		const { appName, errors } = this.props;
		if (prevProps.appName !== appName) {
			this.initialize();
		}
		displayErrors(errors, prevProps.errors);
	}

	render() {
		const {
			appName, credentials, isLoading, location,
		} = this.props; // prettier-ignore
		let importerLink = getLink(appName, credentials);
		if (location && location.search) {
			const { app } = getUrlParams(location.search);
			importerLink = `${IMPORTER_LINK}${app}&header=false`;
		}
		return (
			<Fragment>
				<Header compact>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col lg={18}>
							<h2>Import Data</h2>

							<Row>
								<Col lg={18}>
									<p>
										Bring your data from JSON or CSV files into appbase.io via
										the Import GUI.
										<br />
										<br />
										Or use our CLI tool for importing data from data sources
										like MongoDB, Postgres, MySQL -{' '}
										<a
											href="https://medium.appbase.io/abc-import-import-your-mongodb-sql-json-csv-data-into-elasticsearch-a202cafafc0d"
											target="_blank"
											rel="noopener noreferrer"
										>
											learn more
										</a>
										.
									</p>
								</Col>
							</Row>
						</Col>
						<Col
							lg={6}
							css={{
								display: 'flex',
								flexDirection: 'column-reverse',
								paddingBottom: 20,
							}}
						>
							<Button
								size="large"
								type="primary"
								href="https://appbase.io/contact/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon type="form" />
								Contact Us
							</Button>
							<p
								css={{
									marginTop: 20,
									fontSize: 13,
									textAlign: 'center',
									lineHeight: '20px',
								}}
							>
								Need help with your dataset?
								<br />
								We now offer paid support.
							</p>
						</Col>
					</Row>
				</Header>
				{isLoading ? (
					<Loader />
				) : (
					<section>
						<iframe
							title="Importer"
							src={importerLink}
							frameBorder="0"
							width="100%"
							height={`${window.innerHeight - 243 || 600}px`}
						/>
					</section>
				)}
			</Fragment>
		);
	}
}
ImporterPage.defaultProps = {
	credentials: null,
};
ImporterPage.propTypes = {
	appName: PropTypes.string.isRequired,
	fetchPermissions: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	credentials: PropTypes.object,
	errors: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => {
	const appPermissions = getAppPermissionsByName(state);
	return {
		appName: get(state, '$getCurrentApp.name'),
		credentials: get(appPermissions, 'credentials', null),
		isLoading: get(state, '$getAppPermissions.isFetching'),
		errors: [get(state, '$getAppPermissions.error')],
	};
};
const mapDispatchToProps = dispatch => ({
	fetchPermissions: appName => dispatch(getPermission(appName)),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ImporterPage);
