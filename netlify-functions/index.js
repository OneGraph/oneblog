const serverless = require('serverless-http');

const {createApp} = require('../build/server').default;

const app = createApp();

module.exports.handler = serverless(app, {
  basePath: '/.netlify/functions/index',
});
