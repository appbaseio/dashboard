/**
 * Traverse the mappings object & returns the fields
 * @param {Object} mappings
 * @returns {{ [key: string]: Array<string> }}
 */
// eslint-disable-next-line
export const traverseMapping = (mappings = {}) => {
	const fieldObject = {};
	const checkIfPropertyPresent = (m, type) => {
		fieldObject[type] = [];
		const setFields = (mp, prefix = '') => {
			if (mp.properties) {
				Object.keys(mp.properties).forEach((mpp) => {
					fieldObject[type].push(`${prefix}${mpp}`);
					const field = mp.properties[mpp];
					if (field && field.properties) {
						setFields(field, `${prefix}${mpp}.`);
					}
				});
			}
		};
		setFields(m);
	};
	Object.keys(mappings).forEach(k => checkIfPropertyPresent(mappings[k], k));
	return fieldObject;
};
