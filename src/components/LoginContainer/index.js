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
				<Logo type="black" width={200} />
				<h2 className="title">Try appbase.io's search service for free!</h2>
				<p>
					Let appbase.io help you with building the best search experience while you focus
					on serving your users!
				</p>
				<div className="signup_description">
					<h4>Start for free and scale as you grow!</h4>
					<ul className="signup_benefits">
						<li>
							<Icon type="check" className="icon" />
							Free 10,000 records and 100,000 API calls / mo
						</li>
						<li>
							<Icon type="check" className="icon" />
							Import JSON / CSV data or use our CLI for importing from your favorite
							data source
						</li>
						<li>
							<Icon type="check" className="icon" />
							Browse data, edit mappings, build search visually, and create query
							rules
						</li>
						<li>
							<Icon type="check" className="icon" />
							Get actionable analytics to improve content and increase your search ROI
						</li>
						<li>
							<Icon type="check" className="icon" />
							Get best-in-class security with read/write permissions, granular ACLs
							and more
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
