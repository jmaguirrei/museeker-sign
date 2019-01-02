
import _ from '@jmaguirrei/belt';
import { Store, connectStoreToServer } from '/module/context';
import { routes } from '/module/routes';

export default function firstRender() {

  const Container = routes['_root_'];


  window.onload = () => {

    const defaultAppData = {
      router: {
        pages: [ 'signin', 'signup', 'welcome', 'forgot' ],
        currentPage: 'signin',
      },
      query: {
        user: '',
      },
      config: {
        siteUrl: 'http://localhost:4001',
        socketUrl: 'ws://localhost:4002',
      }
    };

    const router = _.get(window.__APP_DATA__, 'router', defaultAppData.router);
    const query = _.get(window.__APP_DATA__, 'query', defaultAppData.query);
    const config = _.get(window.__APP_DATA__, 'config', defaultAppData.config);
    const user_id = query.user;

    Store.methods.set({
      currentPage: router.currentPage,
      user_id,
    });

    connectStoreToServer(Store, { user_id, config })
    .then(() => {
      Store.methods.render(Container, {
        router: {
          pages: router.pages,
          currentPage: router.currentPage,
        },
      }, 'root');
      Store.methods.emit('MOUNTED');
    });

  };


}


