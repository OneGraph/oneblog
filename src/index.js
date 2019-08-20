import http from "http";
import fetch from "node-fetch";
// Allows us to use fetch on node side
global.fetch = fetch;

const app = require("./server").default;

const server = http.createServer(app);

let nextApp = app;
let currentApp = app;

function startServer() {
  server.listen(process.env.PORT || 3000, error => {
    if (error) {
      console.log(error);
    }
    console.log("🚀 started");
  });
}

// Don't start server if we're called inside of a firebase function
if (!process.env.FIREBASE_CONFIG && !process.env.NETLIFY) {
  startServer();
  if (module.hot) {
    console.log("✅  Server-side HMR Enabled!");

    module.hot.accept("./server", () => {
      console.log("🔁  HMR Reloading `./server`...");

      try {
        nextApp = require("./server").default;
        server.removeListener("request", currentApp);
        server.on("request", nextApp);
        currentApp = nextApp;
      } catch (error) {
        console.error(error);
      }
    });
  }
}

export default { app, startServer };
