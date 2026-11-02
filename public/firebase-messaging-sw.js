importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
// // Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBhPVJQjVKv5BqlJIyg1p8FtyLlqBzY1sg",
  authDomain: "fasta-rides-457315.firebaseapp.com",
  databaseURL: "https://fasta-rides-457315-default-rtdb.firebaseio.com",
  projectId: "fasta-rides-457315",
  storageBucket: "fasta-rides-457315.firebasestorage.app",
  messagingSenderId: "833886382257",
  appId: "1:833886382257:web:b347c19f1400383595da90",
  measurementId: "G-R3Q3BLB5ZK"
};

firebase?.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase?.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
