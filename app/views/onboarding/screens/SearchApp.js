import React from 'react';
import {
	ReactiveBase,
	DataSearch,
	DateRange,
	SelectedFilters,
	MultiList,
	ResultList,
	DynamicRangeSlider,
} from '@appbaseio/reactivesearch';

const onData = res => ({
	title: res.name,
	description: (
		<div>
			<p style={{ marginBottom: 5 }}>{res.tagline}</p>
			<div>{res.topics.map(topic => <span className="tag" key={topic}>{topic}</span>)}</div>
		</div>
	),
});

const renderFilters = (fields) => {
	if (fields && fields.length) {
		return fields.map(field => {
			switch(field) {
				case 'topics': {
					return (
						<MultiList
							key={field}
							componentId={field}
							dataField="topics.raw"
							title="Topics"
							size={15}
							sortBy="count"
							react={{
								and: 'search',
							}}
							showSearch={false}
							filterLabel="Topics"
						/>
					)
				}
				case 'date' : {
					return (
						<DateRange
							key={field}
							componentId={field}
							dataField={field}
							title="Date"
							numberOfMonths={2}
							initialMonth={new Date('12/01/2015')}
						/>
					)
				}
				case 'upvotes' : {
					return (
						<DynamicRangeSlider
							key={field}
							componentId={field}
							dataField={field}
							title="Upvotes"
							rangeLabels={(min, max) => ({
								"start": min + " upvotes",
								"end": max + " upvotes"
							})}
						/>
					)
				}
			}
		});
	}

	return null;
}

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

		<div className={props.facets && props.facets.length ? 'multi-col' : ''}>
			<div className="left-col">
				{renderFilters(props.facets)}
			</div>
			<ResultList
				componentId="results"
				dataField="name"
				react={{
					and: ['search', 'topics', 'date', 'upvotes'],
				}}
				onData={onData}
				className="right-col"
				innerClass={{
					listItem: 'list-item',
					resultStats: 'result-stats',
				}}
			/>
		</div>
	</ReactiveBase>
)
