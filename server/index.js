const http = require('http');
const fs = require('fs');
const path = require('path');
const {
  setResponse,
  staticSource,
  receiveFile_buffer,
  receiveFile_stream,
} = require('./handlers');
const config = require('../config');

const server = http.createServer((req, res) => {

  console.log(req.method, req.url);

  if (req.method.toLocaleLowerCase() === 'get') {
    switch (req.url) {
      case '/':
        staticSource(res, path.join(__dirname, '../index.html'), {
          header: {
            'Content-Type': 'text/html'
          }
        });
        break;
      case '/data':
        setResponse(req, res);
        break;
      default:
        staticSource(res, path.join(__dirname, '../', req.url));
        break;
    }
  } else if (req.method.toLocaleLowerCase() === 'post') {
    receiveFile_buffer(req, res);
  }

})


server.listen(config.port);
console.log(`server is listening on http://${(config.server||'127.0.0.1')}:${config.port}`);