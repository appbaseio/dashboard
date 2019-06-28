const fs = require('fs');

fs.writeFileSync(
	'./.env',
	`SENTRY_AUTH_TOKEN=${process.env.SENTRY_TOKEN}
SENTRY_URL=https://sentry.io/
SENTRY_ORG=appbase-1
SENTRY_PROJECT=frontend
CONTEXT=${process.env.CONTEXT}`,
);
