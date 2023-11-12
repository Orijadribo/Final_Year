const firebaseConfig = {
    apiKey: "AIzaSyAPcuSwsWJgjbVCI2uaj9x3Fg7buTvgMsM",
    authDomain: "bankslipverificationsystem.firebaseapp.com",
    databaseURL: "https://bankslipverificationsystem-default-rtdb.firebaseio.com",
    projectId: "bankslipverificationsystem",
    storageBucket: "bankslipverificationsystem.appspot.com",
    messagingSenderId: "276466073371",
    appId: "1:276466073371:web:ca099b87323bfeefa25dbe"
  };

// Initialize Firebase with your config
firebase.initializeApp(firebaseConfig);

// initialize variables
const auth = firebase.auth();
const database = firebase.database();