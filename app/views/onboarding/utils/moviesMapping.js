export default {
	movies: {
		properties: {
			genres: {
				type: "text",
				fields: {
					autosuggest: {
						type: "text",
						analyzer: "autosuggest_analyzer",
						search_analyzer: "simple"
					},
					raw: {
						type: "keyword"
					},
					search: {
						type: "text",
						analyzer: "ngram_analyzer",
						search_analyzer: "simple"
					}
				},
				analyzer: "standard"
			},
			homepage: {
				type: "text",
				fields: {
					autosuggest: {
						type: "text",
						analyzer: "autosuggest_analyzer",
						search_analyzer: "simple"
					},
					raw: {
						type: "keyword"
					}
				},
				analyzer: "standard"
			},
			imdb_id: {
				type: "text",
				fields: {
					autosuggest: {
						type: "text",
						analyzer: "autosuggest_analyzer",
						search_analyzer: "simple"
					},
					raw: {
						type: "keyword"
					}
				},
				analyzer: "standard"
			},
			total_revenue: {
				type: "text",
				fields: {
					autosuggest: {
						type: "text",
						analyzer: "autosuggest_analyzer",
						search_analyzer: "simple"
					},
					raw: {
						type: "keyword"
					}
				},
				analyzer: "standard"
			},
			original_language: {
				type: "text",
				fields: {
					autosuggest: {
						type: "text",
						analyzer: "autosuggest_analyzer",
						search_analyzer: "simple"
					},
					raw: {
						type: "keyword"
					}
				},
				analyzer: "standard"
			},
			original_title: {
				type: "text",
				fields: {
					autosuggest: {
						type: "text",
						analyzer: "autosuggest_analyzer",
						search_analyzer: "simple"
					},
					raw: {
						type: "keyword"
					},
					search: {
						type: "text",
						analyzer: "ngram_analyzer",
						search_analyzer: "simple"
					}
				},
				analyzer: "standard"
			},
			overview: {
				type: "text",
				fields: {
					autosuggest: {
						type: "text",
						analyzer: "autosuggest_analyzer",
						search_analyzer: "simple"
					},
					raw: {
						type: "keyword"
					},
					search: {
						type: "text",
						analyzer: "ngram_analyzer",
						search_analyzer: "simple"
					}
				},
				analyzer: "standard"
			},
			popularity: {
				type: "float"
			},
			poster_path: {
				type: "text",
				fields: {
					autosuggest: {
						type: "text",
						analyzer: "autosuggest_analyzer",
						search_analyzer: "simple"
					},
					raw: {
						type: "keyword"
					}
				},
				analyzer: "standard"
			},
			revenue_string: {
				type: "text",
				fields: {
					autosuggest: {
						type: "text",
						analyzer: "autosuggest_analyzer",
						search_analyzer: "simple"
					},
					raw: {
						type: "keyword"
					}
				},
				analyzer: "standard"
			},
			release_year: {
				type: "integer"
			},
			revenue: {
				type: "integer"
			},
			score: {
				type: "integer"
			},
			tagline: {
				type: "text",
				fields: {
					autosuggest: {
						type: "text",
						analyzer: "autosuggest_analyzer",
						search_analyzer: "simple"
					},
					raw: {
						type: "keyword"
					},
					search: {
						type: "text",
						analyzer: "ngram_analyzer",
						search_analyzer: "simple"
					}
				},
				analyzer: "standard"
			},
			vote_average: {
				type: "float"
			}
		}
	}
};
