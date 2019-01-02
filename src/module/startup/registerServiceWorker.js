
export default function registerServiceWorker() {

  if ('serviceWorker' in window.navigator) {
    window.navigator.serviceWorker
    .register('./sw.js', { scope: './' })
    .then(() => {
      console.log('Service Worker registration OK');
    })
    .catch(error => {
      console.log('Service Worker registration FAILED', error);
    });
  }

}


