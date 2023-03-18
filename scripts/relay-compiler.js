const {tmpdir} = require('node:os');
const {mkdtempSync, writeFileSync} = require('node:fs');
const {sep} = require('node:path');
const relayConfig = require('../relay.config.json');
const {default: persistServer} = require('./relayLocalPersist');
const relayBin = require('relay-compiler');
const spawn = require('child_process').spawn;

async function go() {
  const {server, port} = await persistServer(0);

  console.log('started persist server on port', port);

  const newRelayConfig = {
    ...relayConfig,
    persistConfig: {url: `http://localhost:${port}`},
  };

  const tmpDir = mkdtempSync(`${tmpdir()}${sep}`);
  const configFile = `${tmpDir}${sep}relay.config.json`;
  writeFileSync(configFile, JSON.stringify(newRelayConfig, null, 2), 'utf8');

  const [_node, _file, ...args] = process.argv;
  spawn(relayBin, [...args, configFile], {stdio: 'inherit'}).on('exit', () => {
    server.close();
    process.exit();
  });
}

go();
