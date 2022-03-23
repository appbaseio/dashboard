import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import Flex from '../../batteries/components/shared/Flex';
import ReactivesearchLogo from '../Logo/ReactivesearchLogo';
import AppbaseUsers from '../AppbaseUsers';
import { main, footer } from './styles';

const backgroundUrlImage = require('../../../static/images/Herobg.png');

const LoginContainer = ({ children }) => (
	<React.Fragment>
		<Flex css={main}>
			<Flex className="content left-container" flexDirection="column">
				<h2 className="title">
					Try <span className="highlight">reactivesearch.io</span> for{' '}
					<span className="highlight">free!</span>
				</h2>
				<div className="signup_description">
					<p style={{ fontSize: 24, textAlign: 'center' }}>
						WHAT'S INCLUDED IN THE 14-DAY TRIAL
					</p>
					<ul className="signup_benefits">
						<li>
							<Icon type="check" className="icon" />
							<span>
								<strong>Develop</strong>: Import data, test
								search relevance visually, view API logs
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								<strong>Search Relevance</strong>: Configure
								language, search, aggregations, synonyms, query
								rules and more settings
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								<strong>Actionable Analytics</strong>: Record
								and view search and click analytics, popular
								searches, results, and more
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								<strong>Search UI</strong>: Build search and
								recommendations UIs with no code
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								<strong>Access Control</strong>: Granular
								read/write permissions, RBAC, and user
								management
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								<strong>Support</strong>: Available via in-app
								chat and e-mail
							</span>
						</li>
					</ul>
				</div>
			</Flex>
			<Flex
				flexDirection="column"
				style={{
					backgroundImage: `url(${backgroundUrlImage})`,
					justifyContent: 'space-around',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				{children}
				<div css={footer}>
					<AppbaseUsers title="Powering hundreds of search experiences" />
				</div>
			</Flex>
		</Flex>
	</React.Fragment>
);

LoginContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

export default LoginContainer;
