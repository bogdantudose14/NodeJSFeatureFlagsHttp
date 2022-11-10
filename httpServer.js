import configcat from 'configcat-node';
import http from 'http';
import { router } from './router.js';
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';

router.register('GET/serverStatus', (req, res) => {
  let expressServerReponseRight = getExpressServerResponseRight().then(
    (result) => {
      return result;
    },
    (error) => {
      throw new Error('Communication error!');
    }
  );

  expressServerReponseRight.then(function (result) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        message:
          result === true
            ? 'I am allowed to talk to you'
            : 'I do not talk to strangers for the moment',
      })
    );
  });
});

router.register('POST/product', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      product: {
        name: 'Product Name',
        price: 100,
      },
    })
  );
});

const server = http.createServer((req, res) => {
  const handler = router.findHandler(req);
  handler(req, res);
});

// #region ConfigCat Feature Flags Demo

let logger = configcat.createConsoleLogger(3); // Set the log level to INFO to track how your feature flags were evaluated. When moving to production, you can remove this line to avoid too detailed logging.

let configCatClient = configcat.createClientWithAutoPoll(
  '37zaCKxtxU2MtekOuC5PAw/KWWWsZ2r3kqr5wlcuYFZEA', // <-- This is the actual SDK Key for your Test Environment environment
  {
    pollIntervalSeconds: 5,
    logger: logger,
  }
);

async function getExpressServerResponseRight() {
  const expressServerResponse = await configCatClient.getValueAsync(
    'expressServerResponse',
    false
  );

  return expressServerResponse;
}

// #endregion

let serverPort = 8080;

server.listen(serverPort);

console.log(`Server is running on port ${serverPort}`);
