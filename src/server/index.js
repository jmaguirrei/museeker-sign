

// Dependencies
import path from 'path';
import server from '@jmaguirrei/server';
import methods from '/server/api/methods';
import initServices from '/server/lib/services';
import config from '../config.js';

const secretsFile = require('../../secrets.json');
const processEnv = process.env.NODE_ENV || 'development';
const configEnv = config.env[processEnv];

const { MONGO_URI, SENDGRID_API_KEY } = secretsFile[processEnv];

server.init({
  env: {
    moduleName: 'sign',
    mongoURI: MONGO_URI,
    distFolder: path.join(__dirname, '/../../dist'),
    rootFolder: path.join(__dirname, '/../../../_root'),
    ...configEnv,
  },
  config: {
    methods,
    client: config.client,
    pages: [ 'signin', 'signup', 'forgot', 'welcome' ],
    defaultPage: 'signin',
  },
})
.then(() => {
  initServices({ SENDGRID_API_KEY });
  console.log('Server started, DB running...');
})
.catch(err => {
  console.log(err);
});

