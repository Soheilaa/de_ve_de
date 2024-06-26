// my web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzmTVde25FiMslZWWIpu5BUElDs3BzkPU",
  authDomain: "de-ve-de-88729.firebaseapp.com",
  projectId: "de-ve-de-88729",
  storageBucket: "de-ve-de-88729.appspot.com",
  messagingSenderId: "542001431129",
  appId: "1:542001431129:web:2a6818595adecd9ad42748"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Exporting db for use in other modules
export { db };










