import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  name: 'staging',
  base_url: 'https://stg.api.botshot.ai:31956',
  firebase: {
    apiKey: 'AIzaSyBVotX7FRNCpG7WakjyDnxnUmgYDerLyHI',
    authDomain: 'push-notification-6455a.firebaseapp.com',
    databaseURL: 'https://push-notification-6455a-default-rtdb.firebaseio.com',
    projectId: 'push-notification-6455a',
    storageBucket: 'push-notification-6455a.appspot.com',
    messagingSenderId: '171589915997',
    appId: '1:171589915997:web:8ba37d0c270148914204b4',
    measurementId: 'G-CV14FFBNNF',
  },
  guest_home: 'https://botshot.ai',
  createWithUrl: 'https://stg.createwith.botshot.ai',
};
