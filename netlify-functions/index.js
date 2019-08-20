const serverless = require("serverless-http");

const { app } = require("../build/server").default;

exports.handler = serverless(app, {
  basePath: "/.netlify/functions/index",
  request(req) {
    if (!req.url) {
      req.url = "/";
    }
  }
});
