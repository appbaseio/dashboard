import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import Flex from '../../batteries/components/shared/Flex';
import Logo from '../Logo';
import AppbaseUsers from '../AppbaseUsers';
import { main, footer } from './styles';

const LoginContainer = ({ children }) => (
	<React.Fragment>
		<Flex css={main}>
			<Flex className="content" flexDirection="column">
				<Logo width={200} />
				<h2 className="title">
					<mark>
						Try <span className="highlight">appbase.io</span> for{' '}
						<span className="highlight">free</span>!
					</mark>
				</h2>
				<div className="signup_description">
					<h4>What's included in the 14-day trial:</h4>
					<ul className="signup_benefits">
						<li>
							<Icon type="check" className="icon" />
							<span>
								<strong>Develop</strong>: Import and browse
								data, view API logs
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								<strong>Search Relevance</strong>: Set Language,
								Search, Aggregations, Synonyms, Query Rules and
								more
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
								<strong>Search UI</strong>: Build Search and
								Recommendations UIs with NoCode
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
			<Flex flexDirection="column">{children}</Flex>
		</Flex>
		<div css={footer}>
			<AppbaseUsers title="Powering hundreds of search experiences" />
		</div>
	</React.Fragment>
);

LoginContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

export default LoginContainer;
