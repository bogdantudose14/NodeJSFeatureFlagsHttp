// router.js
const router = {
  // this is our missing route handler
  '*': (req, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'Not Found',
      })
    );
  },

  register: function (httpCommand, httpHandler) {
    if (router[httpCommand]) {
      throw new Error(`Command ${httpCommand} already exists.`);
    }

    router[httpCommand] = httpHandler;
  },

  findHandler: function (req) {
    const handler = router[req.method + req.url] || router['*'];
    return handler;
  },
};

export { router };
