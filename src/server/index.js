

// Dependencies
import path from 'path';
import server from '@jmaguirrei/server';
import methods from '/server/api/methods';
import initServices from '/server/lib/services';
import { routes } from '/lib/routes';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = require('../../env.json');

const {
  BASE_URL,
  BASE_FOLDER,
  HTTP_PORT,
  MONGO_URI,
  SENDGRID_API_KEY,
  USE_SERVICE_WORKER,
} = envFile[nodeEnv];

initServices({ SENDGRID_API_KEY });
const config = {
  moduleName: 'sign',
  defaultRoute: 'signin',
  baseUrl: BASE_URL,
  baseFolder: BASE_FOLDER,
  httpPort: HTTP_PORT,
  mongoURI: MONGO_URI,
  useServiceWorker: USE_SERVICE_WORKER,
  distFolder: path.join(__dirname, '/../../dist'),
};

server.init({ config, methods, routes })
.then(() => {
  console.log('Server started, DB running...');
})
.catch(err => {
  console.log(err);
});

