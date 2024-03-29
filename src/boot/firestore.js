import { boot } from "quasar/wrappers";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ... other firebase imports
// configuration with .env files
// var firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

var firebaseConfig = {
  apiKey: "AIzaSyDqv2y-GpipRQMHwKzYwLCN4CHS7csdbo0",
  authDomain: "fir-test-8b7e6.firebaseapp.com",
  projectId: "fir-test-8b7e6",
  storageBucket: "fir-test-8b7e6.appspot.com",
  messagingSenderId: "666600484295",
  appId: "1:666600484295:web:2818cf96b5daf2f81cfde2",
  measurementId: "G-L1XY4BHVM7",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); // auth object for the firebase

// used for the firestore refs
const firebaseDatabase = getFirestore(firebaseApp); // firestore database

export default boot(({ app }) => {
  app.config.globalProperties.$firebaseDatabase = firebaseDatabase;
  app.config.globalProperties.$auth = auth;
});

export { firebaseDatabase, auth };
