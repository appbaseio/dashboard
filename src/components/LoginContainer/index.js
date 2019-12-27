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
					<h4>
						Build the best search experience &amp; scale as you
						grow!
					</h4>
					<ul className="signup_benefits">
						<li>
							<Icon type="check" className="icon" />
							<span>
								Free 10,000 records and 100,000 API calls / mo
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								Import JSON / CSV data or use our CLI for
								importing from your favorite data source
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								Browse data, edit mappings, build search
								visually, and create query rules
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								Get actionable analytics to improve content and
								increase your search ROI
							</span>
						</li>
						<li>
							<Icon type="check" className="icon" />
							<span>
								Get best-in-class security with read/write
								permissions, granular ACLs and more
							</span>
						</li>
					</ul>
				</div>
			</Flex>
			<Flex flexDirection="column">{children}</Flex>
		</Flex>
		<div css={footer}>
			<AppbaseUsers title="Trusted by these companies" />
		</div>
	</React.Fragment>
);

LoginContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

export default LoginContainer;
