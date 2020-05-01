import checkSite from '../../scripts/site-checker';

test('broken links', async () => {
	const res = await checkSite();
	if (res) expect(true).toEqual(true);
	else expect(true).toEqual(false);
}, 30000000);
