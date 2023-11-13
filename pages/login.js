
// Import necessary Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPcuSwsWJgjbVCI2uaj9x3Fg7buTvgMsM",
  authDomain: "bankslipverificationsystem.firebaseapp.com",
  databaseURL: "https://bankslipverificationsystem-default-rtdb.firebaseio.com",
  projectId: "bankslipverificationsystem",
  storageBucket: "bankslipverificationsystem.appspot.com",
  messagingSenderId: "276466073371",
  appId: "1:276466073371:web:ca099b87323bfeefa25dbe"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase auth instance
const auth = getAuth(app);

// Login function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;


  // Use the hardcoded credentials for testing

  const users = [
    { email: "david.ocan@studmc.kiu.ac.ug", password: "12345678", redirect: "/pages/student/home.html" },
    { email: "kingkarberg@studmc.kiu.ac.ug", password: "erik&dan", redirect: "/pages/student/home.html" },
    { email: "daniel@studmc.kiu.ac.ug", password: "123456", redirect: "/pages/student/home.html" }
  ];
  
  // Check if the entered credentials match any user
  const matchedUser = users.find(user => user.email === email && user.password === password);
  
  if (matchedUser) {
    // Manually sign in the user using Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Logged in:', user);
        // Redirect to the specified page
        window.location.href = matchedUser.redirect;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorCode, errorMessage);
        alert(errorMessage); // Display error to the user
      });
  } else {
    alert("Invalid credentials");
  }
} 

// Event listener for login button click
document.getElementById('loginButton').addEventListener('click', login);
