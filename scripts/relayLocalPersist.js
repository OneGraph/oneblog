const http = require('http');
const {default: persistQuery} = require('./persistQuery');

async function requestListener(req, res) {
  if (req.method === 'POST') {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    try {
      if (req.headers['content-type'] !== 'application/x-www-form-urlencoded') {
        throw new Error(
          'Only "application/x-www-form-urlencoded" requests are supported.',
        );
      }
      const text = new URLSearchParams(data).get('text');
      if (text == null) {
        throw new Error('Expected to have `text` parameter in the POST.');
      }
      const id = await persistQuery(text);
      res.end(JSON.stringify({id: id}));
    } catch (e) {
      console.error(e);
      res.writeHead(400);
      res.end(`Unable to save query: ${e}.`);
    }
  } else {
    res.writeHead(400);
    res.end('Request is not supported.');
  }
}

function start(port) {
  let serverPort = port;
  if (serverPort == null) {
    serverPort = 2999;
  }
  const server = http.createServer(requestListener);
  return new Promise((resolve) => {
    server.on('listening', () => {
      resolve({server, port: server.address().port});
    });
    server.listen(serverPort);
  });
}

exports.default = start;

if (require.main === module) {
  start().then(({port}) => {
    console.log('started relay persist server on port', port);
  });
}
