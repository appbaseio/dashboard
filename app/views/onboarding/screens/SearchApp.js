import React from 'react';
import { ReactiveBase, DataSearch, SelectedFilters, ResultList } from '@appbaseio/reactivesearch';

const onData = res => ({
	title: res.name,
	description: (
		<div>
			<p style={{ marginBottom: 5 }}>{res.tagline}</p>
			<div>{res.topics.map(topic => <span className="tag" key={topic}>{topic}</span>)}</div>
		</div>
	),
});

export default (props) => (
	<ReactiveBase
		app="producthunt"
		credentials="We5c0D8OP:b3f3b3ee-529c-41b2-b69a-84245c091105"
		type="post"
		className="search-app"
		style={{
			backgroundColor: '#fff',
			padding: '40px',
			borderRadius: '6px',
			textAlign: 'left',
		}}
	>
		<DataSearch
			componentId="search"
			dataField={props.fields}
			iconPosition="left"
			placeholder="Search products..."
			autosuggest={false}
			filterLabel="Search"
		/>

		<SelectedFilters style={{ marginTop: 20 }} />
		<ResultList
			componentId="results"
			dataField="name"
			react={{
				and: ['search'],
			}}
			onData={onData}
			innerClass={{
				listItem: 'list-item',
				resultStats: 'result-stats',
			}}
		/>
	</ReactiveBase>
)
