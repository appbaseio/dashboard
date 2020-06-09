// eslint-disable-next-line import/no-extraneous-dependencies
const link = require('linkinator');

const isProduction = String(process.env.NODE_ENV) === 'production';

async function checkSite() {
	// create a new `LinkChecker` that we'll use to run the scan.
	const checker = new link.LinkChecker();

	// Respond to the beginning of a new page being scanned
	checker.on('pagestart', url => {
		// console.log(`Scanning ${url}`);
	});

	// After a page is scanned, check out the results!
	checker.on('link', result => {
		if (result.state === 'BROKEN') {
			console.error(result);
		}
	});

	// Go ahead and start the scan! As events occur, we will see them above.
	const result = await checker.check({
		path: isProduction ? process.env.URL : 'http://localhost:1357',
		recurse: true,
		linksToSkip: ['http://localhost:1357'],
	});

	// How many links did we scan?
	// console.log(`Scanned total of ${result.links.length} links!`);

	// Check to see if the scan passed!
	if (result.passed) return true;

	// The final result will contain the list of checked links, and the pass/fail
	const brokeLinksCount = result.links.filter(x => x.state === 'BROKEN');
	console.error('BROKEN LINKS :(', brokeLinksCount);
	return !brokeLinksCount.length;
}

export default checkSite;
