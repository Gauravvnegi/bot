importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

firebase.initializeApp({
  apiKey: 'AIzaSyBVotX7FRNCpG7WakjyDnxnUmgYDerLyHI',
  authDomain: 'push-notification-6455a.firebaseapp.com',
  databaseURL: 'https://push-notification-6455a-default-rtdb.firebaseio.com',
  projectId: 'push-notification-6455a',
  storageBucket: 'push-notification-6455a.appspot.com',
  messagingSenderId: '171589915997',
  appId: '1:171589915997:web:8ba37d0c270148914204b4',
  measurementId: 'G-CV14FFBNNF',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
