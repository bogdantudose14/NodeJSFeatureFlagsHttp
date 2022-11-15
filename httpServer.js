import configcat from 'configcat-node';
import http from 'http';
import { router } from './router.js';

router.register('GET/serverStatus', (req, res) => {
  let httpServerReponseRight = getHttpServerResponseRight().then(
    (result) => {
      return result;
    },
    (error) => {
      throw new Error('Communication error!');
    }
  );

  httpServerReponseRight.then(function (result) {
    if (result) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          message: 'I am allowed to talk to you',
        })
      );
    } else {
      res.writeHead(503).end();
    }
  });
});

const server = http.createServer((req, res) => {
  const handler = router.findHandler(req);
  handler(req, res);
});

// #region ConfigCat Feature Flags Demo

// Set the log level to INFO to track how your feature flags were evaluated.

let logger = configcat.createConsoleLogger(3);

// Initialize the client using your SDK key
let configCatClient = configcat.createClientWithAutoPoll(
  '37zaCKxtxU2MtekOuC5PAw/KWWWsZ2r3kqr5wlcuYFZEA', // <-- This is the actual SDK Key for your Test Environment environment
  {
    pollIntervalSeconds: 5, // how often to update the variable value from the ConfigCat server
    logger: logger, // use the logger created previously
  }
);

// asynchronous method for getting the true/false value of the flag
async function getHttpServerResponseRight() {
  const httpServerResponse = await configCatClient.getValueAsync(
    'httpserveractive',
    false
  );

  return httpServerResponse;
}

// #endregion

let serverPort = 8080;

server.listen(serverPort);

console.log(`Server is running on port ${serverPort}`);
