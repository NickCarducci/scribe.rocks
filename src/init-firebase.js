import { initializeApp } from "firebase/app";
import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
  apiKey: "AIzaSyDpcjBe1rXBgqRNOiW_VISqYH54lbLRfLU",
  authDomain: "nickcarducci2022.firebaseapp.com",
  databaseURL: "https://nickcarducci2022.firebaseio.com",
  projectId: "nickcarducci2022",
  storageBucket: "nickcarducci2022.appspot.com",
  messagingSenderId: "17361963058",
  appId: "1:17361963058:web:2fc4125921d40f4800542b"
};
//if (!firebase.apps.length) {
const firebase = initializeApp(firebaseConfig);
//firebase.firestore().enablePersistence(false);
//}
//firebase.firestore().enablePersistence({ synchronizeTabs: true });
//firebase.auth();
//firebase.storage();
/*.settings({
  cacheSizeBytes: 1048576
});*/
//firebase.firestore().settings({ persistence: false });

export default firebase;
