import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyDLb-psnnd57G5gScaGkZTA2b1I7Nzw0h4",
    authDomain: "wireframeproject-5318e.firebaseapp.com",
    databaseURL: "https://wireframeproject-5318e.firebaseio.com",
    projectId: "wireframeproject-5318e",
    storageBucket: "wireframeproject-5318e.appspot.com",
    messagingSenderId: "745502562026",
    appId: "1:745502562026:web:d320f6bef9b24ca2a52993",
    measurementId: "G-XYTELXKG3F"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;