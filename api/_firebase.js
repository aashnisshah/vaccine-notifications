// const firebaseAdmin = require("firebase-admin");

// if (!firebaseAdmin.apps.length) {
//   firebaseAdmin.initializeApp({
//     credential: firebaseAdmin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     }),
//     databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
//   });
// }

// module.exports = firebaseAdmin;

const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

// Make sure it hasn't already been initialized
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  });
}

module.exports = firebase;