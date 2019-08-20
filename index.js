// index.js for firebase function

const functions = require('firebase-functions');
const {app} = require('./build/server').default;

exports.app = functions.https.onRequest(app)
