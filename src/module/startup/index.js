

import registerServiceWorker from './registerServiceWorker';
import firstRender from './firstRender';

export default function startup() {

  console.log('----------------- App client side initialized !! ------------------');

  if (process.env.NODE_ENV === 'production') registerServiceWorker();
  firstRender();

}


