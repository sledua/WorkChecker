import * as firebase from 'firebase';
import 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyAc2265y__KIgMYtFeosl_KvDTeP92SmkY",
    authDomain: "work-checker-b96e4.firebaseapp.com",
    databaseURL: "https://work-checker-b96e4.firebaseio.com",
    projectId: "work-checker-b96e4",
    storageBucket: "work-checker-b96e4.appspot.com",
    messagingSenderId: "86335408325",
    appId: "1:86335408325:web:e48367964c3281a3ac08ac",
    measurementId: "G-PBCRZGJ2Q2"
};
firebase.initializeApp(firebaseConfig);
export default firebase;
