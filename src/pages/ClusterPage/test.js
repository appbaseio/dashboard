function handleRequest() {
	const query = context.request.body.query[0].value;
	return {
		...context.request,
		body: {
			query: [
				{
					id: 'test',
					size: 1,
					dataField: 'original_title',
					value: _.get(
						nlp(`${query}`)
							.topics()
							.json(),
						'0',
						`${query}`,
					).text,
				},
			],
			settings: { useCache: true },
		},
	};
}
