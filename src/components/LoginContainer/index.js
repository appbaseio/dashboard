import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import Flex from '../../batteries/components/shared/Flex';
import Logo from '../Logo';
import AppbaseUsers from '../AppbaseUsers';
import { main } from './styles';

const LoginContainer = ({ children }) => (
	<React.Fragment>
		<Flex css={main}>
			<Flex className="content" flexDirection="column">
				<Logo width={200} />
				<h2 className="title">
					<mark>
						Try <span className="highlight">appbase.io</span>
						{"'"}s &nbsp;search service for <span className="highlight">free</span>!
					</mark>
				</h2>
				<p>
					Let appbase help you with building the best search experience while you focus on
					serving your users
				</p>
				<div className="signup_description">
					<h4>Start for free and scale as you grow!</h4>
					<ul className="signup_benefits">
						<li>
							<Icon type="check" className="icon" />
							<span>Free 10,000 records and 100,000 API calls / mo</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								Import JSON / CSV data or use our CLI for importing from your
								favorite data source
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								Browse data, edit mappings, build search visually, and create query
								rules
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								Get actionable analytics to improve content and increase your search
								ROI
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								Get best-in-class security with read/write permissions, granular
								ACLs and more
							</span>
						</li>
					</ul>
				</div>
				<AppbaseUsers title="Trusted by these companies" />
			</Flex>
			<Flex flexDirection="column">{children}</Flex>
		</Flex>
	</React.Fragment>
);

LoginContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

export default LoginContainer;
