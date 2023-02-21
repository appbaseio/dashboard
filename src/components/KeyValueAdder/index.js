import React, { useEffect, useState } from 'react';
import { Button, Input, Tooltip } from 'antd';
import { css } from 'emotion';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Flex from '../../batteries/components/shared/Flex';
import {
	getAppMetricsByName,
	getAppPlanByName,
} from '../../batteries/modules/selectors';

const containerCss = css`
	width: 100%;
	min-wdith: max(600px, 80vw);
	max-width: 100%;

	input[type='text'] {
		// max-width: 200px;
	}

	button.ant-btn {
		height: 42px;
		width: 42px;
		line-height: 42px;
	}

	.added-items-wrapper {
		margin: 1rem;
		.delete-btn {
			opacity: 0;
		}

		&:hover {
			.delete-btn {
				opacity: 1;
			}
		}
	}
`;

const DEFAULT_CURRENT_STATE = {
	key: '',
	value: '',
};

const KeyValueAdder = ({ title, onUpdateItems }) => {
	const [currentState, setCurrentState] = useState({
		...DEFAULT_CURRENT_STATE,
	});
	const [addedState, setAddedState] = useState([]);

	const handleChange = e => {
		setCurrentState({ ...currentState, [e.target.name]: e.target.value });
	};

	const addItem = () => {
		const newAddedState = [...addedState];
		newAddedState.push(currentState);
		setAddedState(newAddedState);
		setCurrentState({ ...DEFAULT_CURRENT_STATE });
	};

	const handleDeleteItem = index => {
		const newAddedState = [...addedState];
		newAddedState.splice(index, 1);

		setAddedState(newAddedState);
	};

	useEffect(() => {
		if (onUpdateItems)
			onUpdateItems(
				addedState.reduce((acc, item) => {
					return { ...acc, ...{ [item.key]: item.value } };
				}, {}),
			);
	}, [addedState]);

	return (
		<div css={containerCss}>
			<h4>{title}</h4>
			<Flex style={{ gap: '1rem' }} alignItems="center">
				<Input
					type="text"
					name="key"
					value={currentState.key}
					onChange={handleChange}
				/>
				<Input
					type="text"
					name="value"
					value={currentState.value}
					onChange={handleChange}
				/>
				<Tooltip title="Add item">
					<Button
						icon="plus"
						type="button"
						onClick={addItem}
						disabled={!currentState.key || !currentState.value}
					>
						{' '}
						&nbsp;
					</Button>
				</Tooltip>
			</Flex>
			<Flex className="added-items-wrapper" alignItems="center">
				{addedState.map(({ key, value }, index) => {
					return (
						<Flex
							key={key}
							style={{ gap: '1rem', width: '100%' }}
							alignItems="center"
						>
							<Input readOnly value={key} />
							<Input readOnly value={value} />
							<Tooltip title="Delete item">
								<Button
									icon="delete"
									onClick={() => {
										handleDeleteItem(index);
									}}
									type="danger"
									className="delete-btn"
								>
									&nbsp;
								</Button>
							</Tooltip>
						</Flex>
					);
				})}
			</Flex>
		</div>
	);
};
KeyValueAdder.defaultProps = {
	title: '',
	onUpdateItems: () => {},
};
KeyValueAdder.propTypes = {
	title: PropTypes.string,
	onUpdateItems: PropTypes.func,
};

const mapStateToProps = state => ({
	appName: get(state, '$getCurrentApp.name'),
	plan: get(getAppPlanByName(state), 'plan'),
	computedMetrics: get(getAppMetricsByName(state), 'computedMetrics'),
});
export default connect(mapStateToProps)(KeyValueAdder);
