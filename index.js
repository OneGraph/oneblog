// index.js for firebase function

const functions = require('firebase-functions');
const {createApp} = require('./build/server').default;

const config = functions.config();

const basePath = config && config.changelog && config.changelog.public_path;

const app = createApp(basePath);

exports.changelog = functions.https.onRequest(app);
