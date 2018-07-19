import React from 'react';
import styles from './styles';
import Grid from './Grid';
import ListInput from './ListInput';
import Flex from './../../../shared/Flex';

const Suggestions = {
	1: {
		prefix: '',
		suffix: '',
		description: 'Matches exactly',
	},
	2: {
		prefix: '',
		suffix: '*',
		description: 'Matches refers starting with',
	},
	3: {
		prefix: '*',
		suffix: '',
		description: 'Matches refers ending with',
	},
	4: {
		prefix: '*',
		suffix: '*',
		description: 'Matches refers containing',
	},
};

const WhiteList = ({ label, preAdded, serachResults }) => (
	<Grid
		label={<span css={styles.subHeader}>{label}</span>}
		component={
			<Flex css="width: 100%;position: relative" flexDirection="column">
				{preAdded.map(item => (
					<div key={item.id} css={styles.addedWhiteList}>
						<div>{item.name}</div>
						<div css={styles.description}>{item.description}</div>
					</div>
				))}
				<div css="margin-top: 10px">
					<ListInput placeholder="example" />
					{serachResults && (
						<div css={styles.serachResultsCls}>
							{Object.keys(Suggestions).map((k) => {
								const suggestion = Suggestions[k];
								return (
									<Flex
										justifyContent="space-between"
										key={k}
										css="padding: 5px 10px;color: #4F586C"
									>
										<span>
											{suggestion.prefix}example{suggestion.suffix}
										</span>
										<span css={styles.description}>
											{suggestion.description}
										</span>
									</Flex>
								);
							})}
						</div>
					)}
				</div>
			</Flex>
		}
	/>
);

export default WhiteList;
