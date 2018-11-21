import React from 'react';
import { Drawer, Button, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { css } from 'react-emotion';
import { array, bool } from 'prop-types';

import { media } from '../../utils/media';
import { ACC_API } from '../../constants/config';

const logoutURL = `${ACC_API}/logout?next=https://appbase.io`;

const menuBtn = css`
	border: 0;
	font-size: 22px;
	box-shadow: none;
`;

const menuDrawer = css`
	.ant-drawer-body {
		padding: 24px 0;
	}
`;

const menuItems = css`
	.ant-menu-item-selected::after {
		border: 0;
	}
`;

const menuSlider = css`
	display: none;
	${media.small(css`
		display: flex;
		align-items: center;
		justify-content: center;
	`)};
`;

const link = css`
	color: rgba(0, 0, 0, 0.65);
`;

class MenuSlider extends React.Component {
	state = {
		visible: false,
	};

	handleDrawer = () => {
		const { visible: prevValue } = this.state;
		this.setState({
			visible: !prevValue,
		});
	};

	handleLogout = () => {
		localStorage.setItem('hasVisitedTutorial', false);
		window.location.href = logoutURL;
	};

	render() {
		const { visible } = this.state;
		const { defaultSelectedKeys, isHomepage } = this.props;
		return (
			<div className={menuSlider}>
				<Button className={menuBtn} icon="menu-fold" onClick={this.handleDrawer} />
				<Drawer
					title="Menu"
					placement="right"
					height="auto"
					width="100%"
					className={menuDrawer}
					onClose={this.handleDrawer}
					visible={visible}
				>
					<Menu
						mode="inline"
						className={menuItems}
						defaultSelectedKeys={defaultSelectedKeys}
					>
						{isHomepage && (
							<Menu.Item key="1">
								<Link to="/">Apps</Link>
							</Menu.Item>
						)}

						{isHomepage && (
							<Menu.Item key="2">
								<Link to="/clusters">Clusters</Link>
							</Menu.Item>
						)}

						<Menu.Item key="3">
							<Link to="/profile">Profile</Link>
						</Menu.Item>

						{window.innerWidth < 576 ? (
							<Menu.Item key="4">
								<a
									href="https://docs.appbase.io/javascript/quickstart.html"
									className={link}
									target="_blank"
									rel="noopener noreferrer"
								>
									Docs
								</a>
							</Menu.Item>
						) : null}

						<Menu.Item onClick={this.handleLogout}>Logout</Menu.Item>
					</Menu>
				</Drawer>
			</div>
		);
	}
}

MenuSlider.defaultProps = {
	defaultSelectedKeys: [],
	isHomepage: false,
};

MenuSlider.propTypes = {
	defaultSelectedKeys: array,
	isHomepage: bool,
};

export default MenuSlider;
