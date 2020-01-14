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

function fixImageProxy(event) {
  for (const prefix of ['/image-proxy/', '/first-frame/']) {
    if (event.path && event.path.startsWith(prefix)) {
      const url = event.path.substr(prefix.length);
      if (url.indexOf('/') !== -1) {
        return {
          ...event,
          path: `${prefix}${encodeURIComponent(url)}`,
        };
      }
    }
  }
  return event;
}

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, fixImageProxy(event), context);
};
