const serverless = require('serverless-http');

const {createApp} = require('../build/server').default;

const app = createApp('/.netlify/functions/index');

module.exports.handler = serverless(app);
