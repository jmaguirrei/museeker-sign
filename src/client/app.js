
import config from '../config.js';

let client;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  client = window.jmaguirrei_client.init(config.client);
} else {
  client = require('@jmaguirrei/client').default.init(config.client);
}

export default client;
