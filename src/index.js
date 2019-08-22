import http from 'http';
import fetch from 'node-fetch';
// Allows us to use fetch on node side
global.fetch = fetch;

const createApp = require('./server').default;

function startServer(basePath) {
  const app = createApp(basePath);
  const server = http.createServer(app);
  server.listen(process.env.PORT || 3000, error => {
    if (error) {
      console.error(error);
    }
    console.log('🚀 started');
  });
  return {app, server};
}

// Don't start server if we're called inside of a firebase function
if (!process.env.FIREBASE_CONFIG && !process.env.NETLIFY) {
  let {server, app} = startServer();
  let nextApp = app;
  let currentApp = app;

  if (module.hot) {
    console.log('✅  Server-side HMR Enabled!');

    module.hot.accept('./server', () => {
      console.log('🔁  HMR Reloading `./server`...');

      try {
        nextApp = require('./server').default();
        server.removeListener('request', currentApp);
        server.on('request', nextApp);
        currentApp = nextApp;
      } catch (error) {
        console.error(error);
      }
    });
  }
}

export default {createApp, startServer};
