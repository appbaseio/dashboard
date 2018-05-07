import React, { Component } from 'react';
import {
	ReactiveBase,
	DataSearch,
	SelectedFilters,
	MultiList,
	ResultList,
	DynamicRangeSlider,
} from '@appbaseio/reactivesearch';

import appbaseHelpers from '../utils/appbaseHelpers';

const onData = res => ({
	image: `https://image.tmdb.org/t/p/w92${res.poster_path}`,
	title: res.original_title,
	description: (
		<div>
			<p style={{ marginBottom: 10 }}>{res.tagline}</p>
			<div>
				<span className="tag" style={{ backgroundColor: '#9eff7e' }}>${res.revenue_string}</span>
				{
					res.genres
						? <span className="tag">{res.genres}</span>
						: null
				}
			</div>
		</div>
	),
});

const renderFilters = (fields) => {
	if (fields && fields.length) {
		return fields.map(field => {
			switch(field) {
				case 'genres': {
					return (
						<MultiList
							key={field}
							componentId={field}
							dataField="genres.raw"
							title="Genres"
							size={15}
							sortBy="count"
							react={{
								and: ['search', 'original_language', 'release_year'],
							}}
							showSearch={false}
							filterLabel="Genres"
						/>
					)
				}
				case 'original_language': {
					return (
						<MultiList
							key={field}
							componentId={field}
							dataField="original_language.raw"
							title="Language"
							size={15}
							sortBy="count"
							react={{
								and: ['search', 'genres', 'release_year'],
							}}
							showSearch={false}
							filterLabel="Language"
						/>
					)
				}
				case 'release_year' : {
					return (
						<DynamicRangeSlider
							key={field}
							componentId={field}
							dataField={field}
							title="Release Year"
							rangeLabels={(min, max) => ({
								"start": min,
								"end": max
							})}
							react={{
								and: ['search', 'genres', 'original_language'],
							}}
						/>
					)
				}
			}
		});
	}
	return null;
}

const getFields = (fields, suffix) => {
	let newFields = [];
	fields.forEach(item => {
		suffix.forEach(str => {
			newFields = [ ...newFields, `${item}${str}` ];
		})
	})
	return newFields;
}

export default class SearchApp extends Component {
	constructor(props) {
		super(props);

		this.appConfig = appbaseHelpers.appConfig();
	}

	render() {
		return (
			<ReactiveBase
				{...this.appConfig}
				className="search-app"
				theme={{
					colors: {
						primaryColor: '#FF307A'
					}
				}}
				style={{
					backgroundColor: '#fff',
					padding: '40px',
					borderRadius: '6px',
					textAlign: 'left',
				}}
			>
				<DataSearch
					componentId="search"
					dataField={getFields(this.props.fields, ['', '.search'])}
					iconPosition="left"
					placeholder="Search products..."
					autosuggest={false}
					filterLabel="Search"
				/>

				<SelectedFilters style={{ marginTop: 20 }} />

				<div className={this.props.facets && this.props.facets.length ? 'multi-col' : ''}>
					<div className="left-col">
						{renderFilters(this.props.facets)}
					</div>
					<ResultList
						componentId="results"
						dataField="name"
						react={{
							and: ['search', 'genres', 'original_language', 'release_year'],
						}}
						onData={onData}
						className="right-col"
						innerClass={{
							listItem: 'list-item',
							resultStats: 'result-stats',
						}}
						pagination
					/>
				</div>
			</ReactiveBase>
		);
	}
}
