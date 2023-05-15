// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'default',
  base_url: 'https://dev.api.botshot.ai:8443',
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
  createWithUrl: 'https://dev.createwith.botshot.ai',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
