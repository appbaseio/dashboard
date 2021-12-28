const fs = require('fs');

const sentryEnv = `
[defaults]
url=https://sentry.io/
org=appbase-io
project=appbase-dashboard
[auth]
token=${process.env.SENTRY_TOKEN}
`;

const envFile = `
CONTEXT=${process.env.CONTEXT}
SENTRY_TOKEN=${process.env.SENTRY_TOKEN || ''}
NODE_ENV=production
`;

fs.writeFileSync('./.sentryclirc', sentryEnv);
fs.writeFileSync('./.env', envFile);
