const { HttpService } = require('henhouse');
const { resolve } = require('path');

const httpServive = new HttpService({ staticRoot: resolve(__dirname, 'examples') });
httpServive
  .addStatic('/dist', { root: resolve(__dirname) })
  .listen(5000);

console.log('listening on port 5000.');
