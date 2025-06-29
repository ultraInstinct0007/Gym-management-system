import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBv8bTwBRO0F71EseB_UzzM_uPPls5by2A",
  authDomain: "gym-2751e.firebaseapp.com",
  projectId: "gym-2751e",
  appId: "1:85520312094:web:3043af4d40c653bdb2cb0f",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const toggleLink = document.getElementById("toggleLink");
const toggleText = document.getElementById("toggleText");
const authForm = document.getElementById("authForm");
const statusMsg = document.getElementById("statusMsg");

// ----- initial state -----
let isLogin = true;

// parent element is always present
toggleText.addEventListener("click", (e) => {
  // act only when the real link was clicked
  if (e.target.id !== "toggleLink") return;
  e.preventDefault();

  isLogin = !isLogin;                               // toggle mode
  formTitle.textContent = isLogin
    ? "Member Login"
    : "Member Registration";
  submitBtn.textContent = isLogin ? "Log In" : "Register";

  // rebuild the helper sentence + link
  toggleText.innerHTML = isLogin
    ? `Don't have an account? <a href="#" id="toggleLink">Register here</a>`
    : `Already have an account? <a href="#" id="toggleLink">Log in here</a>`;
});


authForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (isLogin) {
    // Login
    signInWithEmailAndPassword(auth, email, password)
      .then(userCred => {
        statusMsg.textContent = " Logged in: " + userCred.user.email;
        window.location.href="dashboard.html";
      })

      .catch(err => {
        statusMsg.textContent = "Try again " + err.message;
      });
  } else {
    // Register
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCred => {
        statusMsg.textContent = "✅ Registered: " + userCred.user.email;
      })
      .catch(err => {
        statusMsg.textContent = "❌ " + err.message;
      });
  }
});
