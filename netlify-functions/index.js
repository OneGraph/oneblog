const awsServerlessExpress = require('aws-serverless-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'font/eot',
  'font/opentype',
  'font/otf',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/gif',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml',
];

const {createApp} = require('../build/server').default;

const app = createApp();
app.use(awsServerlessExpressMiddleware.eventContext());
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
