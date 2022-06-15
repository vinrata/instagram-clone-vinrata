import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

  const firebaseApp =  firebase.initializeApp({
    apiKey: "AIzaSyBorfBX6gL_Lr6eczz7vMZ_IdJimHZVO2c",
    authDomain: "instagram-clone-vinrata-96143.firebaseapp.com",
    projectId: "instagram-clone-vinrata-96143",
    storageBucket: "instagram-clone-vinrata-96143.appspot.com",
    messagingSenderId: "803092374975",
    appId: "1:803092374975:web:eae566d825509ccadded0a",
    measurementId: "G-YVRH5EGBVB"

  });
  //const firebaseApp = firebase.initializeApp(firebaseConfig);

  const database = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();


  export  { database, auth, storage };