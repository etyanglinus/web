import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyBhPVJQjVKv5BqlJIyg1p8FtyLlqBzY1sg",
  authDomain: "fasta-rides-457315.firebaseapp.com",
  projectId: "fasta-rides-457315",
  storageBucket: "fasta-rides-457315.firebasestorage.app",
  messagingSenderId: "833886382257",
  appId: "1:833886382257:web:b347c19f1400383595da90",
  measurementId: "G-R3Q3BLB5ZK"
};

const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(firebaseApp);

// Correctly export a promise that resolves to messaging instance (or null)
export const getMessagingObject = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    return null;
  } catch (err) {
    console.error("Messaging not supported:", err);
    return null;
  }
};

// fetchToken function
export const fetchToken = async (setTokenFound, setFcmToken) => {
  try {
    const messaging = await getMessagingObject();
    if (!messaging) return;

    const currentToken = await getToken(messaging, {
      vapidKey:
        "BH9bdhUCaGYcpUs0tzLdufqXmPmesdFMF4Ue8_m-83gAfkEkhH1Ly6iL4XCzHvY-AMweAguV2cFpM1rE4N6_0Mg",
    });

    if (currentToken) {
      setTokenFound(true);
      setFcmToken(currentToken);
    } else {
      setTokenFound(false);
      setFcmToken();
    }
  } catch (err) {
    console.error("Token fetch error:", err);
  }
};

// onMessageListener function
export const onMessageListener = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const messaging = await getMessagingObject();
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } catch (err) {
      reject(err);
    }
  });
