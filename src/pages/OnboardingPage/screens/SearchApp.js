import React, { Component } from 'react';
import {
	ReactiveBase,
	DataSearch,
	SelectedFilters,
	MultiList,
	ResultList,
	ReactiveList,
	DynamicRangeSlider,
} from '@appbaseio/reactivesearch';

import appbaseHelpers from '../utils/appbaseHelpers';

const onData = res => ({
	image: `${res.poster_path}`,
	title: res.original_title,
	description: (
		<div>
			<p
				style={{ fontSize: '16px', lineHeight: '24px' }}
				dangerouslySetInnerHTML={{ __html: res.tagline }}
			/>
			<p
				style={{
					color: '#888',
					margin: '8px 0',
					fontSize: '13px',
					lineHeight: '18px',
				}}
				dangerouslySetInnerHTML={{ __html: res.overview }}
			/>
			<div>{res.genres ? <span className="tag">{res.genres}</span> : null}</div>
		</div>
	),
});

const renderFilters = (fields) => {
	if (fields && fields.length) {
		return fields.map((field) => {
			switch (field) {
				case 'genres': {
					return (
						<MultiList
							key={field}
							componentId={field}
							dataField="genres.keyword"
							title="Genres"
							size={15}
							sortBy="count"
							react={{
								and: ['search', 'original_language', 'release_year'],
							}}
							showSearch={false}
							filterLabel="Genres"
						/>
					);
				}
				case 'original_language': {
					return (
						<MultiList
							key={field}
							componentId={field}
							dataField="original_language.keyword"
							title="Language"
							size={15}
							sortBy="count"
							react={{
								and: ['search', 'genres', 'release_year'],
							}}
							showSearch={false}
							filterLabel="Language"
						/>
					);
				}
				case 'release_year': {
					return (
						<DynamicRangeSlider
							key={field}
							componentId={field}
							dataField={field}
							title="Release Year"
							rangeLabels={(min, max) => ({
								start: min,
								end: max,
							})}
							react={{
								and: ['search', 'genres', 'original_language'],
							}}
						/>
					);
				}
				default:
					return null;
			}
		});
	}
	return null;
};

const getFields = (fields, suffix) => {
	let newFields = [];
	fields.forEach((item) => {
		suffix.forEach((str) => {
			newFields = [...newFields, `${item}${str}`];
		});
	});
	return newFields;
};

const getWeights = (fields) => {
	const weights = {
		original_title: 10,
		'original_title.raw': 10,
		'original_title.search': 2,
		tagline: 5,
		'tagline.raw': 5,
		'tagline.search': 1,
		overview: 1,
		'overview.raw': 1,
		'overview.search': 1,
	};

	return fields.map(item => weights[item]);
};

const renderResultList = () => (
	<ResultList
		componentId="results"
		dataField="name"
		react={{
			and: ['search', 'genres', 'original_language', 'release_year'],
		}}
		size={4}
		onData={onData}
		className="right-col"
		innerClass={{
			listItem: 'list-item',
			resultStats: 'result-stats',
		}}
		pagination
		stream
	/>
);

const renderJSONList = () => (
	<ReactiveList
		componentId="results"
		dataField="name"
		react={{
			and: ['search', 'genres', 'original_language', 'release_year'],
		}}
		size={4}
		onData={res => (
			<pre
				key={res._id}
				style={{
					background: 'rgba(239,239,239,.4)',
					padding: '15px 20px',
					color: '#424242',
					borderRadius: '5px',
				}}
			>
				{JSON.stringify(res, null, 2)}
			</pre>
		)}
		className="right-col"
		innerClass={{
			listItem: 'list-item',
			resultStats: 'result-stats',
		}}
		pagination
		stream
	/>
);

const renderCode = (lib) => {
	switch (lib) {
		case 'reactivesearch':
			return renderResultList();
		case 'appbase_js':
			return renderJSONList();
		default:
			return renderResultList();
	}
};

export default class SearchApp extends Component {
	constructor(props) {
		super(props);

		this.appConfig = appbaseHelpers.appConfig();
	}

	render() {
		const fields = getFields(this.props.fields, ['', '.search']);
		return (
			<ReactiveBase
				{...this.appConfig}
				className="search-app"
				theme={{
					colors: {
						primaryColor: '#FF307A',
					},
				}}
				style={{
					backgroundColor: '#fff',
					padding: '40px',
					borderRadius: '2px',
					textAlign: 'left',
				}}
			>
				<header>
					<h2>
						The Movies Store{' '}
						<span role="img" aria-label="books">
							🎥
						</span>
					</h2>

					<DataSearch
						componentId="search"
						dataField={fields}
						showIcon={false}
						placeholder="Search movies..."
						autosuggest={false}
						filterLabel="Search"
						fieldWeights={getWeights(fields)}
						highlight
						style={{
							maxWidth: '400px',
							margin: '0 auto',
						}}
					/>
				</header>

				<SelectedFilters style={{ marginTop: 20 }} />

				<div className={this.props.facets && this.props.facets.length ? 'multi-col' : ''}>
					<div className="left-col">{renderFilters(this.props.facets)}</div>
					{renderCode(this.props.ui)}
				</div>
			</ReactiveBase>
		);
	}
}
