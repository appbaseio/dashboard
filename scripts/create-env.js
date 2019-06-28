const fs = require('fs');

const envFile = `SENTRY_AUTH_TOKEN=${process.env.SENTRY_TOKEN}
SENTRY_URL=https://sentry.io/
SENTRY_ORG=appbase-1
SENTRY_PROJECT=frontend
ACC_API=${process.env.ACC_API}
SCALR_API=${process.env.SCALR_API}`;

// eslint-disable-next-line no-console
console.log('envFile: ', envFile);

// eslint-disable-next-line no-console
console.log('all envs: ', process.env);

fs.writeFileSync('./.env', envFile);
